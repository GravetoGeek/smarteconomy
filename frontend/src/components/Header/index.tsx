import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Box, HStack, IconButton, Menu, Pressable } from "native-base";
import React, { useContext } from "react";
import { Text } from "react-native";
import { Store } from "../../contexts/StoreProvider";
import { Account, Category, Gender, Profile, Transaction, User } from "../../models";
import { styles } from "./style";

export default function Header() {
    const { bottomMenuSelected, setBottomMenuSelected, mesAtual, setMesAtual, setMeses, setEndDate, setStartDate, setHoje, receitaTotal, setReceitaTotal, despesaTotal, setDespesaTotal, transaction_types, setTransactionTypes, account_types, setAccountTypes, categories, setCategories, user, setUser, token, setToken, profile, setProfile, startDate, endDate, accounts, setAccounts, gender, setGender, transactions, setTransactions } = useContext(Store);
    const navigation = useNavigation();

    function handleManageProfile() {
        navigation.navigate("ManageProfile");
    }

    function handleLogout(): void {
        // Implemente a lógica de desconexão aqui.
        const meses = [
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

        const mesAtual = meses[moment().month()]?.month

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
            meses: meses,
            mesAtual: mesAtual,
        }
        // ...
        setUser(initialState.user);
        setToken(initialState.token);
        setProfile(initialState.profile);
        setAccounts(initialState.accounts);
        setTransactions(initialState.transactions);
        setTransactionTypes(initialState.transaction_types);
        setAccountTypes(initialState.account_types);
        setCategories(initialState.categories);
        setStartDate(initialState.startDate);
        setEndDate(initialState.endDate);
        setHoje(initialState.hoje);
        setDespesaTotal(initialState.despesaTotal);
        setReceitaTotal(initialState.receitaTotal);
        setMesAtual(initialState.mesAtual);
        setGender(initialState.gender);
        setBottomMenuSelected(initialState.bottomMenuSelected);

        // Depois de desconectar, redirecione o usuário para a tela de login.
        // navigation.navigate("Login");

        // Dica: você pode usar o método reset() para limpar o histórico de navegação.
        // Dessa forma, o usuário não poderá voltar para a tela de dashboard ao pressionar o botão "voltar" do celular.
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });

    }

    return (
        <Box>
            <HStack style={styles.header}>
                <Text style={styles.username}>
                    {profile.name} {profile.lastname}
                </Text>
                <Menu
                    trigger={(triggerProps) => {
                        return (
                            <IconButton
                                {...triggerProps}
                                icon={<Feather name="menu" size={24} color="#ffffff" />}
                                accessibilityLabel="Opções"
                            />
                        );
                    }}
                >
                    <Menu.Item onPress={handleManageProfile}>
                        <Text>Gerenciar Perfil</Text>
                    </Menu.Item>
                    <Menu.Item onPress={handleLogout}>
                        <Text>Desconectar</Text>
                    </Menu.Item>
                </Menu>
            </HStack>
        </Box>
    );
}