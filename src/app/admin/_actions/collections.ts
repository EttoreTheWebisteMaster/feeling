'use server';

import db from '@/db/db';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob'; // Import Vercel Blob helpers

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

	// Define unique blob key for the video
	const videoKey = `collections/${crypto.randomUUID()}-${data.video.name}`;

	// Upload video to Vercel Blob Storage
	const arrayBuffer = await data.video.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);

	const { url: videoUrl } = await put(videoKey, uint8Array, {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN, // Use the blob token for authentication
	});

	// Create collection in the database
	await db.collection.create({
		data: {
			isAvailable: false,
			name: data.name,
			description: data.description,
			title: data.title,
			videoPath: videoUrl, // Save blob URL instead of a file path
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

	let videoUrl = collection.videoPath;

	// Check if new video file is uploaded
	if (data.video) {
		// Delete the old video from blob storage
		await del(collection.videoPath, {
			token: process.env.BLOB_READ_WRITE_TOKEN, // Authenticate deletion
		});

		// Upload new video to blob storage
		const newVideoKey = `collections/${crypto.randomUUID()}-${
			data.video.name
		}`;
		const arrayBuffer = await data.video.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		const { url } = await put(newVideoKey, uint8Array, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		videoUrl = url; // Update video URL
	}

	// Update collection in the database
	await db.collection.update({
		where: { id },
		data: {
			isAvailable: false,
			name: data.name,
			description: data.description,
			title: data.title,
			videoPath: videoUrl, // Save updated blob URL
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

	if (!collection) return notFound();

	// Delete video from blob storage
	await del(collection.videoPath, {
		token: process.env.BLOB_READ_WRITE_TOKEN, // Authenticate deletion
	});

	revalidatePath('/');
	revalidatePath('/collections');
}
