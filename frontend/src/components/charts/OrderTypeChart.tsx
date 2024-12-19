import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { OrderEvent } from '../../type';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

interface ChartData {
    result: { name: string; value: number }[];
    successRate: string | number;
    cancellationRate: string | number;
    orderCreated: number;
}

const OrderTypePieChart = ({ events }: { events: OrderEvent[] }) => {
    const chartData = useMemo<ChartData>(() => {
        const kindCounts = events.reduce((acc: Record<string, number>, event: OrderEvent) => {
            const kind = event.kind ?? "Unknown";
            acc[kind] = (acc[kind] || 0) + 1;
            return acc;
        }, {});

        const orderCreated = kindCounts["orderCreated"] || 0;
        const orderEnRoute = kindCounts["orderEnRoute"] || 0;
        const orderDelivered = kindCounts["orderDelivered"] || 0;
        const orderCancelled = kindCounts["orderCancelled"] || 0;

        // Calculate Success Rate
        const successRate = orderCreated
            ? ((orderDelivered / orderCreated) * 100).toFixed(2)
            : 0;

        // Additional insights (if needed)
        const cancellationRate = orderCreated
            ? ((orderCancelled / orderCreated) * 100).toFixed(2)
            : 0;

        const result = Object.entries(kindCounts).map(([kind, count]) => ({
            name: kind.replace(/^order/, ''),
            value: count as number,
        }));

        return { result, successRate, cancellationRate, orderCreated }
    }, [events]);

    return (
        <Stack spacing={2} direction="row" alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 2 }}>
            <Stack spacing={2} direction="column">
                <Typography variant="h6" sx={{ textAlign: 'center' }}>By Order Type (of All Restaurants)</Typography>
                <ResponsiveContainer width={"100%"} height={400}>
                    <PieChart>
                        <Pie
                            data={chartData.result}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            {chartData.result.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </Stack>
            <Stack direction="column" spacing={2}>
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography>Total Order(s)</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '2rem' }}>{chartData.orderCreated}</Typography>
                    </CardContent>
                </Card>
                <Stack direction="row" spacing={2}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent sx={{ display: 'flex', flexDirection: ' column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography>Success</Typography>
                            <Typography color="success" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>{chartData.successRate}%</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: "100%" }}>
                        <CardContent sx={{ display: 'flex', flexDirection: ' column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography>Cancellation</Typography>
                            <Typography color="error" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>{chartData.cancellationRate}%</Typography>
                        </CardContent>
                    </Card>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default OrderTypePieChart