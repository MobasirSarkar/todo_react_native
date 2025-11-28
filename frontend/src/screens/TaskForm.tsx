import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Text
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useTasks } from "../hooks/useTasks";
import { RootStackParamsList } from "../navigation/app-navigator";
import { Task } from "../store/task-slice";
import { Appbar, Divider } from "react-native-paper";
import { Select } from "../components/ui/select";
import { DeadlinePicker } from "../components/ui/deadline-input";

type Props = NativeStackScreenProps<RootStackParamsList, "TaskForm">;

export default function TaskFormScreen({ route, navigation }: Props) {
    const taskId = route.params?.taskId;
    const { data } = useTasks();
    const { createTask, updateTask } = useTaskMutations();

    const tasks = data?.data ?? []
    const existing = tasks?.find((t: Task) => t._id === taskId);

    const [title, setTitle] = useState(existing?.title || "");
    const [description, setDescription] = useState(existing?.description || "");

    const [deadline, setDeadline] = useState<Date | null>(
        existing?.deadLine ? new Date(existing.deadLine) : null
    );
    const [priority, setPriority] = useState(existing?.priority || "medium")

    const prioritys = [
        { title: "High", value: "high" },
        { title: "Medium", value: "medium" },
        { title: "Low", value: "low" }
    ]

    const onSubmit = () => {
        const payload = {
            title,
            description,
            deadline,
            dateTime: new Date().toISOString(),
            priority
        };

        if (existing) {
            updateTask.mutate(
                { id: existing._id, data: payload },
                {
                    onSuccess: () => navigation.goBack()
                }
            );
        } else {
            createTask.mutate(payload, {
                onSuccess: () => navigation.goBack()
            });
        }
    };

    return (
        <>
            <Appbar.Header style={{
                backgroundColor: "#f0f0f0",
            }} >
                <Appbar.Content title="New Task" />
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>
            <Divider />
            <View style={styles.container}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    placeholder="Enter Title"
                    autoCapitalize="none"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.textarea}
                    placeholderTextColor="#888"
                    placeholder="Enter task description (optional)"
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                />

                <Select
                    label="Priority"
                    value={priority}
                    onChange={setPriority}
                    placeholder="select priority"
                    data={prioritys}

                />

                <Text style={styles.label}>Deadline</Text>
                <DeadlinePicker value={deadline} onChange={(date) => setDeadline(date)} />

                <Pressable
                    onPress={onSubmit}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {existing ? "Save Changes" : "Create Task"}
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, marginTop: 36, backgroundColor: "#f0f0f0" },
    input: {
        padding: 14,
        borderRadius: 4,
        marginBottom: 12,
        backgroundColor: "#ffffff",
    },
    button: {
        backgroundColor: "#222224",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 12,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },

    textarea: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 2,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: "top",
        marginBottom: 16,
        backgroundColor: "#ffffff",
    },
});
