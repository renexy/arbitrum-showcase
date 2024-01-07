import React, { useEffect, useState } from 'react';
import { getActiveMicroGrantsQuery, getEndedMicroGrantsQuery, getUpcomingMicroGrantsQuery, graphqlEndpoint } from "@/queries/poolQuery";
import { Grid, Card, CardMedia, CardContent, Typography, Button, Stack, Skeleton, Box, Tabs, Tab, TextField } from '@mui/material';
import { green, red } from '@mui/material/colors';
import GridModuleCss from '@/styles/Grid.module.css'
import { getIPFSClient } from "@/services/ipfs";
import { TPoolData, TPoolMetadata } from "@/types/typesPool";
import request from "graphql-request";
import { ethers } from 'ethers';

const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

enum TPoolType {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
}

const weiToEth = (weiValue: any) => {
  if (!weiValue) return "0.0 ETH";

  const ethValue = ethers.utils.formatEther(weiValue);
  const truncatedEth = ethValue.slice(0, 5); // Retrieve only the first 5 characters

  return `${truncatedEth} ETH`;
};

const convertUnixTimestamp = (timestamp: any) => {
  if (!timestamp) return "/"
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const BrowsePools = () => {
  const [upcomingPools, setUpcomingPools] = React.useState<TPoolData[] | undefined>([]);
  const [activePools, setActivePools] = React.useState<TPoolData[] | undefined>([]);
  const [endedPools, setEndedPools] = React.useState<TPoolData[] | undefined>([]);
  const [loading, setLoading] = React.useState<boolean>(true)
  const [value, setValue] = React.useState(0);
  const [search, setSearch] = useState('')
  const [filteredPools, setFilteredPools] = useState<TPoolData[]>([])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // each time active tab changes reset search
  useEffect(() => {
    setSearch('')
    setFilteredPools([])
  }, [value])

  useEffect(() => {
    if (search.length < 1) return
    if (value === 0) {
      const filteredPools = activePools?.filter((pool) => {
        // Check if item.pool.metadata.name contains the search query (case-insensitive)
        return pool?.pool?.metadata?.name?.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredPools(filteredPools ? filteredPools : [])
    } if (value === 1) {
      const filteredPools = endedPools?.filter((pool) => {
        // Check if item.pool.metadata.name contains the search query (case-insensitive)
        return pool?.pool?.metadata?.name?.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredPools(filteredPools ? filteredPools : [])
    }
  }, [search])

  useEffect(() => {
    const fetchData = async () => {

      // const upcomingPools = await getPools(TPoolType.UPCOMING);
      const activePools = await getPools(TPoolType.ACTIVE);
      const endedPools = await getPools(TPoolType.ENDED);

      // setUpcomingPools(upcomingPools);
      setActivePools(activePools);
      setEndedPools(endedPools);
      setLoading(false)
      /*console.log("upcomingPools", upcomingPools)
      console.log("activePools FETCH", activePools)
      console.log("endedPools", endedPools)*/
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
      const response = await fetchPools(graphqlQuery, 10, 0)
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
  return (
    <>
      {!loading && <Box sx={{ alignSelf: 'flex-start', paddingBottom: { xs: '24px', sm: '8px' } }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab color="secondary" label="Active" />
          <Tab color="secondary" label="Inactive" />
        </Tabs>
      </Box>}
      {!loading &&
        <TextField
          variant="outlined"
          color="secondary"
          size="small"
          placeholder='Allo starter kit'
          value={search}
          onChange={(e: any) => { setSearch(e.target.value) }}
          sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'flex-start', margin: '12px 0' }}
          label="Search"
          InputLabelProps={{
            shrink: true
          }}
        >
        </TextField>}
      <Grid container spacing={2} sx={{ overflow: 'auto' }}>
        {loading &&
          Array.from({ length: 7 }, (_, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ cursor: 'pointer' }}>
                <Stack spacing={1} sx={{ alignItems: 'center', padding: '8px' }}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="rectangular" width={210} height={60} />
                  <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
              </Card>
            </Grid>
          ))
        }
        {!loading && value === 0 && (search.length > 0 ? filteredPools : activePools ? activePools : []).map((item) => (
          <Grid key={item.poolId} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="125"
                image={item?.pool?.poolBanner || fallbackImageURL}
                alt="Random"
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                      {item?.pool?.metadata?.name
                        ? item.pool.metadata.name.length > 11
                          ? `${item.pool.metadata.name.slice(0, 9)}...`
                          : item.pool.metadata.name
                        : 'No name'}</Typography>
                    <Button size="small" variant="outlined" sx={{ background: green[300] }} color="secondary"
                      disabled>
                      <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ACTIVE</Typography>
                    </Button>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Pool amount</Typography>
                    <Typography>{weiToEth(item?.pool?.amount)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Max alloc.</Typography>
                    <Typography>{weiToEth(item?.maxRequestedAmount)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Start</Typography>
                    <Typography>{convertUnixTimestamp(item?.allocationStartTime)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>End</Typography>
                    <Typography>{convertUnixTimestamp(item?.allocationEndTime)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Strat. type</Typography>
                    <Typography>Manual</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography>{item?.pool?.metadata?.description
                      ? item.pool.metadata.description.length > 19
                        ? `${item.pool.metadata.description.slice(0, 18)}...`
                        : item.pool.metadata.description
                      : 'No description'}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!loading && value === 1 && (search.length > 0 ? filteredPools : endedPools ? endedPools : []).map((item) => (
          <Grid key={item.poolId} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="125"
                image={item?.pool?.poolBanner || fallbackImageURL}
                alt="Random"
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                      {item?.pool?.metadata?.name
                        ? item.pool.metadata.name.length > 11
                          ? `${item.pool.metadata.name.slice(0, 9)}...`
                          : item.pool.metadata.name
                        : 'No name'}</Typography>
                    <Button size="small" variant="outlined" sx={{ background: red[300] }} color="secondary"
                      disabled>
                      <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>INACTIVE</Typography>
                    </Button>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Pool amount</Typography>
                    <Typography>{weiToEth(item?.pool?.amount)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Max alloc.</Typography>
                    <Typography>{weiToEth(item?.maxRequestedAmount)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Start</Typography>
                    <Typography>{convertUnixTimestamp(item?.allocationStartTime)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>End</Typography>
                    <Typography>{convertUnixTimestamp(item?.allocationEndTime)}</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography sx={{ fontWeight: 'bold' }}>Strat. type</Typography>
                    <Typography>Manual</Typography>
                  </div>
                  <div className={GridModuleCss.colBreak}>
                    <Typography>{item?.pool?.metadata?.description
                      ? item.pool.metadata.description.length > 19
                        ? `${item.pool.metadata.description.slice(0, 18)}...`
                        : item.pool.metadata.description
                      : 'No description'}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BrowsePools;
