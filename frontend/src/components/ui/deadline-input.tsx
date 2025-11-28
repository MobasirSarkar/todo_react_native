import React, { useEffect, useState } from "react";
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";

interface Props {
    value: Date | null;
    onChange: (date: Date | null) => void;
}

export const DeadlinePicker: React.FC<Props> = ({ value, onChange }) => {
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const [tempDate, setTempDate] = useState<Date>(value || new Date());

    useEffect(() => {
        if (value) setTempDate(value);
    }, [value]);

    const getRelative = () => {
        if (!value) return "";

        const diffHours = dayjs(value).diff(dayjs(), "hour");
        const diffDays = dayjs(value).diff(dayjs(), "day");

        if (diffHours < 1) return "(< 1 hour)";
        if (diffHours < 24) return `(in ${diffHours} hours)`;
        return `(in ${diffDays} days)`;
    };

    const getDisplay = () => {
        if (!value) return "";

        const selected = dayjs(value);
        const today = dayjs();

        if (selected.isSame(today, "day")) return `Today ${selected.format("HH:mm")}`;
        if (selected.diff(today, "day") === 1) return `Tomorrow ${selected.format("HH:mm")}`;

        return selected.format("YYYY-MM-DD HH:mm");
    };

    const onClear = () => onChange(null);

    return (
        <View>
            <View style={styles.row}>
                <Pressable style={{ flex: 1 }} onPress={() => setShowDate(true)}>
                    <TextInput
                        placeholder="Select deadline"
                        placeholderTextColor="#888"
                        style={styles.input}
                        value={getDisplay()}
                        editable={false}
                    />
                </Pressable>

                {value && (
                    <Pressable onPress={onClear} style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear</Text>
                    </Pressable>
                )}
            </View>

            {value && (
                <Text style={styles.relativeText}>{getRelative()}</Text>
            )}

            <DatePickerModal
                locale="en-GB"
                mode="single"
                visible={showDate}
                date={tempDate}
                onDismiss={() => setShowDate(false)}
                validRange={{ startDate: new Date() }} //prevents past dates
                onConfirm={({ date }) => {
                    if (!date) return;
                    setTempDate(date);
                    setShowDate(false);
                    setShowTime(true);
                }}
            />

            <TimePickerModal
                visible={showTime}
                onDismiss={() => setShowTime(false)}
                onConfirm={({ hours, minutes }) => {
                    const finalDate = dayjs(tempDate)
                        .hour(hours)
                        .minute(minutes)
                        .second(0)
                        .toDate();

                    setShowTime(false);
                    onChange(finalDate);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    clearButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: "#ddd",
        borderRadius: 8,
    },
    clearText: {
        fontWeight: "600",
        color: "#333",
    },
    relativeText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        paddingLeft: 4,
    },
});
