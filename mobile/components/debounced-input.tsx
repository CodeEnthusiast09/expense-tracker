import { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { COLORS } from "@/constants/colors";

interface DebouncedInputProps extends Omit<
  TextInputProps,
  "onChange" | "value"
> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  leftIcon?: React.ReactNode;
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  leftIcon,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState<string | number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
      <TextInput
        {...props}
        style={[styles.input, leftIcon ? styles.inputWithIcon : undefined]}
        value={String(value)}
        onChangeText={(text) => setValue(text)}
        placeholderTextColor={COLORS.textLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  leftIconContainer: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
});
