export interface NotificationDTO {
  id?: number;
  name: string;
  contactNumber: string;
  email: string;
  preferredDate: string;
  gasCapacity?: number;  // Added gas capacity field
  isRead?: boolean; // Added for frontend tracking
}
