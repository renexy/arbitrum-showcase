// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import request from 'graphql-request';
import { getMicroGrantRecipientQuery } from '@/queries/poolQuery';
import { TApplicationMetadata, TPoolData, TPoolMetadata } from '@/types/typesPool';
import { getIPFSClient } from '@/services/ipfs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const graphqlEndpoint = 'https://alloscan.spec.dev/graphql';
  // Assuming you send the query type as a parameter to the API route
  const { chainId, poolId, applicationId } = req.body;

  try {
    let banner;

    const response: any = await request(
      graphqlEndpoint,
      getMicroGrantRecipientQuery,
      { chainId: chainId, poolId: poolId, recipientId: applicationId.toLocaleLowerCase() },
    );
    
    const application = response.microGrantRecipient;
 
    const ipfsClient = getIPFSClient();
    const metadata: TApplicationMetadata = await ipfsClient.fetchJson(
      application.metadataPointer,
    );

    if (!metadata.name) metadata.name = `Pool ${application.microGrant.poolId}`;

    const bannerImage = await ipfsClient.fetchJson(metadata.base64Image);
    banner = bannerImage!.data ? bannerImage.data : "";

    const finalMetadata = {
      application: application,
      metadata: metadata,
      bannerImage: banner,
    }
    res.status(200).json(finalMetadata);
  } catch (error) {
    res.status(500).json({ message: 'Fetching applications failed', error });
  }
}
