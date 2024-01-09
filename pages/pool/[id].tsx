import Container from '@/components/container/container';
import DisplayPoolInfo from '@/components/displayPoolInfo/displayPoolInfo';
import { Box, Button, Card, CardContent, CardMedia, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import GridModuleCss from '@/styles/Grid.module.css'
import ApplicationForm from '@/components/applicationForm/applicationForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TPoolData } from '@/types/typesPool';
import { useRouter } from 'next/router';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { convertUnixTimestamp, formatDate } from '@/global/functions';
import { ethers } from 'ethers';

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);
    if (ethValue && ethValue.length > 11) {

        return ethValue.slice(0, 5);
    }

    return `${ethValue} ETH`;
};

export default function PoolDetails() {
    const [value, setValue] = React.useState(0);
    const [applications, setApplications] = React.useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';
    const [showApplyForm, setShowApplyForm] = React.useState(false)
    const router = useRouter()
    const [selectedPool, setSelectedPool] = useState<TPoolData | undefined>(undefined)
    const [active, setActive] = useState(false)
    const [applicationData, setApplicationData] = useState<ApplicationData[] | undefined>(undefined)

    const { loading, activePools, endedPools, totalPoolApplications } = React.useContext(GlobalContext);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    const findApplications = (find: string) => {
        if (totalPoolApplications && totalPoolApplications.length > 0) {
            var foundApplications = totalPoolApplications.filter(x => x.poolId === find)
            if (foundApplications) {
                setApplicationData(foundApplications)
            }
        }
    }

    React.useEffect(() => {
        const { id } = router.query;

        if (id) {
            findApplications(id as string)
            if (activePools && activePools.length > 0) {
                console.log('1')
                const foundActive = activePools.find(pool => pool.poolId === id);
                if (foundActive) {
                    setSelectedPool(foundActive);
                    setActive(true);
                    return; // Exit the function once the active pool is found
                }
            }

            if (endedPools && endedPools.length > 0) {
                console.log('2')
                const foundEnded = endedPools.find(pool => pool.poolId === id);
                if (foundEnded) {
                    setSelectedPool(foundEnded);
                    setActive(false);
                    return; // Exit the function once the ended pool is found
                }
            }

            // If the pool with the provided ID is not found in both activePools and endedPools
            setSelectedPool(undefined);
            setActive(false);
        }
    }, [router.query, activePools, endedPools, totalPoolApplications]);


    return (
        <Box sx={{
            width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
        }}>
            {!selectedPool && <Typography>Loading...</Typography>}
            {showApplyForm && <Button size="medium" sx={{ alignSelf: 'flex-start' }}
                onClick={() => { setShowApplyForm(false) }}
                endIcon={<ArrowBackIcon sx={{ fill: '#fff', cursor: 'pointer' }} />}>
                Back
            </Button>
            }
            {!showApplyForm && selectedPool && <Tabs
                textColor="secondary"
                indicatorColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab color="secondary" label="Pool details" />
                {applicationData && applicationData.length > 0 && <Tab color="secondary" label="Applications" />}
            </Tabs>
            }
            {value === 0 && !showApplyForm && selectedPool &&
                <DisplayPoolInfo selectedPool={selectedPool} active={active} />}

            {value === 1 && applicationData && applicationData[0] && applicationData[0].microGrantRecipients &&
                applicationData[0].microGrantRecipients.length > 0
                && !showApplyForm && <Grid container spacing={2} sx={{ overflow: 'auto' }}>
                    {applicationData[0].microGrantRecipients.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ cursor: 'pointer' }}>
                                <CardMedia
                                    component="img"
                                    height="125"
                                    image={item?.metadata?.bannerImage || fallbackImageURL}
                                    alt="Random"
                                    style={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div className={GridModuleCss.colBreak}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                                                {item?.metadata?.metadata?.name || "/"}</Typography>
                                        </div>
                                        <div className={GridModuleCss.colBreak}>
                                            <Typography sx={{ fontWeight: 'bold' }}>Submitted on</Typography>
                                            <Typography>{formatDate(item?.blockTimestamp) || '/'}</Typography>
                                        </div>
                                        <div className={GridModuleCss.colBreak}>
                                            <Typography sx={{ fontWeight: 'bold' }}>Amount</Typography>
                                            <Typography>{weiToEth(item?.metadata?.application?.requestedAmount)}</Typography>
                                        </div>
                                        <div className={GridModuleCss.colBreak}>
                                            <Typography sx={{ fontWeight: 'bold' }}>Status</Typography>
                                            <Typography>{item?.metadata?.status || 'Pending'}</Typography>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            }
            {showApplyForm && <ApplicationForm></ApplicationForm>}
            {value === 0 && active && !showApplyForm && selectedPool && <Button
                component="span"
                variant="contained"
                color="secondary"
                size="medium"
                sx={{ alignSelf: 'flex-end' }}
                onClick={() => { setShowApplyForm(true) }}
            >
                Apply
            </Button>
            }
        </Box>
    )
}
