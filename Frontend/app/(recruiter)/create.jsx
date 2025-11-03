import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "../../constants/api";

export default function CreateJob() {
  const { token, user } = useAuthStore();
  console.log("Logged in user:", user); // should show companyId = user._id

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    position: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Trim and validate
    for (const key in form) {
      if (!form[key]?.trim()) {
        Alert.alert("Missing Field", `Please fill ${key}`);
        return;
      }
    }

    if (isNaN(Number(form.salary))) {
      Alert.alert("Invalid Input", "Salary must be a number.");
      return;
    }

    // ✅ Use recruiter id as companyId
    const companyId = user?.companyId;
    if (!companyId) {
      Alert.alert(
        "Error",
        "You must be logged in as a recruiter to post a job."
      );
      return;
    }

    try {
      setLoading(true);

      const cleanedRequirements = form.requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r);

      const requestBody = {
        ...form,
        salary: Number(form.salary),
        companyId,
        requirements: cleanedRequirements,
      };

      console.log("Posting job:", requestBody);

      const response = await fetch(`${API_URL}/job/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        Alert.alert("Success", "Job posted successfully!");
        setForm({
          title: "",
          description: "",
          requirements: "",
          salary: "",
          location: "",
          jobType: "",
          position: "",
          experience: "",
        });
      } else {
        Alert.alert("Error", data.message || "Failed to post job");
      }
    } catch (err) {
      console.log("Error posting job:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-5">
          Post a New Job
        </Text>

        {[
          ["title", "Job Title"],
          ["description", "Description"],
          ["requirements", "Requirements (comma separated)"],
          ["salary", "Salary (in ₹)"],
          ["location", "Location"],
          ["jobType", "Job Type (Full-time / Part-time / Internship)"],
          ["position", "Position"],
          ["experience", "Experience Level"],
        ].map(([key, label]) => (
          <View key={key} className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">{label}</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-gray-800"
              value={form[key]}
              onChangeText={(text) => handleChange(key, text)}
              placeholder={label}
              keyboardType={
                key === "salary" || key === "position" || key === "experience"
                  ? "numeric"
                  : "default"
              }
              multiline={key === "description"}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`mt-4 p-4 rounded-xl ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Post Job
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
