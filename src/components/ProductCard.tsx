/* eslint-disable @next/next/no-img-element */
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import ElegantButton from './ElegantButton';

type ProductCardProps = {
	id: string;
	name: string;
	priceInCents: number;
	description: string;
	imagePath: string;
};

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
				<img src={imagePath} alt={name} className='object-cover h-96' />
				<div
					className='absolute text-white w-full'
					style={{ bottom: '24px' }}
				>
					<div className='uppercase text-6xl drop-shadow-md bigText truncate ... whitespace-break-spaces'>
						{name}
					</div>
					<ElegantButton text='Order now' />
				</div>
			</Link>
		</div>
	);
}

export function ProductCardSkeleton() {
	return (
		<Card className='overflow-hidden flex flex-col animate-pulse'>
			<div className='w-full aspect-video bg-gray-300' />
			<CardHeader>
				<CardTitle>
					<div className='w-3/4 h-6 rounded-full bg-gray-300' />
				</CardTitle>
				<CardDescription>
					<div className='w-1/2 h-4 rounded-full bg-gray-300' />
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='w-full h-4 rounded-full bg-gray-300' />
				<div className='w-full h-4 rounded-full bg-gray-300' />
				<div className='w-3/4 h-4 rounded-full bg-gray-300' />
			</CardContent>
			<CardFooter>
				<Button className='w-full' disabled size='lg'></Button>
			</CardFooter>
		</Card>
	);
}
