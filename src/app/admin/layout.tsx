import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Nav>
				<NavLink href='/admin'>Dashboard</NavLink>
				<NavLink href='/admin/collections'>Collections</NavLink>
				<NavLink href='/admin/products'>Products</NavLink>
				<NavLink href='/admin/users'>Customers</NavLink>
				<NavLink href='/admin/orders'>Sales</NavLink>
			</Nav>
			<div className='my-16 container mx-auto lg:px-16'>{children}</div>
		</>
	);
}
