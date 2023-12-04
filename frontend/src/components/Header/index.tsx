import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, IconButton, Menu, Pressable } from "native-base";
import React, { useContext } from "react";
import { Text } from "react-native";
import { Store } from "../../contexts/StoreProvider";
import { styles } from "./style";

export default function Header() {
    const { user, setUser, token, setToken, profile, setProfile, startDate, endDate } = useContext(Store);
    const navigation = useNavigation();

    function handleManageProfile() {
        navigation.navigate("ManageProfile");
    }

    function handleLogout() {
        // Implemente a lógica de desconexão aqui.
        // ...
        setUser({});
        setToken({});
        setProfile({});

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