import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { DebouncedInput } from "./debounced-input";

interface SearchBoxProps {
  value?: string | number;
  placeholder?: string;
  onChange: (value: string | number) => void;
  debounce?: number;
}

export const SearchBox = ({
  value,
  placeholder = "Search transactions...",
  onChange,
  debounce = 500,
}: SearchBoxProps) => {
  return (
    <View style={styles.container}>
      <DebouncedInput
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        debounce={debounce}
        leftIcon={<Ionicons name="search" size={20} color={COLORS.textLight} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
