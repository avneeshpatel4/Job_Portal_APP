import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { API_URL } from "../../constants/api";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, token, logout, setUser } = useAuthStore();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/user/profile/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Profile updated successfully!");
        setUser(data.user); // update Zustand store
        setEditing(false);
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">No user logged in</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-5 text-center">
        My Profile
      </Text>

      {/* Profile Info or Edit Form */}
      <View className="bg-gray-100 rounded-2xl p-5 mb-8 border border-gray-200">
        {editing ? (
          <>
            <Text className="text-gray-700 font-semibold mb-1">Full Name</Text>
            <TextInput
              value={profileData.fullname}
              onChangeText={(text) =>
                setProfileData({ ...profileData, fullname: text })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            <Text className="text-gray-700 font-semibold mb-1">Email</Text>
            <TextInput
              value={profileData.email}
              onChangeText={(text) =>
                setProfileData({ ...profileData, email: text })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            <Text className="text-gray-700 font-semibold mb-1">Phone</Text>
            <TextInput
              value={profileData.phoneNumber}
              onChangeText={(text) =>
                setProfileData({ ...profileData, phoneNumber: text })
              }
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            <Text className="text-gray-700 font-semibold mb-1">Bio</Text>
            <TextInput
              value={profileData.bio}
              onChangeText={(text) =>
                setProfileData({ ...profileData, bio: text })
              }
              multiline
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            <Text className="text-gray-700 font-semibold mb-1">
              Skills (comma-separated)
            </Text>
            <TextInput
              value={profileData.skills}
              onChangeText={(text) =>
                setProfileData({ ...profileData, skills: text })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            <TouchableOpacity
              onPress={handleUpdate}
              className="bg-blue-600 py-3 rounded-xl mt-4"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditing(false)}
              className="mt-3 border border-gray-400 py-3 rounded-xl"
            >
              <Text className="text-gray-600 text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-xl font-semibold text-blue-700 mb-2">
              {user.fullname}
            </Text>
            <Text className="text-gray-700 mb-1">📧 {user.email}</Text>
            <Text className="text-gray-700 mb-1">📞 {user.phoneNumber}</Text>
            <Text className="text-gray-700 mb-1">🎓 Role: {user.role}</Text>

            {user.profile?.bio ? (
              <Text className="text-gray-600 mt-2">📝 {user.profile.bio}</Text>
            ) : null}

            {user.profile?.skills?.length > 0 ? (
              <Text className="text-gray-600 mt-2">
                💡 Skills: {user.profile.skills.join(", ")}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => setEditing(true)}
              className="bg-blue-600 py-3 mt-5 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
