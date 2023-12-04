// CategoryIcon.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React from 'react';
import { Icons } from '../../Icons/Icons';

interface CategoryIconProps {
    category: string;
    size: number;
    color: string;
}

const CategoryIcon = ({ category, size, color }) => {
    // const { category, categoryId, size, color } = props;
    const iconName = Icons.filter((item) => item.category == category)[0]?.icon || "help";
    return <Icon as={<MaterialIcons name={iconName} color={color} />} size={5} ml={2} color={color} />;
    // return <MaterialIcons name={iconName} color={color} />
};

export default CategoryIcon;