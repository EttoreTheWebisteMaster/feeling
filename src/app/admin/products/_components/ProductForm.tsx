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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

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
				<Label htmlFor='image'>Cover Image</Label>
				<Input
					type='file'
					id='image'
					name='image'
					required={product == null}
				/>
				{product != null && (
					<img
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
			<div className='space-y-2'>
				<Label htmlFor='image'>Image 1</Label>
				<Input
					type='file'
					id='image1'
					name='image1'
					required={product == null}
				/>
				{product != null && (
					<img
						src={product.imagePath1}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image1 && (
					<div className='text-destructive'>{error.image1}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='image'>Image 2</Label>
				<Input
					type='file'
					id='image2'
					name='image2'
				/>
				{product != null && (
					<img
						src={product.imagePath2}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image2 && (
					<div className='text-destructive'>{error.image2}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='image'>Image 3</Label>
				<Input
					type='file'
					id='image3'
					name='image3'
				/>
				{product != null && (
					<img
						src={product.imagePath3}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image3 && (
					<div className='text-destructive'>{error.image3}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='image'>Image 4</Label>
				<Input
					type='file'
					id='image4'
					name='image4'
				/>
				{product != null && (
					<img
						src={product.imagePath4}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image4 && (
					<div className='text-destructive'>{error.image4}</div>
				)}
			</div>
			<div className='space-y-2'>
				<Label htmlFor='image'>Image 5</Label>
				<Input
					type='file'
					id='image5'
					name='image5'
				/>
				{product != null && (
					<img
						src={product.imagePath4}
						height='400'
						width='400'
						alt='Product Image'
					/>
				)}
				{error.image5 && (
					<div className='text-destructive'>{error.image5}</div>
				)}
			</div>
			<Button className='bg-red-500 hover:bg-red-400'>
				<Link href='/admin/products'>Cancel</Link>
			</Button>
			&nbsp;
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
