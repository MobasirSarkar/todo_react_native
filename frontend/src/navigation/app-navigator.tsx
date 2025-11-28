import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAppSelector } from "../store";
import AuthNavigator from "./auth-navigator";
import TaskListScreen from "../screens/TaskListScreen";
import TaskFormScreen from "../screens/TaskForm";

export type RootStackParamsList = {
    Auth: undefined;
    Tasks: undefined;
    TaskForm: { taskId?: string } | undefined;
}

const Stack = createNativeStackNavigator<RootStackParamsList>();

const AppNavigator = () => {
    const { user } = useAppSelector((state) => state.auth)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {!user ? (
                <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="Tasks" component={TaskListScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ headerShown: false }} />
                </>
            )}

        </Stack.Navigator>
    )

}

export default AppNavigator;

