// user.model.ts
export interface UserModel {
  name: string;
  contactNo: number;
  email: string;
  password: string;
  roles: string[];
}

// login.model.ts
export interface LoginModel {
  email: string;
  password: string;
}
export interface UserModel {
  id?: number;
  name: string;
  email: string;
  password: string;
  roles: string[];
  token?: string;
}
