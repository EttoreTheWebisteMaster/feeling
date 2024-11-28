'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTransition } from 'react';
import { deleteOrder, editShippingNumber } from '../../_actions/orders';
import { useRouter } from 'next/navigation';

export function DeleteDropDownItem({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<DropdownMenuItem
			variant='destructive'
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					await deleteOrder(id);
					router.refresh();
				})
			}
		>
			Delete
		</DropdownMenuItem>
	);
}

export function ShippingNumberDropDownItem({
	id,
	shippingNumber,
  email,
}: Readonly<{
	id: string;
	shippingNumber: string;
	email: string;
}>) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleEditShippingNumber = async () => {
		// Open a prompt modal to get the new shipping number
		const inputShippingNumber = prompt('Enter the new shipping number:', shippingNumber);

		// Check if the user entered a value
		if (inputShippingNumber != null) {
			await editShippingNumber(id, inputShippingNumber, email);
			router.refresh();
		}
	};

	return (
		<DropdownMenuItem
			disabled={isPending}
			onClick={() => startTransition(handleEditShippingNumber)}
		>
			Edit Shipping number
		</DropdownMenuItem>
	);
}
