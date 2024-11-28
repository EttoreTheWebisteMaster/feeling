import PastCollections from '@/components/PastCollections';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import VideoPlayer from '@/components/VideoPlayer';
import db from '@/db/db';
import { cache } from '@/lib/cache';
import { Collection, Product } from '@prisma/client';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Fetch and cache the collection for use on the homepage
const getCollection = cache(
	async (collectionId: string) => {
		return await db.collection.findUnique({
			where: { isAvailable: true, id: collectionId },
		});
	},
	['/', 'getCollection']
);

// Fetch and cache the newest products from the collection
const getProducts = cache(
	async (collectionId: string) => {
		const collection = await getCollection(collectionId);

        if (collection == null) return notFound();

		// If there's no available collection, return an empty array
		if (!collection) return [];

		return db.product.findMany({
			where: {
				isAvailable: true,
				collectionId: collection.id,
			},
			orderBy: { createdAt: 'desc' },
		});
	},
	['/', 'getProducts']
);

export default async function CollectionPage({
	params: { id },
}: Readonly<{
	params: { id: string };
}>) {
	return (
		<main className='space-y-12'>
			{/* Pass a function that fetches the collection */}
			<CollectionHeaderSection
				collectionFetcher={() => getCollection(id)}
			/>
			{/* Pass a function that fetches the products */}
			<ProductGridSection
				title='Newest products'
				productsFetcher={() => getProducts(id)}
			/>
			{/* TODO in future */}
			{/* <PastCollections /> */}
		</main>
	);
}

type CollectionHeaderSectionProps = {
	collectionFetcher: () => Promise<Collection | null>;
};

async function CollectionHeaderSection({
	collectionFetcher,
}: Readonly<CollectionHeaderSectionProps>) {
	const collection = await collectionFetcher();

	// Display a fallback message if there’s no available collection
	if (!collection) {
		return <div>Not available at the moment.</div>;
	}

	return (
		<section className='collection-header'>
			<VideoPlayer
				collection={collection}
				videoPath={collection.videoPath}
			/>
		</section>
	);
}

type ProductGridSectionProps = {
	title: string;
	productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
	productsFetcher,
	title,
}: Readonly<ProductGridSectionProps>) {
	return (
		<div className='space-y-4 flex justify-center'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-3 px-2'>
				<Suspense
					fallback={
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					}
				>
					<ProductSuspense productsFetcher={productsFetcher} />
				</Suspense>
			</div>
		</div>
	);
}

async function ProductSuspense({
	productsFetcher,
}: {
	productsFetcher: () => Promise<Product[]>;
}) {
	return (await productsFetcher()).map((product) => (
		<ProductCard key={product.id} {...product} />
	));
}
