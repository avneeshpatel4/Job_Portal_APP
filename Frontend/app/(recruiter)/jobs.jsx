import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function RecruiterDashboard() {
  const { token, user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // fetch jobs created by recruiter
  const fetchAdminJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/job/getadminJobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status) {
        setJobs(data.jobs);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Fetch Jobs Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  // fetch applicants for a job
  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/application/${jobId}/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // merge applicants into the job object
        setJobs((prev) =>
          prev.map((j) =>
            j._id === jobId ? { ...j, applicants: data.job.applications } : j
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Fetch Applicants Error:", error);
    }
  };

  // update applicant status
  const updateStatus = async (applicationId, newStatus, jobId) => {
    try {
      const res = await fetch(
        `${API_URL}/application/status/${applicationId}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Status updated ✅");
        fetchApplicants(jobId); // refresh applicants
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Update Status Error:", error);
      alert("Something went wrong updating status");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminJobs();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-blue-700 mb-4">
        {user?.name ? `${user.name}'s Recruiter Dashboard` : "Recruiter Dashboard"}
      </Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 mt-2">Loading your jobs...</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {jobs.map((job) => (
            <View
              key={job._id}
              className="bg-gray-100 p-4 rounded-xl mb-3 border border-gray-200"
            >
              <TouchableOpacity
                onPress={() => {
                  if (expandedJobId === job._id) {
                    setExpandedJobId(null);
                  } else {
                    setExpandedJobId(job._id);
                    fetchApplicants(job._id);
                  }
                }}
              >
                <Text className="text-lg font-semibold text-blue-800">
                  {job.title}
                </Text>
                <Text className="text-gray-600 mt-1">{job.location}</Text>
                <Text className="text-gray-700 mt-1">
                  💰 {job.salary} | {job.jobType}
                </Text>
              </TouchableOpacity>

              {expandedJobId === job._id && (
                <View className="mt-3 bg-white p-3 rounded-lg">
                  <Text className="font-semibold text-gray-800 mb-2">
                    Applicants:
                  </Text>
                  {!job.applicants ? (
                    <ActivityIndicator size="small" color="#2563eb" />
                  ) : job.applicants.length === 0 ? (
                    <Text className="text-gray-500">No applicants yet.</Text>
                  ) : (
                    job.applicants.map((app) => (
                      <View
                        key={app._id}
                        className="border-t border-gray-200 py-2"
                      >
                        <Text className="font-semibold text-gray-700">
                          👤 {app.applicant?.name || "Unknown"}
                        </Text>
                        <Text className="text-gray-600">
                          Status:{" "}
                          <Text className="font-semibold capitalize">
                            {app.status}
                          </Text>
                        </Text>

                        <View className="flex-row mt-2 space-x-2">
                          {["accepted", "rejected", "pending"].map((status) => (
                            <TouchableOpacity
                              key={status}
                              onPress={() =>
                                updateStatus(app._id, status, job._id)
                              }
                              className={`px-3 py-1 rounded-lg ${
                                app.status === status
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <Text
                                className={`${
                                  app.status === status
                                    ? "text-white"
                                    : "text-gray-800"
                                } text-sm font-semibold capitalize`}
                              >
                                {status}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
