import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  AddAccount: undefined;
  AddTransaction: undefined;
  ManageProfile: undefined;
  ListTransactions: undefined;
  ListTransactionByCategory: {
    x: string;
    y: number;
    category: string;
    id?: number;
    color: string;
    iconName: string;
  };
  ManageTransaction: {
    id: number;
    description: string;
    amount: number;
    date: string;
    type_id: number;
    account_id: number;
    category_id: number;
    user_id?: number;
    account?: any;
    category?: any;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
