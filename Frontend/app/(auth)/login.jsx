import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const { login, isLoading, isCheckingAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !role) {
      return Alert.alert("Error", "All fields are required");
    }

    const result = await login(email, password, role);
    if (result.success) {
      Alert.alert("Success", result.message);
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };
  if (isCheckingAuth) return null;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center bg-white px-6">
        <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
          💼CareerNest💼
        </Text>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2">
            <Ionicons name="mail-outline" size={20} color="#2563eb" />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-semibold">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2">
            <Ionicons name="lock-closed-outline" size={20} color="#2563eb" />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#2563eb"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-semibold">Role</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-3 py-2"
            placeholder="Enter 'Student' or 'Recruiter'"
            value={role}
            onChangeText={setRole}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="bg-blue-600 py-3 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text> Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-blue-600 font-semibold">Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
