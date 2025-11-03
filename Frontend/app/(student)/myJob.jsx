import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "../../constants/api";

export default function AppliedJobsScreen() {
  const { token, checkAuth } = useAuthStore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      fetchAppliedJobs();
    };
    init();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/application/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setApplications(data.application || []);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error("Fetch applied jobs error:", err);
      Alert.alert("Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        My Applied Jobs
      </Text>

      {loading ? (
        <View className="items-center mt-10">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-2">
            Loading your applications...
          </Text>
        </View>
      ) : applications.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">
          You havent applied for any jobs yet.
        </Text>
      ) : (
        applications.map((app) => (
          <View
            key={app._id}
            className="bg-gray-100 border border-gray-200 p-5 rounded-2xl mb-4"
          >
            <Text className="text-lg font-semibold text-blue-800">
              {app.job?.title || "Untitled Job"}
            </Text>

            <Text className="text-gray-600 mt-1">
              Company: {app.job?.company?.name || "Unknown"}
            </Text>

            <Text className="text-gray-600 mt-1">
              Location: {app.job?.location || "N/A"}
            </Text>

            <Text
              className={`mt-3 font-semibold ${getStatusColor(app.status)}`}
            >
              Status: {app.status?.toUpperCase() || "PENDING"}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
