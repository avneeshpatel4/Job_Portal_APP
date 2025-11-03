import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";

export default function TabLayout() {
  const router = useRouter();
  const { user, token, isCheckingAuth } = useAuthStore();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!user || !token) {
        router.replace("/(auth)/login");
      } else if (user?.role) {
        setRole(user.role);
      }
    }
  }, [user, token, isCheckingAuth]);

  useEffect(() => {
    if (role === "Student") {
      router.replace("/(student)");
    } else if (role === "Recruiter") {
      router.replace("/(recruiter)");
    }
  }, [role]);

  if (isCheckingAuth || !role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show a loading indicator until navigation happens
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
