'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addCollection, updateCollection } from '../../_actions/collections';
import { useFormState, useFormStatus } from 'react-dom';
import { Collection } from '@prisma/client';

export function CollectionForm({
	collection,
}: Readonly<{
	collection?: Collection | null;
}>) {
	const [error, action] = useFormState(
		collection == null
			? addCollection
			: updateCollection.bind(null, collection.id),
		{}
	);

	return (
		<form action={action} className='space-y-8'>
			<div className='space-y-2'>
				<Label htmlFor='name'>Name</Label>
				<Input
					type='text'
					id='name'
					name='name'
					required
					defaultValue={collection?.name || ''}
				/>
				{error.name && (
					<div className='text-destructive'>{error.name}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					id='description'
					name='description'
					required
					defaultValue={collection?.description}
				/>
				{error.description && (
					<div className='text-destructive'>{error.description}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='title'>Title</Label>
				<Textarea
					id='title'
					name='title'
					required
					defaultValue={collection?.title}
				/>
				{error.title && (
					<div className='text-destructive'>{error.title}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='video'>Video</Label>
				<Input
					type='file'
					id='video'
					name='video'
					required={collection == null}
				/>
				{collection != null && (
					<video src={collection.videoPath} controls>
						Your browser does not support the video tag.
					</video>
				)}
				{error.video && (
					<div className='text-destructive'>{error.video}</div>
				)}
			</div>
			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending}>
			{pending ? 'Saving...' : 'Save'}
		</Button>
	);
}
