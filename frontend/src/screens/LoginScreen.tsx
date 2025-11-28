import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/auth-navigator";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser } from "../store/auth-slice";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">


const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((s) => s.auth)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const onLogin = () => {
        dispatch(loginUser({ email, password }))
    };


    useEffect(() => {
        if (error) {
            Toast.show({
                type: "error",
                text1: "Registration failed",
                text2: error
            })
        }
    }, [error])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Welcome Back
            </Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, { color: "#000000" }]}
                placeholderTextColor="#888"
                placeholder="Enter your email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={[styles.input, { color: "#000" }]}
                placeholderTextColor="#888"
                placeholder="Enter your password"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Pressable
                onPress={onLogin}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.buttonText}>
                    {status === "loading" ? "Logging in..." : "Login"}
                </Text>
            </Pressable>
            <Text style={styles.link}>
                No account?{" "}
                <Text
                    style={{
                        textDecorationLine: "underline",
                        fontWeight: "700",
                        color: "#000", // optional: color for the link
                    }}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
    input: {
        borderWidth: 1,
        borderRadius: 2,
        padding: 12,
        marginBottom: 12,
    },
    error: { color: "red", marginBottom: 8 },
    link: { marginTop: 16, textAlign: "center" },
    label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
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
})

export default LoginScreen;
