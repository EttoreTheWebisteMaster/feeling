/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import {
	Elements,
	LinkAuthenticationElement,
	AddressElement,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';

type CheckoutFormProps = {
	product: {
		id: string;
		imagePath: string;
		name: string;
		priceInCents: number;
		description: string;
		collection: {
			name: string;
		} | null;
	};
	size: string;
	quantity: number;
	clientSecret: string;
};

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({
	product,
	size,
	quantity,
	clientSecret,
}: Readonly<CheckoutFormProps>) {
	const name = product.collection?.name +' '+ product.name + ' - ' + size;

	return (
		<div className='max-w-5xl w-full mx-auto space-y-8'>
			<div className='flex gap-4 items-center container'>
				<div className='aspect-video flex-shrink-0 w-1/3 relative'>
					<img
						src={product.imagePath}
						alt={name}
						className='object-cover'
					/>
				</div>
				<div className='px-8 text-left'>
					<h1 className='text-2xl font-bold'>{name}</h1>
					<div className='text-lg'>
						{quantity} x{' '}
						{formatCurrency(product.priceInCents / 100)}
					</div>

					<div className='line-clamp-3 text-muted-foreground'>
						{product.description}
					</div>
				</div>
			</div>
			<Elements options={{ clientSecret }} stripe={stripePromise}>
				<Form
					priceInCents={product.priceInCents * quantity}
					productId={product.id}
					size={size}
					quantity={quantity}
				/>
			</Elements>
		</div>
	);
}

function Form({
	priceInCents,
	productId,
	size,
	quantity,
}: Readonly<{
	priceInCents: number;
	productId: string;
	size: string;
	quantity: number;
}>) {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const [email, setEmail] = useState<string>();

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (stripe == null || elements == null || email == null) return;

		setIsLoading(true);

		stripe
			.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
				},
			})
			.then(({ error }) => {
				if (
					error.type === 'card_error' ||
					error.type === 'validation_error'
				) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage('An unknown error occurred');
				}
			})
			.finally(() => setIsLoading(false));
	}

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Checkout</CardTitle>
					{errorMessage && (
						<CardDescription className='text-destructive'>
							{errorMessage}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<PaymentElement />
					<div className='mt-4'>
						<LinkAuthenticationElement
							onChange={(e) => setEmail(e.value.email)}
						/>
					</div>
					<div className='mt-4'>
						<AddressElement options={{ mode: 'shipping' }} />
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className='w-full'
						size='lg'
						disabled={
							stripe == null || elements == null || isLoading
						}
					>
						{isLoading
							? 'Purchasing...'
							: `Purchase ${formatCurrency(priceInCents / 100)}`}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
