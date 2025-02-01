export interface OrderSummaryDTO {
  id?: number;
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
  deliveryDate: string;
  deliveryTime: string;
  postalCode: string;
  paymentMethod: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  nameOnCard: string;
}
