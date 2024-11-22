/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function PastCollections() {
	// Mock data: Replace these URLs with your actual photo URLs
	const collections = [
		{ id: 1, name: 'NAME 1', image: '/path/to/photo1.jpg' },
		{ id: 2, name: 'NAME 2', image: '/path/to/photo2.jpg' },
		{ id: 3, name: 'NAME 3', image: '/path/to/photo3.jpg' },
		{ id: 4, name: 'NAME 4', image: '/path/to/photo4.jpg' },
		{ id: 5, name: 'NAME 5', image: '/path/to/photo5.jpg' },
	];

	const [visibleCount, setVisibleCount] = useState(3);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 3); // Show 3 more collections
	};

	return (
		<div className='text-center'>
			<h2 className='text-2xl font-bold mb-6 uppercase tracking-widest'>
				Past Collections
			</h2>
			<div className='grid grid-cols-3 gap-1 z-0'>
				{collections.slice(0, visibleCount).map((collection) => (
					<Link
                        href={`/collections/${collection.id}`}
						key={collection.id}
						className='relative group bg-black text-white h-36 flex items-center justify-center'
					>
						{/* Image Placeholder */}
						<img
							src={collection.image}
							alt={collection.name}
							className='absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300'
						/>
						{/* Collection Name */}
						<div className='relative z-10 font-bold text-xl uppercase tracking-widest'>
							{collection.name}
						</div>
					</Link>
				))}
			</div>
			{visibleCount < collections.length && (
				<button
					onClick={handleShowMore}
					className='mt-6 px-6 py-2 bg-white text-black font-semibold uppercase tracking-widest transition-all relative'
                    style={{marginTop: '-8px'}}
				>
					Show More
				</button>
			)}
		</div>
	);
}
