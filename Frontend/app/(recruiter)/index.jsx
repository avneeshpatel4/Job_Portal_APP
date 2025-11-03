import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardScreen() {
  const { token, user } = useAuthStore(); // must contain token
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/job/getadminJobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // must send token
        },
      });

      const data = await response.json();

      if (data.status) {
        setJobs(data.jobs);
      } else {
        alert(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("❌ Error fetching admin jobs:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminJobs();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-blue-700">
        {user?.name ? `${user.name}'s Dashboard` : "Admin Dashboard"}
      </Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 mt-2">Loading your jobs...</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No jobs found yet.</Text>
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg mt-4"
            onPress={fetchAdminJobs}
          >
            <Text className="text-white font-semibold">Reload</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {jobs.map((job) => (
            <View
              key={job._id}
              className="bg-gray-100 p-4 rounded-xl mb-3 border border-gray-200"
            >
              <Text className="text-lg font-semibold text-blue-800">
                {job.title}
              </Text>
              <Text className="text-gray-600 mt-1">{job.location}</Text>
              <Text className="text-gray-700 mt-1">
                💼 {job.company?.name || "No company linked"}
              </Text>
              <Text className="text-gray-700 mt-1">💰 Salary: {job.salary}</Text>
              <Text className="text-gray-700 mt-1">
                Experience: {job.experienceLevel} yrs
              </Text>
              <Text className="text-gray-700 mt-1">
                Job Type: {job.jobType}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
