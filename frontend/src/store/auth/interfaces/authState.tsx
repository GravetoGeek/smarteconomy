import { IUser } from "../../user/interfaces/IUser";
export interface AuthState {
  isLoggedIn: boolean;
  user: IUser | null;
}