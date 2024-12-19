import { useEffect, useState } from 'react'
import { initialiseWebSocket } from '../utils/api';
import { AppBar, Box, CircularProgress, Container, Tab, Tabs } from '@mui/material';
import OrderTypePieChart from './charts/OrderTypeChart';
import OrdersOverTimeChart from './charts/OrdersOverTimeChart';
import AvgOrderHandleTimeBarChart from './charts/AvgOrderHandleTimeChart';
import RevenueByRestaurantChart from './charts/RevenueByRestaurantChart';
import RestaurantRatingChart from './charts/RestaurantRatingChart';

const Dashboard: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [loading, setLoading] = useState<Boolean>(true);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        // Callback function to handle incoming WebSocket messages
        const onMessage = (data: any) => {
            // console.log("Received WebSocket message:", data);
            setEvents((prevEvents) => [...prevEvents, data]); // Append new data to the event list
            setLoading(false);
        };

        // Initialise WebSocket connection
        const socket = initialiseWebSocket(onMessage);

        const timeout = setTimeout(() => setLoading(false), 5000);

        // Clean up the WebSocket connection on unmount
        return () => {
            socket.close();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Container maxWidth="lg">
            <AppBar position="static"
                sx={{
                    backgroundColor: "#1e1e1e",
                    color: "#ffffff",
                    boxShadow: "none",
                }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    centered
                    textColor="inherit"
                    indicatorColor="secondary"
                    TabIndicatorProps={{
                        style: { backgroundColor: "#3b8ac9" }, // Active tab indicator color
                    }}
                    sx={{
                        "& .MuiTab-root": {
                            color: "#bbbbbb", // Default tab text color
                        },
                        "& .Mui-selected": {
                            color: "#ffffff", // Active tab text color
                            fontWeight: "bold",
                        },
                        '& .MuiTabs-flexContainer': {
                            flexWrap: 'wrap',
                        },
                    }}>
                    <Tab label="Order Type Breakdown" />
                    <Tab label="Average Handling Time" />
                    <Tab label="Revenue by Restaurant" />
                    <Tab label="Rating Per Restaurant" />
                    <Tab label="Order Over Time" />
                </Tabs>
            </AppBar>
            {loading ?
                (
                    <Box sx={{ marginTop: 2 }}>
                        <CircularProgress />
                    </Box>
                )
                :
                (<>
                    {currentTab === 0 && <OrderTypePieChart events={events} />}
                    {currentTab === 4 && <OrdersOverTimeChart events={events} />}
                    {currentTab === 1 && <AvgOrderHandleTimeBarChart events={events} />}
                    {currentTab === 2 && <RevenueByRestaurantChart events={events} />}
                    {currentTab === 3 && <RestaurantRatingChart />}
                </>)
            }

        </Container>
    )
}

export default Dashboard