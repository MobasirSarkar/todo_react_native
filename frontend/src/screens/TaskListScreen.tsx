import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useTasks } from "../hooks/useTasks";
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useAppDispatch } from "../store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/app-navigator";
import { logout } from "../store/auth-slice";
import { Checkbox, Chip, Icon, IconButton, Divider, useTheme } from "react-native-paper";
import { AddTaskButton } from "../components/ui/add-task-button";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamsList, "Tasks">;

export default function TaskListScreen({ navigation }: Props) {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { data, isLoading, error } = useTasks();
    const { updateTask, deleteTask } = useTaskMutations();

    // STATUS FILTER ONLY
    const [filter, setFilter] = React.useState<"all" | "in-progress" | "completed">("all");

    // FILTERED TASKS
    const filteredTasks = React.useMemo(() => {
        const tasks = data?.data ?? [];

        return tasks.filter((t) => {
            if (filter === "completed" && !t.completed) return false;
            if (filter === "in-progress" && t.completed) return false;
            return true;
        });
    }, [data?.data, filter]);

    if (isLoading) return <ActivityIndicator size="large" />;
    if (error) return <Text>Failed to load tasks</Text>;

    const blackColor = "#222224"

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={["top"]}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 4 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        paddingVertical: 4,
                        marginTop: 20
                    }}
                >
                    {/* Logout */}
                    <TouchableOpacity onPress={() => dispatch(logout())}>
                        <Text style={{ color: theme.colors.error, fontSize: 14, fontWeight: "600" }}>
                            Logout
                        </Text>
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 15,
                        fontWeight: "bold"
                    }}>My Tasks</Text>
                </View>

                <Divider style={{ marginBottom: 12, width: "auto" }} />

                {/* ---------- FILTER TABS ---------- */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                >
                    <Chip
                        selected={filter === "all"}
                        onPress={() => setFilter("all")}
                        style={{
                            marginRight: 8,
                            borderRadius: 2,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            minHeight: 36,
                            backgroundColor: blackColor,
                            alignItems: "center",


                        }}
                        textStyle={{ fontSize: 14, fontWeight: "600", color: theme.colors.surface }}
                        selectedColor="#ffffff"
                    >
                        All
                    </Chip>

                    <Chip
                        selected={filter === "in-progress"}
                        onPress={() => setFilter("in-progress")}
                        style={{
                            marginRight: 8,
                            borderRadius: 2,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            minHeight: 36,
                            alignItems: "center",

                            backgroundColor: blackColor,
                        }}
                        textStyle={{ fontSize: 14, fontWeight: "600", color: theme.colors.surface }}
                        selectedColor="#ffffff"
                    >
                        Pending
                    </Chip>

                    <Chip
                        selected={filter === "completed"}
                        onPress={() => setFilter("completed")}
                        style={{
                            borderRadius: 2,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            minHeight: 36,
                            backgroundColor: blackColor,
                            alignItems: "center",
                        }}
                        textStyle={{ fontSize: 14, fontWeight: "600", color: theme.colors.surface }}
                        selectedColor="#ffffff"
                    >
                        Completed
                    </Chip>
                </View>
                <Divider style={{ marginBottom: 12 }} />
                <FlatList
                    data={filteredTasks}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const formattedDate = item.deadLine
                            ? new Date(item.deadLine).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour12: true,
                            })
                            : null;

                        // PRIORITY MAP
                        const priorityMap: Record<
                            string,
                            { label: string; color: string; icon: string }
                        > = {
                            high: {
                                label: "High",
                                color: theme.colors.backdrop,
                                icon: "alert-circle-outline",
                            },
                            medium: {
                                label: "Medium",
                                color: theme.colors.backdrop,
                                icon: "alert-outline",
                            },
                            low: {
                                label: "Low",
                                color: theme.colors.backdrop,
                                icon: "check-circle-outline",
                            },
                        };

                        const priorityInfo = priorityMap[item.priority] || null;

                        return (
                            <View
                                style={{
                                    padding: 16,
                                    backgroundColor: theme.colors.surface,
                                    borderRadius: 6,
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: theme.colors.outlineVariant,
                                }}
                            >
                                {/* -------- TOP ROW: CHECKBOX + TITLE + DELETE -------- */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                        }}
                                    >
                                        <Checkbox
                                            status={item.completed ? "checked" : "unchecked"}
                                            onPress={() =>
                                                updateTask.mutate({
                                                    id: item._id,
                                                    data: { completed: !item.completed },
                                                })
                                            }

                                        />

                                        <TouchableOpacity
                                            onPress={() =>
                                                updateTask.mutate({
                                                    id: item._id,
                                                    data: { completed: !item.completed },
                                                })
                                            }
                                            style={{ flexShrink: 1 }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "600",
                                                    color: blackColor,
                                                    textDecorationLine: item.completed
                                                        ? "line-through"
                                                        : "none",
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Delete */}
                                    <IconButton
                                        icon="delete-outline"
                                        iconColor={theme.colors.error}
                                        size={20}
                                        style={{
                                            backgroundColor: theme.colors.errorContainer,
                                            borderRadius: 2,
                                            margin: 0,
                                        }}
                                        onPress={() => deleteTask.mutate(item._id)}
                                    />
                                </View>

                                {/* -------- DESCRIPTION -------- */}
                                {item.description && (
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.secondary,
                                            marginTop: 4,
                                            paddingLeft: 42,
                                            lineHeight: 18,
                                        }}
                                    >
                                        {item.description}
                                    </Text>
                                )}

                                {/* -------- BOTTOM ROW: PRIORITY + DATE -------- */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: 10,
                                        paddingLeft: 42,
                                    }}
                                >
                                    {/* PRIORITY */}
                                    {priorityInfo && (
                                        <>
                                            <Icon
                                                source={priorityInfo.icon}
                                                size={14}
                                                color={priorityInfo.color}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "600",
                                                    color: priorityInfo.color,
                                                    marginLeft: 4,
                                                    marginRight: 16,
                                                }}
                                            >
                                                {priorityInfo.label}
                                            </Text>
                                        </>
                                    )}

                                    {/* DATE */}
                                    {formattedDate && (
                                        <>
                                            <Icon
                                                source="calendar-outline"
                                                size={14}
                                                color="#FD6A5E"
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: "#FD6A5E",
                                                    fontWeight: "600",
                                                    marginLeft: 4,
                                                }}
                                            >
                                                {formattedDate}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                />
            </View>

            <AddTaskButton navigate={() => navigation.navigate("TaskForm")} />
        </SafeAreaView>
    );
}
