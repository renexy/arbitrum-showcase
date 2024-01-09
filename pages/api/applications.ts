// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import request from 'graphql-request';
import { getMicroGrantsRecipientsQuery } from '@/queries/poolQuery';
import { TPoolData, TPoolMetadata } from '@/types/typesPool';
import { getIPFSClient } from '@/services/ipfs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const graphqlEndpoint = 'https://alloscan.spec.dev/graphql';
  // Assuming you send the query type as a parameter to the API route
  const { chainId, poolId } = req.body;

  try {
    const response: any = await request(
      graphqlEndpoint,
      getMicroGrantsRecipientsQuery,
      { chainId: chainId, poolId: poolId },
    );
    
    const pool: TPoolData = response.microGrant;
  
    const poolMetadata: TPoolMetadata = await getIPFSClient().fetchJson(
      pool.pool.metadataPointer,
    );

    pool.pool.metadata = poolMetadata;

    res.status(200).json(pool);
  } catch (error) {
    res.status(500).json({ message: 'Fetching applications failed', error });
  }
}
