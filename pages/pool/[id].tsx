import Container from '@/components/container/container';
import DisplayPoolInfo from '@/components/displayPoolInfo/displayPoolInfo';
import { Box, Card, CardContent, CardMedia, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import Head from 'next/head'
import React from 'react';
import GridModuleCss from '@/styles/Grid.module.css'

export default function PoolDetails() {
    const [value, setValue] = React.useState(0);
    const [applications, setApplications] = React.useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
            width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
        }}>
            <Tabs
                textColor="secondary"
                indicatorColor="secondary" value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab color="secondary" label="Pool details" />
                <Tab color="secondary" label="Applications" />
            </Tabs>
            {value === 0 &&
                <DisplayPoolInfo />}

            <Grid container spacing={2} sx={{ overflow: 'auto' }}>
                {value === 1 && applications.map((item) => (
                    <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ cursor: 'pointer' }}>
                            <CardMedia
                                component="img"
                                height="125"
                                image={fallbackImageURL}
                                alt="Random"
                                style={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                                            test</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Submitted on</Typography>
                                        <Typography>1/4/2024</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Amount</Typography>
                                        <Typography>0 ETH</Typography>
                                    </div>
                                    <div className={GridModuleCss.colBreak}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Status</Typography>
                                        <Typography>pending</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
