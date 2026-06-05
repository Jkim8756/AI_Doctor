import { StyleSheet, View, Text, Pressable } from "react-native";
import Navbar from '@/components/navbar'
import { Slot } from "expo-router";


export default function Applayout() {
    return (
        <View style={appStyles.appRoot}>
            <Navbar />
            <View style={appStyles.page}>
                <Slot />
            </View>
        </View>
    );

};


export const appStyles = StyleSheet.create({
    appRoot: {
        flex: 1,
        backgroundColor: "#406a94",
    },

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

    primaryButton: {
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 6,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    page: {
        flex: 1,
        padding: 24,
        gap: 20,
    },

    pageHeader: {
        gap: 4,
    },

    eyebrow: {
        color: "#2563EB",
        fontSize: 13,
        fontWeight: "700",
        textTransform: "uppercase",
    },

    title: {
        color: "#0F172A",
        fontSize: 32,
        fontWeight: "800",
    },

    subtitle: {
        color: "#475569",
        fontSize: 16,
        lineHeight: 24,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },

    card: {
        minWidth: 220,
        flexGrow: 1,
        padding: 18,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        gap: 8,
    },

    cardTitle: {
        color: "#0F172A",
        fontSize: 16,
        fontWeight: "700",
    },

    cardText: {
        color: "#64748B",
        fontSize: 14,
        lineHeight: 20,
    },

    panel: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        gap: 12,
    },

    sectionTitle: {
        color: "#0F172A",
        fontSize: 20,
        fontWeight: "800",
    },
});