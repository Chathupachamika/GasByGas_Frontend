
export enum OrderStatus {
  PENDING = 'PENDING', // Awaiting stock or user pickup
  DELIVERED = 'DELIVERED', // Successfully picked up or delivered
  CANCELLED = 'CANCELLED', // Cancelled due to any reason
  PENDING_REALLOCATION = 'PENDING_REALLOCATION' // Awaiting reallocation for another customer
}

// Optional: If you want to provide a list of all statuses for easier use in your application
export const ORDER_STATUS_VALUES: string[] = Object.values(OrderStatus);
