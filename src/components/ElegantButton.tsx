import React from 'react';

interface ButtonProps {
	text: string;
}

const ElegantButton: React.FC<ButtonProps> = ({ text }) => {
	return (
		<button
			className={`uppercase relative inline-block px-6 py-1 text-sm font-semibold text-white bg-opacity-20 border border-white
        backdrop-blur-lg hover:scale-105 hover:backdrop-blur-md hover:bg-opacity-30 transition-all duration-300 ease-out`}
		>
			<span className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 rounded-lg'></span>
			{text}
		</button>
	);
};

export default ElegantButton;
