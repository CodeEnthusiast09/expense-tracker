import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={modernStyles.container}>
      <View style={modernStyles.iconContainer}>
        <Ionicons name="checkmark-circle" size={24} color={COLORS.income} />
      </View>
      <View style={modernStyles.textContainer}>
        <Text style={modernStyles.title}>{text1}</Text>
        {text2 && <Text style={modernStyles.subtitle}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View style={modernStyles.container}>
      <View style={modernStyles.iconContainer}>
        <Ionicons name="close-circle" size={24} color={COLORS.expense} />
      </View>
      <View style={modernStyles.textContainer}>
        <Text style={modernStyles.title}>{text1}</Text>
        {text2 && <Text style={modernStyles.subtitle}>{text2}</Text>}
      </View>
    </View>
  ),

  delete: ({ text1 }: BaseToastProps) => (
    <View style={modernStyles.container}>
      <View style={modernStyles.iconContainer}>
        <Ionicons name="trash" size={24} color={COLORS.expense} />
      </View>
      <View style={modernStyles.textContainer}>
        <Text style={modernStyles.title}>{text1}</Text>
      </View>
      <TouchableOpacity style={modernStyles.undoButton}>
        <Text style={modernStyles.undoText}>Undo</Text>
      </TouchableOpacity>
    </View>
  ),
};

const modernStyles = StyleSheet.create({
  container: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  undoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary + "15",
    borderRadius: 8,
  },
  undoText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ToastConfig;
