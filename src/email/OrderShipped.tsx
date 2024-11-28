import {
	Html,
	Head,
	Body,
	Container,
	Heading,
	Tailwind,
	Preview,
} from '@react-email/components';

interface OrderShippedProps {
	shippingNumber: string;
}

export default function OrderShipped({ shippingNumber }: Readonly<OrderShippedProps>) {
	return (
		<Html>
			<Preview>Your order was shipped</Preview>
			<Tailwind>
				<Head />
				<Body className='font-sans bg-white'>
					<Container className='max-w-xl'>
						<Heading>Shipping number</Heading>
						<strong>{shippingNumber}</strong>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
