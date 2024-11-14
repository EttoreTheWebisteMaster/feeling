import db from '@/db/db';
import { PageHeader } from '../../_components/PageHeader';
import { ProductForm } from '../_components/ProductForm';

export default async function NewProductPage() {
	const collections = await db.collection.findMany();

	return (
		<>
			<PageHeader>Add Product</PageHeader>
			<ProductForm collections={collections} />
		</>
	);
}
