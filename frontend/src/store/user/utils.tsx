import { IUser } from "./interfaces/IUser";
import { setUserEmail, setUserId } from './slice';

export const setUserDetails = (data: IUser) => {
  const { userId, userEmail }: IUser = data;
  setUserId(userId);
  setUserEmail(userEmail);
};
