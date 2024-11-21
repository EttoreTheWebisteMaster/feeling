import { Nav, NavLink, SubNavLink, NavCollapse } from '@/components/ClientNav';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Nav>
				<NavLink href='/'>Home</NavLink>
				<NavCollapse title='Collections'>
					<SubNavLink href='/' date='summer 2024'>
						Neon
					</SubNavLink>
					<SubNavLink href='/' date='summer 2024'>
						Name 1
					</SubNavLink>
					<SubNavLink href='/' date='summer 2024'>
						Name 2 super lungo che non cè più spazio per scrivere
					</SubNavLink>
					<SubNavLink href='/' date='summer 2024'>
						Name 3
					</SubNavLink>
				</NavCollapse>
				<NavLink href='/products'>Products</NavLink>
				<NavLink href='/orders'>My Orders</NavLink>
				<NavLink href='/support'>Support</NavLink>
			</Nav>
			<div className='text-center place-content-center my-16'>
				{children}
			</div>
			<Footer />
		</>
	);
}
