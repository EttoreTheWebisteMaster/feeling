import { put } from '@vercel/blob';

export default async function handler(req: any, res: any) {
	if (req.method === 'POST') {
		try {
			// Ensure the request contains the file's content
			const { fileName, content } = req.body;

			if (!fileName || !content) {
				return res
					.status(400)
					.json({ error: 'fileName and content are required.' });
			}

			// Upload the file to Vercel Blob
			const { url } = await put(fileName, Buffer.from(content), {
				access: 'public', // Options: 'public' or 'private'
			});

			return res.status(200).json({ url });
		} catch (error) {
			console.error('Upload error:', error);
			return res.status(500).json({ error: 'Failed to upload file.' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		return res
			.status(405)
			.json({ error: `Method ${req.method} Not Allowed` });
	}
}
