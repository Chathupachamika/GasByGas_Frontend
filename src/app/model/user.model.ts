export interface UserDTO {
  id: number;
  name: string;
  email: string;
  contactNo: number;
  password?: string;
  roles: Set<string>;
}
