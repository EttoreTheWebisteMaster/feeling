'use server';

import db from '@/db/db';
import { z } from 'zod';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// File schema for handling video uploads
const fileSchema = z.instanceof(File, { message: 'File is required' });
const videoSchema = fileSchema.refine(
	(file) => file.size > 0 && file.type.startsWith('video/'),
	{ message: 'File must be a non-empty video' }
);

// Validation schema for new collection data
const addSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	title: z.string().min(1),
	video: videoSchema,
});

// Add a new collection
export async function addCollection(prevState: unknown, formData: FormData) {
	const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
	if (!result.success) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// Create directory if it doesn't exist
	await fs.mkdir('public/collections', { recursive: true });

	// Define unique path for video
	const videoPath = `/collections/${crypto.randomUUID()}-${data.video.name}`;
	const arrayBuffer = await data.video.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);

	// Save video file
	await fs.writeFile(`public${videoPath}`, uint8Array);

	// Create collection in the database
	await db.collection.create({
		data: {
			isAvailable: false,
			name: data.name,
			description: data.description,
			title: data.title,
			videoPath,
		},
	});

	revalidatePath('/');
	revalidatePath('/collections');

	// Redirect to the collections admin page
	redirect('/admin/collections');
}

// Schema for updating a collection
const editSchema = addSchema.extend({
	video: videoSchema.optional(),
});

// Update an existing collection
export async function updateCollection(
	id: string,
	prevState: unknown,
	formData: FormData
) {
	const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
	if (!result.success) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	// Fetch existing collection
	const collection = await db.collection.findUnique({ where: { id } });
	if (!collection) return notFound();

	let videoPath = collection.videoPath;

	// Check if new video file is uploaded
	if (data.video) {
		// Remove old video file
		await fs.unlink(`public${collection.videoPath}`);

		// Save new video file
		videoPath = `/collections/${crypto.randomUUID()}-${data.video.name}`;
		const arrayBuffer = await data.video.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);
		await fs.writeFile(`public${videoPath}`, uint8Array);
	}

	// Update collection in the database
	await db.collection.update({
		where: { id },
		data: {
			isAvailable: false,
			name: data.name,
			description: data.description,
			title: data.title,
			videoPath,
		},
	});

	revalidatePath('/');
	revalidatePath('/collections');

	// Redirect to the collections admin page
	redirect('/admin/collections');
}

export async function toggleCollectionAvailability(
	id: string,
	isAvailable: boolean
) {
	await db.collection.update({ where: { id }, data: { isAvailable } });

	revalidatePath('/');
	revalidatePath('/collections');
}

export async function deleteCollection(id: string) {
	const collection = await db.collection.delete({ where: { id } });

	if (collection == null) return notFound();

	await fs.unlink(`public${collection.videoPath}`);

	revalidatePath('/');
	revalidatePath('/collections');
}
