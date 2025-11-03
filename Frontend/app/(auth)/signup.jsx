import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function Signup() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return Alert.alert("Error", "All fields are required");
    }

    const result = await register(fullname, email, phoneNumber, password, role);
    if (!result.success) {
      Alert.alert("Signup Failed", result.error);
    } else {
      Alert.alert("Success", result.message);
      router.push("/login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-blue-50 justify-center px-6">
        <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
          💼CareerNest💼
        </Text>
        <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
          Find Job with CareerNest
        </Text>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Full Name</Text>
          <View className="flex-row items-center bg-white px-3 py-2 rounded-xl border border-gray-300">
            <Ionicons name="person-outline" size={20} color="#3b82f6" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Avneesh patel"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Email</Text>
          <View className="flex-row items-center bg-white px-3 py-2 rounded-xl border border-gray-300">
            <Ionicons name="mail-outline" size={20} color="#3b82f6" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Phone Number</Text>
          <View className="flex-row items-center bg-white px-3 py-2 rounded-xl border border-gray-300">
            <Ionicons name="call-outline" size={20} color="#3b82f6" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Password</Text>
          <View className="flex-row items-center bg-white px-3 py-2 rounded-xl border border-gray-300">
            <Ionicons name="lock-closed-outline" size={20} color="#3b82f6" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#3b82f6"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Selection */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`flex-1 mr-2 py-3 rounded-xl border ${
              role === "Student" ? "bg-blue-600" : "bg-white border-gray-300"
            }`}
            onPress={() => setRole("Student")}
          >
            <Text
              className={`text-center font-semibold ${
                role === "Student" ? "text-white" : "text-gray-700"
              }`}
            >
              Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl border ${
              role === "Recruiter" ? "bg-blue-600" : "bg-white border-gray-300"
            }`}
            onPress={() => setRole("Recruiter")}
          >
            <Text
              className={`text-center font-semibold ${
                role === "Recruiter" ? "text-white" : "text-gray-700"
              }`}
            >
              Recruiter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={isLoading}
          className="bg-blue-600 rounded-xl py-3"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <View className="flex-row justify-center mt-4">
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-blue-600 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
