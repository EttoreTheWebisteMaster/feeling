/* eslint-disable @next/next/no-img-element */
import React, { Suspense } from 'react';
import Link from 'next/link';
import ElegantButton from './ElegantButton';

type ProductCardProps = {
	id: string;
	name: string;
	priceInCents: number;
	description: string;
	imagePath: string;
};

// Resource Cache
const imageCache = new Map<string, Promise<HTMLImageElement>>();

// Function to load image
async function loadImage(src: string): Promise<HTMLImageElement> {
	if (imageCache.has(src)) {
		return imageCache.get(src) as Promise<HTMLImageElement>;
	}

	const promise = new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
	});

	imageCache.set(src, promise);
	return promise;
}

// Custom Hook
function useImageResource(src: string) {
	const resource = React.useMemo(
		() => ({
			read: () => {
				if (!imageCache.has(src)) {
					throw loadImage(src);
				}
			},
		}),
		[src]
	);

	return resource;
}

// Product Image Component
function ProductImage({ src, alt }: Readonly<{ src: string; alt: string }>) {
	const resource = useImageResource(src);
	resource.read(); // Read from cache or trigger loading
	return <img src={src} alt={alt} className='object-cover h-96' />;
}

// Product Card Component
export function ProductCard({
	id,
	name,
	priceInCents,
	description,
	imagePath,
}: Readonly<ProductCardProps>) {
	return (
		<div className='flex justify-center'>
			<Link
				href={`/products/${id}/purchase`}
				className='relative h-96 aspect-w-1 aspect-h-1'
			>
				<Suspense fallback={<ProductCardSkeleton />}>
					<ProductImage src={imagePath} alt={name} />
				</Suspense>
				<div
					className='absolute text-white w-full'
					style={{ bottom: '24px' }}
				>
					<div className='uppercase text-6xl drop-shadow-md bigText truncate whitespace-break-spaces'>
						{name}
					</div>
					<ElegantButton text='Order now' />
				</div>
			</Link>
		</div>
	);
}

// Skeleton Loader
export function ProductCardSkeleton() {
	return (
		<div className='flex justify-center'>
			<div className='bg-gray-300 animate-pulse h-96 w-96 aspect-w-1 aspect-h-1'></div>
		</div>
	);
}
