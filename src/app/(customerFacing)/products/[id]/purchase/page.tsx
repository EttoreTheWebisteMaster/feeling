import db from '@/db/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import { CheckoutForm } from './_components/CheckoutForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
	params: { id },
	searchParams,
}: Readonly<{
	params: { id: string };
	searchParams: { size: string; quantity: string };
}>) {
	const product = await db.product.findUnique({ where: { id } });
	if (product == null) return notFound();

	// Get the size and quantity from the searchParams
	const size = searchParams.size || 'M'; // Default to 'M' if not provided
	const quantity = parseInt(searchParams.quantity, 10) || 1; // Default to 1 if not provided

	const paymentIntent = await stripe.paymentIntents.create({
		amount: product.priceInCents * quantity,
		currency: 'EUR',
		metadata: { productId: product.id, size, quantity: String(quantity) },
	});

	if (paymentIntent.client_secret == null) {
		throw Error('Stripe failed to create payment intent');
	}

	return (
		<CheckoutForm
			product={product}
			clientSecret={paymentIntent.client_secret}
			size={size}
			quantity={quantity}
		/>
	);
}
