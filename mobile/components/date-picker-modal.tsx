import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export const DatePickerModal = ({
  visible,
  date,
  onClose,
  onSelect,
}: DatePickerModalProps) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (Platform.OS === "ios") {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>

            {/* iOS Date Picker - Fixed */}
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setSelectedDate(date);
                }}
                maximumDate={new Date()}
                textColor={COLORS.text}
                themeVariant="light"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  // Android date picker
  if (visible && Platform.OS === "android") {
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          if (event.type === "set" && date) {
            onSelect(date);
          }
          onClose();
        }}
        maximumDate={new Date()}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area for iOS home indicator
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  pickerContainer: {
    // Explicit height for iOS picker
    height: 216, // Standard iOS picker height
    justifyContent: "center",
    paddingVertical: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonPressed: {
    opacity: 0.8,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
