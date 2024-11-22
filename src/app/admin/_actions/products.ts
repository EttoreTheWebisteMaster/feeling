'use server';

import db from '@/db/db';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob'; // Import Vercel Blob helpers

// File schema for handling image uploads
const fileSchema = z.instanceof(File, { message: 'File is required' });
const imageSchema = fileSchema.refine(
	(file) => file.size > 0 && file.type.startsWith('image/'),
	{ message: 'File must be a non-empty image' }
);

// Validation schema for new product data
const addProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	priceInCents: z.number().positive(),
	image: imageSchema, // Image file validation
});

// Add a new product
export async function addProduct(prevState: unknown, formData: FormData) {
	const result = addProductSchema.safeParse(
		Object.fromEntries(formData.entries())
	);
	if (!result.success) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// Define unique blob key for the image
	const imageKey = `products/${crypto.randomUUID()}-${data.image.name}`;

	// Upload image to Vercel Blob Storage
	const arrayBuffer = await data.image.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);

	const { url: imageUrl } = await put(imageKey, uint8Array, {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN, // Use the blob token for authentication
	});

	// Create product in the database
	await db.product.create({
		data: {
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			imagePath: imageUrl, // Save blob URL instead of a file path
			imagePath1: '',
			imagePath2: '',
			imagePath3: '',
			imagePath4: '',
			imagePath5: '',
		},
	});

	revalidatePath('/');
	revalidatePath('/products');

	// Redirect to the products admin page
	redirect('/admin/products');
}

// Schema for updating a product
const editProductSchema = addProductSchema.extend({
	image: imageSchema.optional(),
});

// Update an existing product
export async function updateProduct(
	id: string,
	prevState: unknown,
	formData: FormData
) {
	const result = editProductSchema.safeParse(
		Object.fromEntries(formData.entries())
	);
	if (!result.success) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// Fetch existing product
	const product = await db.product.findUnique({ where: { id } });
	if (!product) return notFound();

	let imageUrl = product.imagePath;

	// Check if new image file is uploaded
	if (data.image) {
		// Delete the old image from blob storage
		await del(product.imagePath, {
			token: process.env.BLOB_READ_WRITE_TOKEN, // Authenticate deletion
		});

		// Upload new image to blob storage
		const newImageKey = `products/${crypto.randomUUID()}-${
			data.image.name
		}`;
		const arrayBuffer = await data.image.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		const { url } = await put(newImageKey, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		imageUrl = url; // Update image URL
	}

	// Update product in the database
	await db.product.update({
		where: { id },
		data: {
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			imagePath: imageUrl, // Save updated blob URL
		},
	});

	revalidatePath('/');
	revalidatePath('/products');

	// Redirect to the products admin page
	redirect('/admin/products');
}

export async function toggleProductAvailability(
	id: string,
	isAvailable: boolean
) {
	await db.product.update({ where: { id }, data: { isAvailable } });

	revalidatePath('/');
	revalidatePath('/products');
}

export async function deleteProduct(id: string) {
	const product = await db.product.delete({ where: { id } });

	if (!product) return notFound();

	// Delete image from blob storage
	await del(product.imagePath, {
		token: process.env.BLOB_READ_WRITE_TOKEN, // Authenticate deletion
	});

	revalidatePath('/');
	revalidatePath('/products');
}
