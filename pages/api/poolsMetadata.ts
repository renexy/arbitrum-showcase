import type { NextApiRequest, NextApiResponse } from 'next';
import { getIPFSClient } from '@/services/ipfs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ipfsPointers } = req.body;
  const ipfsClient = getIPFSClient();
  const results = [];

  try {
    for (const pointer of ipfsPointers) {
      try {
        const metadata = await ipfsClient.fetchJson(pointer);
        let banner = "";
        if (metadata.base64Image) {
          const bannerImage = await ipfsClient.fetchJson(metadata.base64Image);
          banner = bannerImage.data ? bannerImage.data : "";
        }
        results.push({ metadata, bannerImage: banner });
      } catch (error) {
        // Pushing an empty object for pointers with no metadata
        results.push({});
      }
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Fetching metadata failed', error });
  }
}
