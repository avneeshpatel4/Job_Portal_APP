import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "../../constants/api";

export default function CompanyScreen() {
  const { token, checkAuth, isCheckingAuth, user } = useAuthStore();

  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [updating, setUpdating] = useState(false);

  // fields for update form
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
    };
    init();
  }, []);

  useEffect(() => {
    if (token && user) fetchCompanies();
  }, [token, user]);

  const fetchCompanies = async () => {
    try {
      setFetching(true);
      const res = await fetch(`${API_URL}/company/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCompanies(data.companies || []);
      else Alert.alert("Error", data.message || "Failed to load companies");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to connect to server.");
    } finally {
      setFetching(false);
    }
  };

  const handleRegister = async () => {
    const trimmedName = companyName.trim();
    if (!trimmedName) return Alert.alert("Validation", "Enter a company name");

    try {
      setRegistering(true);
      const res = await fetch(`${API_URL}/company/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyName: trimmedName }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Company registered successfully!");
        setCompanyName("");
        fetchCompanies();
      } else Alert.alert("Error", data.message || "Registration failed");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Network error.");
    } finally {
      setRegistering(false);
    }
  };

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setLogo(result.assets[0]);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return Alert.alert("Validation", "Name is required");
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("description", editDescription);
      formData.append("website", editWebsite);
      formData.append("location", editLocation);
      if (logo) {
        const file = {
          uri: logo.uri,
          type: "image/jpeg",
          name: "logo.jpg",
        };
        formData.append("file", file);
      }

      const res = await fetch(`${API_URL}/company/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.message === "Company updated") {
        Alert.alert("✅ Success", "Company updated successfully!");
        setSelectedCompany(null);
        fetchCompanies();
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while updating");
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = (company) => {
    setSelectedCompany(company._id);
    setEditName(company.name);
    setEditDescription(company.description || "");
    setEditWebsite(company.website || "");
    setEditLocation(company.location || "");
    setLogo(null);
  };

  if (isCheckingAuth) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-2 text-gray-600">Checking authentication...</Text>
      </View>
    );
  }

  return (
      <KeyboardAvoidingView
               style={{ flex: 1 }}
               behavior={Platform.OS === "ios" ? "padding" : "height"}
             >

    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Register Company
      </Text>

      {/* Register new company */}
      <View className="bg-gray-100 rounded-2xl p-4 mb-6">
        <TextInput
          className="bg-white border border-gray-300 rounded-xl p-3 text-gray-800"
          placeholder="Enter company name"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <TouchableOpacity
          onPress={handleRegister}
          className={`mt-4 py-3 rounded-xl ${
            registering ? "bg-blue-400" : "bg-blue-600"
          }`}
          disabled={registering}
        >
          {registering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold">
              Register
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-semibold text-gray-800 mb-3">
        Your Companies
      </Text>

      {/* Company list */}
      {fetching ? (
        <View className="flex items-center mt-6">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-600 mt-2">Loading companies...</Text>
        </View>
      ) : companies.length === 0 ? (
        <Text className="text-gray-500 text-center mt-4">
          No companies registered yet.
        </Text>
      ) : (
        companies.map((company) => (
          <View
            key={company._id}
            className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-3"
          >
            <TouchableOpacity onPress={() => startEditing(company)}>
              <Text className="text-lg font-semibold text-blue-800">
                {company.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                ID: {company._id.substring(0, 8)}...
              </Text>
            </TouchableOpacity>

            {/* Inline edit form */}
            {selectedCompany === company._id && (
              <View className="mt-4 bg-white p-3 rounded-xl">
                <Text className="font-semibold text-gray-700 mb-2">
                  Update Company
                </Text>

                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Name"
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                />
                <TextInput
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Description"
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                />
                <TextInput
                  value={editWebsite}
                  onChangeText={setEditWebsite}
                  placeholder="Website"
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                />
                <TextInput
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="Location"
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                />

                {logo ? (
                  <Image
                    source={{ uri: logo.uri }}
                    className="w-24 h-24 rounded-lg mb-3"
                  />
                ) : company.logo ? (
                  <Image
                    source={{ uri: company.logo }}
                    className="w-24 h-24 rounded-lg mb-3"
                  />
                ) : null}

                <TouchableOpacity
                  onPress={pickLogo}
                  className="bg-gray-200 py-2 rounded-lg mb-2"
                >
                  <Text className="text-center text-gray-800">
                    {logo ? "Change Logo" : "Upload Logo"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => handleUpdate(company._id)}
                    disabled={updating}
                    className={`flex-1 py-2 rounded-lg ${
                      updating ? "bg-blue-400" : "bg-blue-600"
                    }`}
                  >
                    {updating ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center text-white font-semibold">
                        Update
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedCompany(null)}
                    className="flex-1 py-2 bg-gray-300 rounded-lg"
                  >
                    <Text className="text-center text-gray-800 font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
