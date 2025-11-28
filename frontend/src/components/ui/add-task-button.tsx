import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { useTheme } from "react-native-paper"

interface AddTaskProps {
    navigate: () => void
}

export const AddTaskButton = ({ navigate }: AddTaskProps) => {
    const theme = useTheme();
    return (
        <TouchableOpacity
            onPress={navigate}
            style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: "#000000",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                elevation: 6,
            }}
        >
            <Text
                style={{
                    color: theme.colors.surface,
                    fontSize: 32,
                    lineHeight: 36, // perfectly centered
                    fontWeight: "600",
                }}
            >
                +
            </Text>
        </TouchableOpacity>
    )
}
