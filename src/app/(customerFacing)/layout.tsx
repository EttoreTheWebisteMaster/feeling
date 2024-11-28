import { Nav, NavLink, SubNavLink, NavCollapse } from '@/components/Nav';
import Footer from '@/components/Footer';
import db from '@/db/db';
import { cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

const getCollections = cache(async () => {
	return await db.collection.findMany({
		where: { isAvailable: true },
		orderBy: { createdAt: 'desc' },
	});
}, ['/', 'getCollections']);

function formatToSeasonalDate(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getUTCFullYear();

	// Get the month (0-indexed, so January is 0 and December is 11)
	const month = date.getUTCMonth();

	// Determine the season based on the month
	let season = ''

	if (month >= 2 && month <= 4) {
		season = 'spring';
	} else if (month >= 5 && month <= 7) {
		season = 'summer';
	} else if (month >= 8 && month <= 10) {
		season = 'fall';
	} else {
		season = 'winter';
	}

	return `${season} ${year}`;
}

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const collections = await getCollections();

	return (
		<>
			<Nav>
				<NavLink href='/'>Home</NavLink>
				<NavCollapse title='Collections'>
					{collections.map((collection) => (
						<SubNavLink
							key={collection.id}
							href={`/collections/${collection.id}`}
							date={formatToSeasonalDate(
								collection.createdAt.toString()
							)}
						>
							{collection.name}
						</SubNavLink>
					))}
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
