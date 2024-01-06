import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { green } from '@mui/material/colors';
import GridModuleCss from '@/styles/Grid.module.css'

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
                </Grid>
            ))}
        </Grid>
    );
};

export default BrowsePools;
