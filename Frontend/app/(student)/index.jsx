import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function StudentHomeScreen() {
  const { token, checkAuth } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      fetchJobs();
      fetchAppliedJobs();
    };
    init();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/job/get`, {
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
        setAppliedJobs([...appliedJobs, jobId]);
      } else {
        Alert.alert("Error", data.message || "Failed to apply");
      }
    } catch (err) {
      console.error("Apply error:", err);
      Alert.alert("Error", "Unable to connect to server.");
    }
  };

  const isApplied = (jobId) => appliedJobs.includes(jobId);

  return (
    <ScrollView className="flex-1 bg-white p-5">
    
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Available Jobs
      </Text>
      {loading ? (
        <View className="flex items-center mt-10">
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
  );
}
