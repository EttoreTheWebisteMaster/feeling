'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
	useState,
	ComponentProps,
	ReactNode,
	ReactElement,
	cloneElement,
	isValidElement,
} from 'react';

export function Nav({ children }: Readonly<{ children: ReactNode }>) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className='text-foreground bg-secondary flex justify-between items-center px-4 py-2 fixed w-full top-0 z-10'>
			{/* Left-side menu icon */}
			<button
				onClick={toggleMenu}
				className='p-2 text-lg focus:outline-none w-6 flex justify-center'
				aria-label='Toggle Menu'
			>
				☰
			</button>

			{/* Brand or title */}
			<Link className='bigText text-2xl' href='/'>FEELING</Link>

			{/* Cart */}
			<button
				className='p-2 text-lg focus:outline-none w-6 flex justify-center pointer-events-none'
				aria-label='Cart'
			></button>

			{/* Sidebar Menu */}
			<div
				className={cn(
					'fixed top-0 left-0 h-full w-96 bg-background shadow-lg transform transition-transform',
					isMenuOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<button
					onClick={toggleMenu}
					className='px-1 py-1 m-4 text-lg focus:outline-none'
					aria-label='Close Menu'
				>
					✕
				</button>
				{/* Pass closeMenu to children */}
				<div className='px-8 space-y-6'>
					{React.Children.map(children, (child) =>
						isValidElement(child)
							? cloneElement(
									child as ReactElement<{
										closeMenu: () => void;
									}>,
									{
										closeMenu,
									}
							  )
							: child
					)}
				</div>
			</div>
		</nav>
	);
}

export function NavLink({
	closeMenu,
	...props
}: Readonly<
	Omit<ComponentProps<typeof Link>, 'className'> & { closeMenu?: () => void }
>) {
	const pathname = usePathname();
	return (
		<Link
			{...props}
			className={cn(
				'block font-bold uppercase text-2xl',
				pathname === props.href && 'bg-background text-foreground'
			)}
			onClick={closeMenu} // Close menu when clicked
		/>
	);
}

export function NavCollapse({
	title,
	children,
	closeMenu,
}: Readonly<{
	title: string;
	children: ReactNode;
	closeMenu?: () => void;
}>) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapse = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className='mb-4'>
			{/* Collapse Header */}
			<button
				onClick={toggleCollapse}
				className='flex items-center justify-between w-full font-bold uppercase text-2xl bg-secondary hover:bg-secondary-focus'
			>
				<span>{title}</span>
				{/* Chevron */}
				<span
					className={cn(
						'transition-transform transform',
						isOpen ? 'rotate-180' : 'rotate-0'
					)}
				>
					⌵
				</span>
			</button>

			{/* Collapsible Content */}
			<div
				className={cn(
					'overflow-hidden transition-[max-height] duration-300 space-y-1',
					isOpen ? 'max-h-screen' : 'max-h-0'
				)}
			>
        <div className='py-2'></div>
				{/* Pass closeMenu to SubNavLinks */}
				{React.Children.map(children, (child) =>
					isValidElement(child)
						? cloneElement(
								child as ReactElement<{
									closeMenu: () => void;
								}>,
								{
									closeMenu,
								}
						  )
						: child
				)}
			</div>
		</div>
	);
}

export function SubNavLink(
	props: Readonly<
		Omit<ComponentProps<typeof Link>, 'className'> & {
			date?: string;
			closeMenu?: () => void;
		}
	>
) {
	const { date, closeMenu, children, ...linkProps } = props;
	const pathname = usePathname();

	return (
		<Link
			{...linkProps}
			className={cn(
				'block font-medium text-lg text-secondary-foreground flex justify-between items-center',
				pathname === props.href && 'text-foreground'
			)}
			onClick={closeMenu} // Close menu when clicked
		>
			{/* Left-aligned text */}
			<span className='truncate uppercase'>{children}</span>
			{/* Right-aligned date */}
			{date && <span className='text-sm ml-4 min-w-fit'>{date}</span>}
		</Link>
	);
}
