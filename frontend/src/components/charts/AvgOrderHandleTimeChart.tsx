import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { OrderEvent, Restaurant } from '../../type';
import { useFetchAllRestaurants } from '../../utils/useFetchAllRestaurants';

const AvgOrderHandleTimeBarChart = ({ events }: { events: OrderEvent[] }) => {
    const { restaurants } = useFetchAllRestaurants();
    const chartData = useMemo(() => {
        const handlingTimes: { [key: string]: number[] } = {};

        // Group events by `orderId` and calculate handling times
        const eventsByOrder: { [orderId: string]: OrderEvent[] } = {};

        events.forEach((e) => {
            // Group events by orderId
            (eventsByOrder[e.orderId] ||= []).push(e);
        });

        // Calculate handling times for each restaurant
        for (const orderId in eventsByOrder) {
            const orderEvents = eventsByOrder[orderId];
            const created = orderEvents.find((e) => e.kind === "orderCreated");
            const enRoute = orderEvents.find((e) => e.kind === "orderEnRoute");
            const delivered = orderEvents.find((e) => e.kind === "orderDelivered");

            if (created && delivered) {
                const createdTime = new Date(created.timestamp).getTime();
                const deliveredTime = new Date(delivered.timestamp).getTime();
                const handlingTime = deliveredTime - createdTime;

                if (!handlingTimes[created.restaurantId || ""]) handlingTimes[created.restaurantId || ""] = [];
                handlingTimes[created.restaurantId || ""].push(handlingTime);
            }
        }

        let longestHandlingTime = { name: "", avgHandlingTime: 0 };

        const chartData = restaurants.map((restaurant: Restaurant) => {
            const times = handlingTimes[restaurant.id] || [];
            const avgHandlingTime =
                times.length > 0
                    ? times.reduce((sum, time) => sum + time, 0) / times.length
                    : 0;

            const avgHandlingTimeInMinutes = Math.round(avgHandlingTime / (1000 * 60)); // Convert to minutes

            if (avgHandlingTimeInMinutes > longestHandlingTime.avgHandlingTime) {
                longestHandlingTime = {
                    name: restaurant.name,
                    avgHandlingTime: avgHandlingTimeInMinutes,
                };
            }

            return {
                name: restaurant.name,
                rating: restaurant.rating,
                avgHandlingTime: avgHandlingTimeInMinutes,
            };
        });

        return { chartData, longestHandlingTime };
    }, [events]);

    const CustomToolTip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ backgroundColor: "#fff", color: "#000", padding: 3 }}>
                    <Typography>{payload[0].payload.name}</Typography>
                    <Typography>{payload[0].name}: {payload[0].value} minute(s)</Typography>
                    <Typography>Rating: <span style={{ color: payload[0].payload.rating < 3.0 ? 'red' : "#000", fontWeight: 'bold' }}>{payload[0].payload.rating}</span></Typography>
                </Box>
            )
        }
    };

    return (
        <Stack direction="column" spacing={2} alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 2 }}>
            <Typography variant="h6">Average Handle Time by Restaurant</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.chartData}>
                    <XAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval={0} 
                        angle={-10}
                        textAnchor="end" 
                    />
                    <YAxis />
                    <Tooltip content={<CustomToolTip />} />
                    <Bar dataKey="avgHandlingTime" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <Card>
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold' }}>{`Longest Handling Time: ${chartData.longestHandlingTime.name} (${chartData.longestHandlingTime.avgHandlingTime} minutes)`}</Typography>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default AvgOrderHandleTimeBarChart