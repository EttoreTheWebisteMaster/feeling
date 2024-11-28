'use server';

import db from '@/db/db';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob'; // Ensure correct import

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
	image1: imageSchema.refine((file) => file.size > 0, 'Required'),
	image2: imageSchema.optional(),
	image3: imageSchema.optional(),
	image4: imageSchema.optional(),
	image5: imageSchema.optional(),
});

export async function addProduct(prevState: unknown, formData: FormData) {
	const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// Generate unique image path for the product image
	const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;

	// Upload the image to Blob Storage
	let arrayBuffer = await data.image.arrayBuffer();
	let uint8Array = new Uint8Array(arrayBuffer);

	const { url: imageUrl } = await put(imagePath, uint8Array, {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
	});

	// # 1
	// Generate unique image path for the product image
	const imagePath1 = `/products/${crypto.randomUUID()}-${data.image1.name}`;

	// Upload the image to Blob Storage
	arrayBuffer = await data.image1.arrayBuffer();
	uint8Array = new Uint8Array(arrayBuffer);

	const { url: imageUrl1 } = await put(imagePath1, uint8Array, {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
	});

	// # 2
	// Generate unique image path for the product image
	let imageUrl2 = '';

	// Check if image2 is provided
	if (
		data.image2 &&
		data.image2.size != 0 &&
		data.image2.name != undefined
	) {
		const imagePath2 = `/products/${crypto.randomUUID()}-${
			data.image2.name
		}`;

		// Upload the image to Blob Storage
		const arrayBuffer = await data.image2.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Assuming the `put` function uploads the image and returns a URL
		const { url } = await put(imagePath2, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
		});

		// Assign the returned URL to imageUrl2
		imageUrl2 = url;
	}

	// # 3
	// Generate unique image path for the product image
	let imageUrl3 = '';

	// Check if image3 is provided
	if (
		data.image3 &&
		data.image3.size != 0 &&
		data.image3.name != undefined
	) {
		const imagePath3 = `/products/${crypto.randomUUID()}-${
			data.image3.name
		}`;

		// Upload the image to Blob Storage
		const arrayBuffer = await data.image3.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Assuming the `put` function uploads the image and returns a URL
		const { url } = await put(imagePath3, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
		});

		// Assign the returned URL to imageUrl3
		imageUrl3 = url;
	}

	// # 4
	// Generate unique image path for the product image
	let imageUrl4 = '';

	// Check if image4 is provided
	if (
		data.image4 &&
		data.image4.size != 0 &&
		data.image4.name != undefined
	) {
		const imagePath4 = `/products/${crypto.randomUUID()}-${
			data.image4.name
		}`;

		// Upload the image to Blob Storage
		const arrayBuffer = await data.image4.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Assuming the `put` function uploads the image and returns a URL
		const { url } = await put(imagePath4, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
		});

		// Assign the returned URL to imageUrl4
		imageUrl4 = url;
	}

	// # 5
	// Generate unique image path for the product image
	let imageUrl5 = '';

	// Check if image5 is provided
	if (
		data.image5 &&
		data.image5.size != 0 &&
		data.image5.name != undefined
	) {
		const imagePath5 = `/products/${crypto.randomUUID()}-${
			data.image5.name
		}`;

		// Upload the image to Blob Storage
		const arrayBuffer = await data.image5.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Assuming the `put` function uploads the image and returns a URL
		const { url } = await put(imagePath5, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Use the correct token for authentication
		});

		// Assign the returned URL to imageUrl5
		imageUrl5 = url;
	}

	// Store product in the database
	await db.product.create({
		data: {
			isAvailable: false,
			isSoldOut: false,
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			collectionId: data.collectionId,
			imagePath: imageUrl,
			imagePath1: imageUrl1,
			imagePath2: imageUrl2,
			imagePath3: imageUrl3,
			imagePath4: imageUrl4,
			imagePath5: imageUrl5,
		} as any,
	});

	// Revalidate paths and redirect
	revalidatePath('/');
	revalidatePath('/products');
	redirect('/admin/products');
}

const editSchema = addSchema.extend({
	file: fileSchema.optional(),
	image: imageSchema.optional(),
	image1: imageSchema.optional(),
});

export async function updateProduct(
	id: string,
	prevState: unknown,
	formData: FormData
) {
	console.log(formData);
	const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;
	const product = await db.product.findUnique({ where: { id } });

	if (product == null) return notFound();

	let imagePath = product.imagePath;
	let imagePath1 = product.imagePath1;
	let imagePath2 = product.imagePath2;
	let imagePath3 = product.imagePath3;
	let imagePath4 = product.imagePath4;
	let imagePath5 = product.imagePath5;

	// Update the image if a new one is provided
	if (data.image != null && data.image.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath);

		// Generate a new unique image path
		imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		const { url: imageUrl } = await put(imagePath, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath = imageUrl; // Update to the new image URL
	}

	// # 1
	// Update the image if a new one is provided
	if (data.image1 != null && data.image1.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath1);

		// Generate a new unique image path
		imagePath1 = `/products/${crypto.randomUUID()}-${data.image1.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image1.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		let { url: imageUrl } = await put(imagePath1, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath1 = imageUrl; // Update to the new image URL
	}

	// # 2
	// Update the image if a new one is provided
	if (data.image2 != null && data.image2.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath2);

		// Generate a new unique image path
		imagePath2 = `/products/${crypto.randomUUID()}-${data.image2.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image2.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		let { url: imageUrl } = await put(imagePath2, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath2 = imageUrl; // Update to the new image URL
	}

	// # 3
	// Update the image if a new one is provided
	if (data.image3 != null && data.image3.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath3);

		// Generate a new unique image path
		imagePath3 = `/products/${crypto.randomUUID()}-${data.image3.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image3.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		let { url: imageUrl } = await put(imagePath3, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath3 = imageUrl; // Update to the new image URL
	}

	// # 4
	// Update the image if a new one is provided
	if (data.image4 != null && data.image4.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath4);

		// Generate a new unique image path
		imagePath4 = `/products/${crypto.randomUUID()}-${data.image4.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image4.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		let { url: imageUrl } = await put(imagePath4, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath4 = imageUrl; // Update to the new image URL
	}

	// # 5
	// Update the image if a new one is provided
	if (data.image5 != null && data.image5.size > 0) {
		// Delete the old image from Blob Storage
		await deleteBlob(product.imagePath5);

		// Generate a new unique image path
		imagePath5 = `/products/${crypto.randomUUID()}-${data.image5.name}`;

		// Upload the new image to Blob Storage
		let arrayBuffer = await data.image5.arrayBuffer();
		let uint8Array = new Uint8Array(arrayBuffer);

		let { url: imageUrl } = await put(imagePath5, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure correct token for authentication
		});

		imagePath5 = imageUrl; // Update to the new image URL
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
			imagePath1,
			imagePath2,
			imagePath3,
			imagePath4,
			imagePath5,
		},
	});

	// Revalidate paths and redirect
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
		// Use the correct method to delete the image
		await del(imagePath, {
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});
	} catch (error) {
		console.error('Error deleting blob:', error);
	}
}
