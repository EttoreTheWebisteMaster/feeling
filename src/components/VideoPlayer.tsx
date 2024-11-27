import { Collection } from "@prisma/client";

export default function VideoPlayer({
	collection,
	videoPath,
}: Readonly<{ collection: Collection; videoPath: string }>) {
	return (
		<>
			<div className='relative overflow-hidden'>
				<video
					src={videoPath}
					autoPlay
					loop
					muted
					playsInline
					style={{ width: '100%', height: 'auto' }}
				>
					Your browser does not support the video tag.
				</video>
				<h2
					className='absolute uppercase text-8xl text-white drop-shadow-md bigText'
					style={{ top: '-8px', left: '-8px' }}
				>
					{collection.name}
				</h2>
				<h2
					className='absolute uppercase text-6xl text-white drop-shadow-md bigText'
					style={{ bottom: '-16px', right: '-8px' }}
				>
					Collection
				</h2>
			</div>
			<div className="m-16">
				<h3>{collection.title}</h3>
				<h4>{collection.description}</h4>
			</div>
		</>
	);
}