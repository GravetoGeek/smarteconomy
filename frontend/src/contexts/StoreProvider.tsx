import moment from 'moment';
import React, { createContext, useState } from 'react';
import { Account, Category, Gender, Profile, Transaction, User } from '../models';
export const Store = createContext({});

function StoreProvider({ children }) {
    const [user, setUser] = useState<User>({} as User);
    const [profile, setProfile] = useState<Profile>({} as Profile);
    const [accounts, setAccounts] = useState<Account[]>([] as Account[]);
    const [gender, setGender] = useState<Gender>({} as Gender);
    const [transactions, setTransactions] = useState<Transaction[]>([] as Transaction[]);
    const [categories, setCategories] = useState<Category[]>([] as Category[]);
    const [account_types, setAccountTypes] = useState<Account[]>([] as Account[]);
    const [transaction_types, setTransactionTypes] = useState<Transaction[]>([] as Transaction[]);
    const [token, setToken] = useState<Token>({} as Token);
    const [despesaTotal, setDespesaTotal] = useState(0);
    const [receitaTotal, setReceitaTotal] = useState(0);
    const [hoje, setHoje] = useState(moment().format('YYYY-MM-DD'))
    const [startDate, setStartDate] = useState(moment(hoje).startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment(hoje).endOf('month').format('YYYY-MM-DD'));
    const [meses, setMeses] = useState([
        { id: 1, nome: 'Janeiro' },
        { id: 2, nome: 'Fevereiro' },
        { id: 3, nome: 'Março' },
        { id: 4, nome: 'Abril' },
        { id: 5, nome: 'Maio' },
        { id: 6, nome: 'Junho' },
        { id: 7, nome: 'Julho' },
        { id: 8, nome: 'Agosto' },
        { id: 9, nome: 'Setembro' },
        { id: 10, nome: 'Outubro' },
        { id: 11, nome: 'Novembro' },
        { id: 12, nome: 'Dezembro' }
    ])
    const [mesAtual, setMesAtual] = useState(meses[moment(hoje).month()].nome)




    return (
        <Store.Provider value={{
            user,
            profile,
            accounts,
            gender,
            transactions,
            categories,
            account_types,
            transaction_types,
            token,
            despesaTotal,
            receitaTotal,
            hoje,
            startDate,
            endDate,
            meses,
            mesAtual,
            setUser,
            setProfile,
            setAccounts,
            setGender,
            setTransactions,
            setCategories,
            setAccountTypes,
            setTransactionTypes,
            setToken,
            setDespesaTotal,
            setReceitaTotal,
            setHoje,
            setStartDate,
            setEndDate,
            setMeses,
            setMesAtual,

        }}>{children}</Store.Provider>
    )
}

export default StoreProvider;