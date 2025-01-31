export interface NotificationDTO {
    id?: number;
    name: string;
    contactNumber: string;
    address: string;
    preferredDate: string;
    gasCapacity?: number;  // Added gas capacity field
    isRead?: boolean; // Added for frontend tracking
}

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
