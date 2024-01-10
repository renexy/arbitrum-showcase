// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLClient } from 'graphql-request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const graphqlEndpoint = 'https://alloscan.spec.dev/graphql';
  const client = new GraphQLClient(graphqlEndpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Assuming you send the query type as a parameter to the API route
  const { queryJson, first, offset } = req.body;

  try {
    const data = await client.request(queryJson, { first, offset });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Fetching pools failed', error });
  }
}
