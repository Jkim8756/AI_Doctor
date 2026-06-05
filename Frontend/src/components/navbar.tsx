import { StyleSheet, View, Text, Pressable } from "react-native";
import React from 'react'
import { handleSignOut } from "@/context/authContext";

const Navbar = () => {
  return (
    <View style={navbarStyles.navbar}>
      <Text style={navbarStyles.brand}>AI Doctor</Text>

      <View style={navbarStyles.navGroup}>
        <Pressable style={[navbarStyles.navButton, navbarStyles.navButtonActive]}>
          <Text style={[navbarStyles.navText, navbarStyles.navTextActive]}>Home</Text>
        </Pressable>

        <Pressable style={navbarStyles.navButton}>
          <Text style={navbarStyles.navText}>Profile</Text>
        </Pressable>

        <Pressable style={navbarStyles.signOutButton} onPress={handleSignOut}>
          <Text style={navbarStyles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const navbarStyles = StyleSheet.create({
  navbar: {
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  brand: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
  },

  navGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  navButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  navButtonActive: {
    backgroundColor: "#1E293B",
  },

  navText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
  },

  navTextActive: {
    color: "#FFFFFF",
  },

  signOutButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  signOutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Navbar