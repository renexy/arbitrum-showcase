import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Stack, Skeleton, Box, Tabs, Tab, TextField } from '@mui/material';
import { green, red } from '@mui/material/colors';
import GridModuleCss from '@/styles/Grid.module.css'
import { TPoolData, TPoolMetadata } from "@/types/typesPool";
import request from "graphql-request";
import { ethers } from 'ethers';
import Link from 'next/link';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { convertUnixTimestamp } from '@/global/functions';

const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);
    const truncatedEth = ethValue.slice(0, 5); // Retrieve only the first 5 characters

    return `${truncatedEth} ETH`;
};

const BrowsePools = () => {
    const [value, setValue] = React.useState(0);
    const [search, setSearch] = useState('')
    const [filteredPools, setFilteredPools] = useState<TPoolData[]>([])

    const { loading, activePools, endedPools } = React.useContext(GlobalContext);

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
        console.log(endedPools)
    }, [filteredPools])

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
                    <Grid key={'active' + item.poolId} item xs={12} sm={6} md={4} lg={3}>
                        <Link href={'/pool/' + item?.poolId}>
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
                        </Link>
                    </Grid>
                ))}
                {!loading && value === 1 && (search.length > 0 ? filteredPools : endedPools ? endedPools : []).map((item) => (
                    <Grid key={'inactive' + item.poolId} item xs={12} sm={6} md={4} lg={3}>
                        <Link href={'/pool/' + item?.poolId}>
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
                        </Link>
                    </Grid>
                ))}
            </Grid >
        </>
    );
};

export default BrowsePools;
