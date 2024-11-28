'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';

interface ProductPageProps {
	product: {
		id: string;
		name: string;
		priceInCents: number;
		imagePath1: string;
		imagePath2: string;
		imagePath3: string;
		imagePath4: string;
		imagePath5: string;
		description: string;
		collection: {
			name: string;
		} | null;
	};
}

export function ProductPage({ product }: Readonly<ProductPageProps>) {
	const [size, setSize] = useState('M');
	const [quantity, setQuantity] = useState(1);

	const handleSizeClick = (selectedSize: string) => {
		setSize(selectedSize);
	};

	const handleQuantityChange = (delta: number) => {
		setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta));
	};

	const name = product.collection?.name + ' ' + product.name;

	return (
		<div className='container mx-auto p-4 space-y-8'>
			{/* Carousel with Product Images */}
			<Carousel className='w-48 h-48 md:w-96 md:h-96 mx-auto'>
				<CarouselContent className='h-96'>
					{[
						product.imagePath1,
						product.imagePath2,
						product.imagePath3,
						product.imagePath4,
						product.imagePath5,
					]
						.filter(Boolean) // Filter out null/undefined values
						.map((path, index) => (
							<CarouselItem key={index}>
								<img
									src={path}
									alt={`Image ${index + 1} of ${
										name
									}`}
									className='object-cover'
								/>
							</CarouselItem>
						))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>

			{/* Product Information */}
			<div className='text-center space-y-4'>
				<h1 className='text-3xl font-bold'>{name}</h1>
				<p className='text-lg text-gray-600' style={{ margin: 0 }}>
					{formatCurrency(product.priceInCents / 100)}
				</p>

				{/* Sizes Selection */}
				<div className='flex justify-center space-x-4'>
					{['S', 'M', 'L', 'XL'].map((sizeOption) => (
						<button
							key={sizeOption}
							onClick={() => handleSizeClick(sizeOption)}
							className={`border text-sm uppercase font-medium w-12 h-12 ${
								size === sizeOption
									? 'bg-black text-white' // Highlight selected size
									: 'hover:bg-gray-200'
							}`}
						>
							{sizeOption}
						</button>
					))}
				</div>

				{/* Quantity Selection */}
				<div className='flex justify-center items-center space-x-4'>
					<button
						onClick={() => handleQuantityChange(-1)}
						className='border w-8 h-8 text-xl text-center flex justify-center items-center'
					>
						-
					</button>
					<span>{quantity}</span>
					<button
						onClick={() => handleQuantityChange(1)}
						className='border w-8 h-8 text-xl text-center flex justify-center items-center'
					>
						+
					</button>
				</div>

				{/* Checkout Button */}
				<div className='flex flex-col items-center pt-8'>
					<Button className='mt-4 w-72' size='lg' asChild>
						<Link
							href={`/products/${product.id}/purchase?size=${size}&quantity=${quantity}`}
						>
							Checkout
						</Link>
					</Button>
					<Link
						className='mt-4'
						href='https://wa.me/393444144444?text=Feeling%20support%20chat'
						target='_blank'
					>
						Contact support
					</Link>
				</div>
			</div>

			{/* Product Description */}
			<div className='prose mx-auto px-12 py-16'>
				<h2 className='text-xl font-semibold pb-4'>
					Product Description
				</h2>
				<p>{product.description}</p>
			</div>
		</div>
	);
}
