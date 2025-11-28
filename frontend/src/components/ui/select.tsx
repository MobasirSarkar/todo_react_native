import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Icon, useTheme } from "react-native-paper"; // Only for chevron arrow

export interface SelectItem {
    title: string;
    value: string;
}

interface SelectProps {
    label?: string;
    data: SelectItem[];
    value?: SelectItem | null;
    placeholder?: string;
    onChange: (item: SelectItem) => void;
    style?: any;
}

export const Select: React.FC<SelectProps> = ({
    label,
    data,
    value,
    placeholder = "Select an option",
    onChange,
    style
}) => {
    const theme = useTheme();
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* @ts-ignore because library has missing type definitions */}
            <SelectDropdown
                data={data}
                defaultValue={data.find(d => d.value === value)}
                onSelect={(selectedItem) => onChange(selectedItem.value)}
                dropdownStyle={styles.dropdownMenu}
                showsVerticalScrollIndicator={false}

                // Button UI
                renderButton={(selectedItem, isOpened) => (
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>
                            {selectedItem?.title || placeholder}
                        </Text>

                        <Icon
                            source={isOpened ? "chevron-up" : "chevron-down"}
                            size={22}
                            color="#000"
                        />
                    </Pressable>
                )}

                // Dropdown Items
                renderItem={(item, index, isSelected) => (
                    <View
                        style={[
                            styles.item,
                            isSelected && { backgroundColor: "#F9FAFB" },
                        ]}
                    >
                        <Text style={styles.itemText}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 16, marginBottom: 8, fontWeight: "500" },

    button: {
        width: "100%",
        height: 50,
        borderRadius: 4,
        backgroundColor: "#ffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151E26",
    },

    dropdownMenu: {
        borderRadius: 8,
        backgroundColor: "#F2F3F5",
    },

    item: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    itemText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151E26",
    },
});

