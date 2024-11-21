import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='bg-primary text-primary-foreground p-16 overflow-hidden'>
			<div className='uppercase bigText'>Feeling streetwear</div>
			<div className='mt-6 mb-2'>Social networks</div>
			<Link
				href='https://www.instagram.com/feelingstreetwear/'
				target='_blank'
				className='opacity-50'
			>
				<i className='fa-brands fa-instagram'></i>
			</Link>
			<div className='mt-6 mb-2'>Support</div>
			<div className='flex flex-col opacity-50'>
				<Link
					href='https://wa.me/393444144444?text=Feeling%20support%20chat'
					className='w-fit'
					target='_blank'
				>
					Whatsapp chat
				</Link>
				<Link
					href='mailto:feeling.streetwear.brand@gmail.com'
					className='w-fit'
				>
					Contact us
				</Link>
			</div>
			<div className='h-16 bigText uppercase text-7xl relative'>
				<div className='absolute' style={{ bottom: '-80px' }}>
					Feeling
				</div>
			</div>
		</footer>
	);
}
