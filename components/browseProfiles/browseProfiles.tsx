import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Stack, Skeleton, Box, Tabs, Tab, TextField, ToggleButtonGroup, ToggleButton, Tooltip, IconButton, Pagination } from '@mui/material';
import { green, red } from '@mui/material/colors';
import GridModuleCss from '@/styles/Grid.module.css'
import { TPoolData, TPoolMetadata, TProfile } from "@/types/typesPool";
import request from "graphql-request";
import { ethers } from 'ethers';
import Link from 'next/link';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { convertUnixTimestamp } from '@/global/functions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import AnchorIcon from '@mui/icons-material/Anchor';
import HailIcon from '@mui/icons-material/Hail';
import { fetchProfilesByAnchor, fetchProfilesById, fetchProfilesByName, fetchProfilesByOwner, fetchProfilesByPagination } from '@/queries/profilesQuery';

const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);
    const truncatedEth = ethValue.slice(0, 5); // Retrieve only the first 5 characters

    return `${truncatedEth} ETH`;
};

const BrowseProfiles = () => {
    const [value, setValue] = React.useState(0);
    const [search, setSearch] = useState('')
    const [filteredPools, setFilteredPools] = useState<TProfile[]>([])

    const { loading, activePools, endedPools } = React.useContext(GlobalContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedProfiles, setPaginatedProfiles] = useState<ArrayProfilesArray>([]);
    const [customSearch, setCustomSearch] = useState<ProfilesArray>([])

    const handlePageChange = (event: any, value: any) => {
        setCurrentPage(value);
        // Here you can also fetch data based on the new page number if needed
    };

    const { profiles: pagination, refetch: refetchByPagination } = fetchProfilesByPagination(10, 0)
    const { profiles: id, refetch: refetchById } = fetchProfilesById("0x1220d16b98fef733a23216008c45073f554157bb90ef9e06253428b84173c707")
    const { profiles: owner, refetch: refetchByOwner } = fetchProfilesByOwner("0xD424FA141a6B75AA8F64be6c924aA2b314B927B3")
    const { profiles: name, refetch: refetchByName } = fetchProfilesByName("Allocade")
    const { profiles: anchor, refetch: refetchByAnchor } = fetchProfilesByAnchor("0x10424e87de2c2c2bb55d5ed92d65b637d00ab53d")

    useEffect(() => {
        const pageSize = 10;
        const skip = (currentPage - 1) * pageSize;

        const fetchByPaginationPromise = async () => {
            // Check if we already have data for this page
            if (!paginatedProfiles[currentPage - 1]) {
                const response = await refetchByPagination({ first: pageSize, skip });
                const newProfiles = response.data.profiles;

                // Update the paginatedProfiles state with the new data
                setPaginatedProfiles(prev => {
                    const updatedProfiles = [...prev];
                    updatedProfiles[currentPage - 1] = newProfiles;
                    return updatedProfiles;
                });

                console.log('fetchByPagination', response.data.profiles)
            }
        }
        console.log("paginatedProfiles", paginatedProfiles)
        fetchByPaginationPromise()
    }, [currentPage, paginatedProfiles]);


    useEffect(() => {
        const searchByName = async () => {
            const response = await refetchByName({ name: search });
            setCustomSearch(response.data.profiles)
            console.log("FETCHED BY NAME", response.data.profiles)
        }

        const searchByProfileId = async () => {
            const response = await refetchById({ name: search });
            setCustomSearch(response.data.profiles)
            console.log("FETCHED BY ID", response.data.profiles)
        }

        const searchByAnchor = async () => {
            const response = await refetchByAnchor({ name: search });
            setCustomSearch(response.data.profiles)
            console.log("FETCHED BY ANCHOR", response.data.profiles)
        }

        const searchByOwner = async () => {
            const response = await refetchByOwner({ name: search });
            setCustomSearch(response.data.profiles)
            console.log("FETCHED BY OWNER", response.data.profiles)
        }

        if (search.length < 1) return

        if (alignment === "name") {
            searchByName()
        }

        if (alignment === "profileId") {
            searchByProfileId()
        }

        if (alignment === "anchor") {
            searchByAnchor()
        }

        if (alignment === "owner") {
            searchByOwner()
        }

    }, [search])

    // name | profileId | anchor | owner
    const [alignment, setAlignment] = React.useState<string | null>('name');

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        setAlignment(newAlignment);
    };

    useEffect(() => {
        setSearch('')
    }, [alignment])

    return (
        <>
            {
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', alignSelf: 'flex-start', padding: '18px 0', flexWrap: 'wrap' }}>
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                        sx={{ alignSelf: 'center', height: '38px' }}
                    >
                        <ToggleButton value="name" aria-label="left aligned">
                            <Tooltip title="Name">
                                <IconButton>
                                    <AccountCircleIcon sx={{ fill: alignment === 'name' ? '#607d8b' : '' }} />
                                </IconButton>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="profileId" aria-label="left aligned">
                            <Tooltip title="Profile ID">
                                <IconButton>
                                    <PersonIcon sx={{ fill: alignment === 'profileId' ? '#607d8b' : '' }} />
                                </IconButton>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="anchor" aria-label="left aligned">
                            <Tooltip title="Anchor">
                                <IconButton>
                                    <AnchorIcon sx={{ fill: alignment === 'anchor' ? '#607d8b' : '' }} />
                                </IconButton>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="owner" aria-label="left aligned">
                            <Tooltip title="Owner">
                                <IconButton>
                                    <HailIcon sx={{ fill: alignment === 'anchor' ? '#607d8b' : '' }} />
                                </IconButton>
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
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
                    </TextField>
                </div>}
            <Grid container spacing={1} sx={{ overflow: 'auto' }}>
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
                {(search.length > 0 ? customSearch : paginatedProfiles[currentPage - 1] ? paginatedProfiles[currentPage - 1] : []).map((item) => (
                    <Grid key={'active' + item.anchor} item sx={{ padding: '32px 0' }} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ cursor: 'pointer' }}>
                            {/* <CardMedia
                                component="img"
                                height="125"
                                image={item?. || fallbackImageURL}
                                alt="Random"
                                style={{ objectFit: 'cover' }}
                            /> */}
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                                            {item?.name
                                                ? item.name.length > 15
                                                    ? `${item.name.slice(0, 14)}...`
                                                    : item.name
                                                : 'No name'}</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Owner</Typography>
                                        <Typography>                                            {item?.owner
                                            ? item.owner.id.length > 11
                                                ? `${item.owner.id.slice(0, 9)}...`
                                                : item.owner.id
                                            : 'No ID'}</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Profile ID</Typography>
                                        <Typography>                                            {item?.id
                                            ? item.id.length > 11
                                                ? `${item.id.slice(0, 9)}...`
                                                : item.id
                                            : 'No ID'}</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Metadata</Typography>
                                        <Typography>                                            {item?.metadata
                                            ? item.metadata?.pointer?.length > 11
                                                ? `${item.metadata?.pointer?.slice(0, 9)}...`
                                                : item.metadata?.pointer
                                            : 'No ID'}</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid >

            <Pagination count={10} page={currentPage} onChange={handlePageChange} color="secondary" />
        </>
    );
};

export default BrowseProfiles;
