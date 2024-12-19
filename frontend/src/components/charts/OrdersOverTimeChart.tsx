import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { OrderEvent } from '../../type';

interface ChartData {
    date: string;
    [key: string]: number | string;
}

const OrdersOverTimeChart = ({ events }: { events: OrderEvent[] }) => {
    const chartData = useMemo(() => {
        const groupedData = events.reduce((acc: Record<string, ChartData>, event: any) => {
            const timestamp = new Date(event.timestamp).toISOString().split("T")[0] || "N/A"; // Group by date (YYYY-MM-DD)
            const kind = event.kind || "Unknown"; // Use kind to group

            // Initialize the date entry if it doesn't exist
            if (!acc[timestamp]) acc[timestamp] = { date: timestamp };

            // Increment the count for the kind
            acc[timestamp][kind] = (acc[timestamp][kind] as number || 0) + 1;

            return acc;
        }, {});

        // Convert the grouped object to an array and sort by date
        const result = Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return result
    }, [events]);

    return (
        <Stack direction="column" alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 2 }}>
            <Typography variant='h6'>Orders Over Time</Typography>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orderCreated" stroke="#0088FE" />
                    <Line type="monotone" dataKey="orderEnRoute" stroke="#00C49F" />
                    <Line type="monotone" dataKey="orderCancelled" stroke="#FF6384" />
                    <Line type="monotone" dataKey="orderDelivered" stroke="#FFBB28" />
                </LineChart>
            </ResponsiveContainer>
        </Stack>
    )
}

export default OrdersOverTimeChart