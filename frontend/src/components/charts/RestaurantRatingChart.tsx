import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFetchAllRestaurants } from '../../utils/useFetchAllRestaurants';
import { Restaurant } from '../../type';

const RestaurantRatingChart: React.FC = () => {
    const { restaurants }: { restaurants: Restaurant[] } = useFetchAllRestaurants();

    const lowestRatingRestaurant = useMemo(() => {
        if (!restaurants || restaurants.length === 0) return null;
        return restaurants.reduce((lowest, restaurant) =>
            restaurant.rating < lowest.rating ? restaurant : lowest
        );
    }, [restaurants]);

    const CustomToolTip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ backgroundColor: "#fff", color: "#000", padding: 3 }}>
                    <Typography>{payload[0].payload.name}</Typography>
                    <Typography>Rating: <span style={{ color: payload[0].payload.rating < 3.0 ? 'red' : "#000", fontWeight: 'bold' }}>{payload[0].payload.rating}</span></Typography>
                </Box>
            )
        }
    }

    return (
        <Stack direction="column" alignItems={"center"} justifyContent={"center"} spacing={2} sx={{ marginTop: 2 }}>
            <Typography variant="h6">Rating Per Restaurant</Typography>
            <Stack direction="row" spacing={2} alignItems={"center"} justifyContent={"center"}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Lowest Rating</Typography>
                        <Typography sx={{ fontWeight: 'bold', marginTop: 2 }}>{lowestRatingRestaurant?.name}</Typography>
                        <Typography sx={{ fontWeight: 'bold', color: 'red', fontSize: '2rem' }}>{lowestRatingRestaurant?.rating}</Typography>
                    </CardContent>
                </Card>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={restaurants} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-10}
                            textAnchor="end" />
                        <YAxis type="number" dataKey="rating" />
                        <Tooltip content={<CustomToolTip />} />
                        <Bar
                            dataKey="rating"
                            shape={(props: any) => {
                                const { x, y, width, height, value } = props;
                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={value < 3 ? "red" : "#82ca9d"}
                                    />
                                );
                            }} />
                    </BarChart>
                </ResponsiveContainer>
            </Stack>
        </Stack>
    )
}

export default RestaurantRatingChart