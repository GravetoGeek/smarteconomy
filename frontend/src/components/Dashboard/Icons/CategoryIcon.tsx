// CategoryIcon.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

interface CategoryIconProps {
    category: string;
    size: number;
    color: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size, color }) => {
    let iconName: string;

    switch (category) {
        case "Lazer":
            iconName = "local-activity";
        case "Educação":
            iconName = "school";
        case "Saúde":
            iconName = "local-hospital";
        case "Transporte":
            iconName = "directions-car";
        case "Outros":
            iconName = "category";
        case "Moradia":
            iconName = "home";
        case "Alimentação":
            iconName = "restaurant";
        default:
            iconName = "help";
    }

    return <MaterialIcons name={iconName} size={size} color={color} />;
};

export default CategoryIcon;