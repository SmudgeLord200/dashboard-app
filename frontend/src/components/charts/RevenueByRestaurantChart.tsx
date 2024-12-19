import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { OrderEvent, Restaurant } from '../../type';
import { useFetchAllRestaurants } from '../../utils/useFetchAllRestaurants';

const RevenueByRestaurantChart = ({ events }: { events: OrderEvent[] }) => {
    const { restaurants }: { restaurants: Restaurant[] } = useFetchAllRestaurants();
    const chartData = useMemo(() => {
        const revenueByRestaurant: { [restaurantId: string]: number } = {};

        events.forEach((event) => {
            if (event.kind === "orderCreated" && event.restaurantId && event.totalAmount) {
                const restaurantId = event.restaurantId;
                const amount = parseFloat(event.totalAmount);

                if (!isNaN(amount)) {
                    if (!revenueByRestaurant[restaurantId]) {
                        revenueByRestaurant[restaurantId] = 0;
                    }
                    revenueByRestaurant[restaurantId] += amount;
                }
            }
        });

        const chartData = restaurants.map((restaurant) => ({
            name: restaurant.name,
            rating: restaurant.rating,
            revenue: revenueByRestaurant[restaurant.id] || 0,
        }));

        // Find the highest revenue restaurant using reduce
        const highestRevenue = chartData.reduce(
            (max, curr) => (curr.revenue > max.revenue ? curr : max),
            { name: "N/A", revenue: 0 }
        );

        return { chartData, highestRevenue };
    }, [events, restaurants]);

    return (
        <Stack direction="column" alignItems={"center"} justifyContent={"center"} spacing={2} sx={{ marginTop: 2 }}>
            <Typography variant="h6">Revenue By Restaurant</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.chartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-10}
                        textAnchor="end" />
                    <YAxis type="number" dataKey="revenue" unit=" GBP" />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            <Card>
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold' }}> Highest Revenue: {chartData.highestRevenue.name} - ${chartData.highestRevenue.revenue.toFixed(2)}</Typography>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default RevenueByRestaurantChart