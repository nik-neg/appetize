export interface IUser {
  _id?: string;
  err?: {
    message: string;
    type: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface ICityUser {
  id: string;
  city: string;
}
