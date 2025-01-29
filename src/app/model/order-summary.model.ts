export interface OrderSummaryDTO {
  id?: number; // Optional, as it might not be provided when creating a new order
  customerName: string;
  email: string;
  mobileNumber: string;
  userId: number;
  gasId: number;
  hasEmptyCylinder: boolean;
  location: string;
  outletId: string;
  quantity: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  deliveryDate: string; // You can use Date type if needed, but string is common for API responses
  deliveryTime: string;
  postalCode: string;
  paymentMethod: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  nameOnCard: string;
}
