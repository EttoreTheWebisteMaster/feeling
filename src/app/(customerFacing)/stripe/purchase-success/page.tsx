import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
	searchParams,
}: Readonly<{
	searchParams: { payment_intent: string };
}>) {
	const paymentIntent = await stripe.paymentIntents.retrieve(
		searchParams.payment_intent
	);
	if (paymentIntent.metadata.productId == null) return notFound();

	const product = await db.product.findUnique({
		where: { id: paymentIntent.metadata.productId },
		include: {
			collection: {
				select: {
					name: true,
				},
			},
		},
	});

	if (product == null) return notFound();

	const name = product.collection?.name + ' ' + product.name;
	const isSuccess = paymentIntent.status === 'succeeded';

	return (
		<div className='max-w-5xl w-full mx-auto space-y-8 container'>
			<h1 className='text-4xl font-bold'>
				{isSuccess ? 'Success!' : 'Error!'}
			</h1>
			<div>
				{isSuccess
					? 'Your order was correctly placed. You will shortly receive the shipping details via email.'
					: ''}
			</div>
			<div className='flex gap-4 items-center'>
				<div className='aspect-video flex-shrink-0 w-1/3 relative'>
					<img
						src={product.imagePath}
						alt={name}
						className='object-cover'
					/>
				</div>
				<div className='px-8 text-left'>
					<h1 className='text-2xl font-bold'>{name}</h1>
					{/* <div className='text-lg'>
						{formatCurrency(product.priceInCents / 100)}
					</div> */}

					<div className='line-clamp-3 text-muted-foreground'>
						{product.description}
					</div>
				</div>
			</div>
			<Button className='mt-4' size='lg' asChild>
				{isSuccess ? (
					<Link href={`/`}>Close</Link>
				) : (
					<Link href={`/products/${product.id}/purchase`}>
						Try Again
					</Link>
				)}
			</Button>
		</div>
	);
}
