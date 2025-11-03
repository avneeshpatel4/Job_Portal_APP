import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "../../constants/api";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, token, checkAuth, logout } = useAuthStore();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      fetchCompanies();
    };
    init();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/company/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCompanies(data.companies || []);
      } else {
        Alert.alert("Error", data.message || "Failed to load companies");
      }
    } catch (err) {
      console.log("Error fetching companies:", err);
      Alert.alert("Error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* Header Section */}{" "}
      <View className="bg-blue-600 rounded-2xl p-5 mb-5">
        {" "}
        <Text className="text-2xl font-bold text-white">
          {user?.fullname || "User"}{" "}
        </Text>{" "}
        <Text className="text-white opacity-90 mt-1">{user?.email}</Text>
        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white mt-4 py-2 rounded-xl"
        >
          <Text className="text-center text-blue-600 font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-3">
        Your Companies
      </Text>
      {loading ? (
        <View className="flex items-center mt-10">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-2 text-gray-500">Loading companies...</Text>
        </View>
      ) : companies.length === 0 ? (
        <Text className="text-gray-500 text-center mt-5">
          You havent registered any companies yet.
        </Text>
      ) : (
        companies.map((company) => (
          <TouchableOpacity
            key={company._id}
            className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-3"
            onPress={() =>
              navigation.navigate("UpdateCompany", { companyId: company._id })
            }
          >
            <Text className="text-lg font-semibold text-blue-800">
              {company.name}
            </Text>
            {company.location ? (
              <Text className="text-gray-600">{company.location}</Text>
            ) : (
              <Text className="text-gray-500 italic">No location provided</Text>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
