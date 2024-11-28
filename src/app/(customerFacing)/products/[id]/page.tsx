import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/ProductPage';
import db from '@/db/db';

// Fetch product data server-side
async function fetchProduct(id: string) {
	const product = await db.product.findUnique({ where: { id } });
	return product;
}

export default async function PurchasePage({
	params: { id },
}: Readonly<{ params: { id: string } }>) {
	const product = await fetchProduct(id);

	// If the product doesn't exist, return 404
	if (!product) return notFound();

	// Pass the product data to the client component
	return <ProductPage product={product} />;
}
