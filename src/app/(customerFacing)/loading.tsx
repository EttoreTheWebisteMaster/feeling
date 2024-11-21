import React from 'react';

const Loading: React.FC = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-white text-black'>
			<div className='relative text-4xl font-bold tracking-widest bigText'>
				<span className='relative'>
					{Array.from('FEELING').map((letter, index) => (
						<span
							key={index}
							className='inline-block animate-bounce'
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{letter}
						</span>
					))}
				</span>
			</div>
			<div className='mt-6 text-lg font-medium tracking-wide animate-pulse'>
				Loading...
			</div>
		</div>
	);
};

export default Loading;
