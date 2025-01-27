export interface Order {
    id: number;
    status: string;
    tokenNumber: string;
    userId: number;
    deliveryScheduleId?: number;
    outletId: number;
    orderGasList: OrderGas[];
}

export interface OrderGas {
    id: number;
    orderId: number;
    gasId: number;
    quantity: number;
}