import PastCollections from '@/components/PastCollections';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import VideoPlayer from '@/components/VideoPlayer';
import db from '@/db/db';
import { cache } from '@/lib/cache';
import { Collection, Product } from '@prisma/client';
import { Suspense } from 'react';

// Fetch and cache the latest collection for use on the homepage
const getLatestCollection = cache(async () => {
	return await db.collection.findFirst({
		where: { isAvailable: true },
		orderBy: { createdAt: 'desc' },
	});
}, ['/', 'getLatestCollection']);

// Fetch and cache the newest products from the latest collection
const getNewestProducts = cache(async () => {
	const latestCollection = await getLatestCollection();

	// If there's no available collection, return an empty array
	if (!latestCollection) return [];

	return db.product.findMany({
		where: {
			isAvailable: true,
			collectionId: latestCollection.id,
		},
		orderBy: { createdAt: 'desc' },
	});
}, ['/', 'getNewestProducts']);

export default function HomePage() {
	return (
		<main className='space-y-12'>
			<CollectionHeaderSection collectionFetcher={getLatestCollection} />
			<ProductGridSection
				title='Newest products'
				productsFetcher={getNewestProducts}
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
		return <div>No collection available at the moment.</div>;
	}

	return (
		<section className='collection-header'>
			<VideoPlayer collection={collection} videoPath={collection.videoPath} />
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
						</>
					}
				></Suspense>
				<ProductSuspense productsFetcher={productsFetcher} />
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
