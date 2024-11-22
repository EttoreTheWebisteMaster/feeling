'use server';

import db from '@/db/db';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { del, put } from '@vercel/blob'; // Import Blob Storage methods

const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine(
	(file) => file.size === 0 || file.type.startsWith('image/')
);

const addSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	priceInCents: z.coerce.number().int().min(1),
	collectionId: z.string().optional(),
	image: imageSchema.refine((file) => file.size > 0, 'Required'),
});

export async function addProduct(prevState: unknown, formData: FormData) {
	const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	console.log(data);

	// Upload the image to Vercel Blob Storage
	const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;

	// Upload the image to Blob Storage
	await put(imagePath, data.image.stream(), {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN, // Use the read-write token for authentication
	});

	// Store the product details in the database
	await db.product.create({
		data: {
			isAvailable: false,
			isSoldOut: false,
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			collectionId: data.collectionId,
			imagePath,
			imagePath1: '',
			imagePath2: '',
			imagePath3: '',
			imagePath4: '',
			imagePath5: '',
		} as any,
	});

	revalidatePath('/');
	revalidatePath('/products');

	redirect('/admin/products');
}

const editSchema = addSchema.extend({
	file: fileSchema.optional(),
	image: imageSchema.optional(),
});

export async function updateProduct(
	id: string,
	prevState: unknown,
	formData: FormData
) {
	const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;
	const product = await db.product.findUnique({ where: { id } });

	if (product == null) return notFound();

	let imagePath = product.imagePath;

	// Update the image if a new one is provided
	if (data.image != null && data.image.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath);

		// Upload the new image to Blob Storage
		imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
		await put(imagePath, data.image.stream(), {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Use the read-write token for authentication
		});
	}

	// Update the product in the database
	await db.product.update({
		where: { id },
		data: {
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			collectionId: data.collectionId,
			imagePath,
		},
	});

	revalidatePath('/');
	revalidatePath('/products');

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

	if (product == null) return notFound();

	// Delete the image from Blob Storage
	await deleteBlob(product.imagePath);

	revalidatePath('/');
	revalidatePath('/products');
}

// Function to delete a blob from Blob Storage
async function deleteBlob(imagePath: string) {
	try {
		// Delete the file from Blob Storage using the 'del' method
		await del(imagePath, {
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure you provide the correct token
		});
	} catch (error) {
		console.error('Error deleting blob:', error);
	}
}