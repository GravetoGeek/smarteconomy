import { Text } from "native-base";
export default function ExtratoDespesaCategoria(item: any) {
    let { categoria } = item.route.params;
    console.log('ExtratoDespesaCategoria', categoria)
    return (
        <Text mt={10}>ExtratoDespesaCategoria{categoria.x}</Text>
    )
}