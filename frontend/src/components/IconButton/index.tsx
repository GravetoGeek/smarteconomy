import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text } from 'react-native';
import { styles } from "./style";

export default function IconButton({ icon, label, onPress }) {
    return (
        <Pressable style={styles.iconButton} onPress={onPress}>
            <MaterialIcons name={icon} size={24} color="#4e4d4d" />
            <Text style={styles.iconButtonLabel}>{label}</Text>
        </Pressable>
    );
}