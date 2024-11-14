import db from '@/db/db';
import { PageHeader } from '../../../_components/PageHeader';
import { ProductForm } from '../../_components/ProductForm';

export default async function EditProductPage({
	params: { id },
}: Readonly<{
	params: { id: string };
}>) {
	const product = await db.product.findUnique({ where: { id } });
	const collections = await db.collection.findMany();

	return (
		<>
			<PageHeader>Edit Product</PageHeader>
			<ProductForm product={product} collections={collections}/>
		</>
	);
}
