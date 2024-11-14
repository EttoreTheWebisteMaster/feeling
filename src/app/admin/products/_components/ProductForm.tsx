'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';
import { addProduct, updateProduct } from '../../_actions/products';
import { useFormState, useFormStatus } from 'react-dom';
import { Product, Collection } from '@prisma/client';
import Image from 'next/image';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function ProductForm({
	product,
	collections,
}: Readonly<{ product?: Product | null; collections: Array<Collection> }>) {
	const [error, action] = useFormState(
		product == null ? addProduct : updateProduct.bind(null, product.id),
		{}
	);
	const [priceInCents, setPriceInCents] = useState<number | undefined>(
		product?.priceInCents
	);

  const [collection, setCollection] = useState(product?.collectionId || '');

	let html_input = (
		<div className='space-y-2'>
			<Select
				defaultValue={collection}
				onValueChange={setCollection}
        name='collectionId'
			>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Collection' />
				</SelectTrigger>
				<SelectContent>
					{collections.map((collection) => {
						return (
							<SelectItem
								value={collection.id}
								key={collection.id}
							>
								{collection.name}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			{error.collectionId && (
				<div className='text-destructive'>{error.collectionId}</div>
			)}
		</div>
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
					defaultValue={product?.name || ''}
				/>
				{error.name && (
					<div className='text-destructive'>{error.name}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='priceInCents'>Price In Cents</Label>
				<Input
					type='number'
					id='priceInCents'
					name='priceInCents'
					required
					value={priceInCents}
					onChange={(e) =>
						setPriceInCents(Number(e.target.value) || undefined)
					}
				/>
				<div className='text-muted-foreground'>
					{formatCurrency((priceInCents || 0) / 100)}
				</div>
				{error.priceInCents && (
					<div className='text-destructive'>{error.priceInCents}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					id='description'
					name='description'
					required
					defaultValue={product?.description}
				/>
				{error.description && (
					<div className='text-destructive'>{error.description}</div>
				)}
			</div>
			{html_input}
			<div className='space-y-2'>
				<Label htmlFor='image'>Image</Label>
				<Input
					type='file'
					id='image'
					name='image'
					required={product == null}
				/>
				{product != null && (
					<Image
						src={product.imagePath}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image && (
					<div className='text-destructive'>{error.image}</div>
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
