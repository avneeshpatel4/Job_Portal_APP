import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function StudentHomeScreen() {
  const { token, checkAuth } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      fetchJobs();
      fetchAppliedJobs();
    };
    init();
  }, []);

  const fetchJobs = async (keyword = "") => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/job/get?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.status) {
        setJobs(data.jobs);
      } else {
        Alert.alert("Error", data.message || "Failed to load jobs");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/application/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        const appliedIds = data.application.map((app) => app.job?._id);
        setAppliedJobs(appliedIds);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/application/apply/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Applied successfully!");
        setAppliedJobs((prev) => [...prev, jobId]);
      } else {
        Alert.alert("Error", data.message || "Failed to apply");
      }
    } catch (err) {
      console.error("Apply error:", err);
      Alert.alert("Error", "Unable to connect to server.");
    }
  };

  const handleSearch = () => {
    fetchJobs(searchTerm.trim());
  };

  const isApplied = (jobId) => appliedJobs.includes(jobId);

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-3">Find Jobs</Text>

      {/* 🔍 Search Bar */}
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 mr-2"
          placeholder="Search by company name..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      {/* 🧾 Job List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-500 mt-2">Loading jobs...</Text>
          </View>
        ) : jobs.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No jobs available
          </Text>
        ) : (
          jobs.map((job) => (
            <View
              key={job._id}
              className="bg-gray-100 border border-gray-200 p-5 rounded-2xl mb-4"
            >
              <Text className="text-lg font-semibold text-blue-800">
                {job.title}
              </Text>
              <Text className="text-gray-600 mt-1">
                Company: {job.company?.name || "Unknown"}
              </Text>
              <Text className="text-gray-600 mt-1">
                Location: {job.location || "N/A"}
              </Text>
              <Text className="text-gray-600 mt-1">
                Salary: ₹{job.salary || "N/A"}
              </Text>

              <TouchableOpacity
                disabled={isApplied(job._id)}
                onPress={() => handleApply(job._id)}
                className={`mt-3 py-2 rounded-xl ${
                  isApplied(job._id)
                    ? "bg-gray-400"
                    : "bg-blue-600 active:bg-blue-700"
                }`}
              >
                <Text className="text-white text-center font-semibold">
                  {isApplied(job._id) ? "Applied" : "Apply Now"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
