'use server';

import db from '@/db/db';
import { notFound } from 'next/navigation';
import { Resend } from 'resend';
import OrderShipped from '@/email/OrderShipped';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function deleteOrder(id: string) {
	const order = await db.order.delete({
		where: { id },
	});

	if (order == null) return notFound();

	return order;
}

export async function editShippingNumber(
	id: string,
	shippingNumber: string,
	email: string
) {
	const order = await db.order.update({
		where: { id },
		data: {
			shippingNumber,
		},
	});

	if (order == null) return notFound();

  /* TODO */
	/* await resend.emails.send({
		from: `Support <${process.env.SENDER_EMAIL}>`,
		to: email,
		subject: 'Your item has been shipped',
		react: <OrderShipped shippingNumber={shippingNumber} />
	}); */

	return order;
}
