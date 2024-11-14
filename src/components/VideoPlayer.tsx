export default function VideoPlayer({
	collectionName,
	videoPath,
}: Readonly<{ collectionName: string; videoPath: string }>) {
	return (
		<div>
			<h2>{collectionName} Collection</h2>
			<video
				src={videoPath}
				/* autoPlay
				loop
				muted
				playsInline */
				style={{ width: '100%', height: 'auto' }}
			>
				Your browser does not support the video tag.
			</video>
		</div>
	);
}