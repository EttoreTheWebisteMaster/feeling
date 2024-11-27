import { Nav, NavLink, SubNavLink, NavCollapse } from '@/components/Nav';
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
				<NavCollapse title='Support'>
					<SubNavLink
						href='https://wa.me/393444144444?text=Feeling%20support%20chat'
						target='_blank'
					>
						Whatsapp chat
					</SubNavLink>
					<SubNavLink
						href='mailto:feeling.streetwear.brand@gmail.com'
						target='_blank'
					>
						Contact us
					</SubNavLink>
				</NavCollapse>
			</Nav>
			<div className='container text-center place-content-center px-0 my-16 lg:px-48 md:px-24'>
				{children}
			</div>
			<Footer />
		</>
	);
}
