import React from "react";
import { Feather } from "@expo/vector-icons";
import {
    Text,
    TouchableOpacity,
} from "react-native";
import { styles } from "./style";
import { HStack, Box, View } from "native-base";



export default function Header() {
    return (
        <Box >

            <HStack style={styles.header}>

                <Text style={styles.username} >Eduardo</Text>
                <TouchableOpacity activeOpacity={0.9} style={styles.button}>
                    <Feather name="user" size={24} color="#ffffff" />
                </TouchableOpacity>
            </HStack>
        </Box>
    )
}
