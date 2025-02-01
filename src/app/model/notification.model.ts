export interface NotificationDTO {
  id?: number;
  name: string;
  contactNumber: string;
  email: string;
  preferredDate: string;
  gasCapacity?: number;
  isRead?: boolean;
}
