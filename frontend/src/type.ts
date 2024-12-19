export interface OrderEvent {
    orderId: string;
    timestamp: Date;
    kind: string;
    driverId?: string;
    driverName?: string;
    restaurantId?: string;
    totalAmount?: string;
    userId?: string;
}

export interface Restaurant {
    id: string;
    name: string;
    rating: number;
};