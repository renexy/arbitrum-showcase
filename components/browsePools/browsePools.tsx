import React, { useEffect } from 'react';
import { getActiveMicroGrantsQuery, getEndedMicroGrantsQuery, getUpcomingMicroGrantsQuery, graphqlEndpoint } from "@/queries/poolQuery";
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { green } from '@mui/material/colors';
import GridModuleCss from '@/styles/Grid.module.css'
import { getIPFSClient } from "@/services/ipfs";
import { TPoolData, TPoolMetadata } from "@/types/typesPool";
import request from "graphql-request";

enum TPoolType {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
}

const getRandomImage = () => {
    const imageUrls = [
        'https://via.placeholder.com/600x200', // Replace these placeholder URLs with actual image URLs
        'https://via.placeholder.com/600x200',
        'https://via.placeholder.com/600x200',
        // Add more image URLs as needed
    ];
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

const BrowsePools = () => {
  const cardData = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      image: getRandomImage(),
  }));
  const [upcomingPools, setUpcomingPools] = React.useState<TPoolData[] | undefined>([]);
  const [activePools, setActivePools] = React.useState<TPoolData[] | undefined>([]);
  const [endedPools, setEndedPools] = React.useState<TPoolData[] | undefined>([]);

  useEffect(() => {
    const fetchData = async () => {

      const upcomingPools = await getPools(TPoolType.UPCOMING);
      const activePools = await getPools(TPoolType.ACTIVE);
      const endedPools = await getPools(TPoolType.ENDED);

      setUpcomingPools(upcomingPools);
      setActivePools(activePools);
      setEndedPools(endedPools);

      console.log("upcomingPools", upcomingPools)
      console.log("activePools FETCH", activePools)
      console.log("endedPools", endedPools)
    };

    fetchData();
  }, []);

  const ipfsClient = getIPFSClient();

  const fetchPools = async (queryType: string, first: number, offest: number) => {
    const response = await fetch('/api/pools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryJson: queryType,
        first: first,
        offset: offest,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    return data;
  };

  const getPools = async (type: TPoolType) => {
    let pools: TPoolData[] = [];

    let graphqlQuery;
    let responseObject;

    if (type === TPoolType.UPCOMING) {
      graphqlQuery = getUpcomingMicroGrantsQuery;
      responseObject = "upcomingMicroGrants";
    } else if (type === TPoolType.ACTIVE) {
      graphqlQuery = getActiveMicroGrantsQuery;
      responseObject = "activeMicroGrants";
    } else if (type === TPoolType.ENDED) {
      graphqlQuery = getEndedMicroGrantsQuery;
      responseObject = "endedMicroGrants";
    } else {
      return pools;
    }

    console.log(graphqlQuery)

    try {
      const response = await fetchPools(graphqlQuery, 100, 0)
      console.log("response", response)

      if (type === TPoolType.UPCOMING) {
        pools = response.upcomingMicroGrants;
        console.log("activeMicroGrants", pools)
      } else if (type === TPoolType.ACTIVE) {
        pools = response.activeMicroGrants;
        console.log("activeMicroGrants", pools)
      } else if (type === TPoolType.ENDED) {
        pools = response.endedMicroGrants;
        console.log("endedMicroGrants", pools)
      }

      console.log("POOxzxbLS", pools)

      if (!pools) {
        console.log("Pools length is zero")
        return;
      }

      for (const pool of pools) {
        let metadata: TPoolMetadata;
        try {
          const pointer = pool.pool.metadataPointer.toString();
          metadata = await ipfsClient.fetchJson(pointer);
          pool.pool.metadata = metadata;
          if (metadata.base64Image) {
            let poolBanner = await ipfsClient.fetchJson(metadata.base64Image);
            pool.pool.poolBanner = poolBanner.data;
          }
          if (!metadata.name) {
            metadata.name = `Pool ${pool.poolId}`;
          }
        } catch (error) {
          console.log("IPFS", "Unable to fetch metadata", error);
        }
      }
    } catch (error) {
      console.log("Error fetching pools: ", error);
    }
    console.log("SALGMAOSLGMAD", pools)
    return pools;
  }

  const test = async () => {
    console.log("upcomingPools", upcomingPools);
    console.log("activePools", activePools);
    console.log("endedPools", endedPools);
  }

  return (
    <Grid container spacing={2}>
      {cardData.map((item) => (
        <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ cursor: 'pointer' }}>
                <CardMedia
                    component="img"
                    height="125"
                    image={item.image}
                    alt="Random"
                    style={{ objectFit: 'cover' }}
                />
                <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>actual name</Typography>
                            <Button variant="outlined" sx={{ background: green[300] }} color="secondary"
                                disabled>
                                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ACTIVE</Typography>
                            </Button>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold' }}>Pool amount</Typography>
                            <Typography>wan ether</Typography>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold' }}>Max alloc.</Typography>
                            <Typography>wan ether</Typography>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold' }}>Start</Typography>
                            <Typography>1/5/2024</Typography>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold' }}>End</Typography>
                            <Typography>1/6/2025</Typography>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography sx={{ fontWeight: 'bold' }}>Strat. type</Typography>
                            <Typography>Manual</Typography>
                        </div>
                        <div className={GridModuleCss.colBreak}>
                            <Typography>Description</Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
          <Button onClick={() => {test()}}> test</Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default BrowsePools;
