import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

const getRandomImage = () => {
    const imageUrls = [
        'https://via.placeholder.com/600x200', // Replace these placeholder URLs with actual image URLs
        'https://via.placeholder.com/600x200',
        'https://via.placeholder.com/600x200',
        // Add more image URLs as needed
    ];
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

const getRandomText = () => {
    const texts = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        // Add more text options as needed
    ];
    return texts[Math.floor(Math.random() * texts.length)];
};

const ResponsiveGrid = () => {
    const cardData = Array.from({ length: 6 }, (_, index) => ({
        id: index,
        image: getRandomImage(),
        text: getRandomText(),
    }));

    return (
        <Grid container spacing={3}>
            {cardData.map((item) => (
                <Grid key={item.id} item xs={12} sm={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="100"
                            image={item.image}
                            alt="Random"
                            style={{ objectFit: 'cover' }}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {item.text}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ResponsiveGrid;
