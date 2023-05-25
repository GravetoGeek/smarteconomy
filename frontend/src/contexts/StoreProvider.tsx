import moment from 'moment';
import React, { createContext, useState } from 'react';
import { Account, Category, Gender, Profile, Transaction, User } from '../models';
export const Store = createContext({});

function StoreProvider({ children }) {

    const mesestmp = [
        { id: 1, month: 'Janeiro' },
        { id: 2, month: 'Fevereiro' },
        { id: 3, month: 'Março' },
        { id: 4, month: 'Abril' },
        { id: 5, month: 'Maio' },
        { id: 6, month: 'Junho' },
        { id: 7, month: 'Julho' },
        { id: 8, month: 'Agosto' },
        { id: 9, month: 'Setembro' },
        { id: 10, month: 'Outubro' },
        { id: 11, month: 'Novembro' },
        { id: 12, month: 'Dezembro' }
    ]

    const mesAtualtmp = mesestmp[moment().month()]?.month

    const initialState = {
        bottomMenuSelected: 0,
        user: {} as User,
        profile: {} as Profile,
        accounts: [] as Account[],
        gender: {} as Gender,
        transactions: [] as Transaction[],
        categories: [] as Category[],
        account_types: [] as Account[],
        transaction_types: [] as Transaction[],
        token: {} as Token,
        despesaTotal: 0,
        receitaTotal: 0,
        hoje: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
        meses: mesestmp,
        mesAtual: mesAtualtmp,
    }

    const [bottomMenuSelected, setBottomMenuSelected] = useState(initialState.bottomMenuSelected);
    const [user, setUser] = useState(initialState.user);
    const [profile, setProfile] = useState(initialState.profile);
    const [accounts, setAccounts] = useState(initialState.accounts);
    const [gender, setGender] = useState(initialState.gender)
    const [transactions, setTransactions] = useState(initialState.transactions);
    const [categories, setCategories] = useState(initialState.categories);
    const [account_types, setAccountTypes] = useState(initialState.account_types);
    const [transaction_types, setTransactionTypes] = useState(initialState.transaction_types);
    const [token, setToken] = useState(initialState.token);
    const [despesaTotal, setDespesaTotal] = useState(initialState.despesaTotal);
    const [receitaTotal, setReceitaTotal] = useState(initialState.receitaTotal);
    const [hoje, setHoje] = useState(initialState.hoje);
    const [startDate, setStartDate] = useState(initialState.startDate);
    const [endDate, setEndDate] = useState(initialState.endDate);
    const [meses, setMeses] = useState(initialState.meses);
    const [mesAtual, setMesAtual] = useState(initialState.mesAtual);

    return (
        <Store.Provider value={{
            bottomMenuSelected,
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
            setBottomMenuSelected

        }}>{children}</Store.Provider>
    )
}

export default StoreProvider;