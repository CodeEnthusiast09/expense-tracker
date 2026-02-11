import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionValidationSchema } from "@/validations";
import { InferType } from "yup";
import { useCreateTransactions } from "@/hooks/services";
import { DatePickerModal } from "@/components/date-picker-modal";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";

const DESCRIPTION_SUGGESTIONS = [
  { id: "groceries", label: "Groceries", icon: "fast-food" },
  { id: "shopping", label: "Shopping", icon: "cart" },
  { id: "transport", label: "Transport", icon: "car" },
  { id: "entertainment", label: "Entertainment", icon: "film" },
  { id: "bills", label: "Bills", icon: "receipt" },
  { id: "salary", label: "Salary", icon: "cash" },
  { id: "rent", label: "Rent", icon: "home" },
  { id: "other", label: "Other", icon: "ellipsis-horizontal" },
];

type FormData = InferType<typeof transactionValidationSchema>;

const CreateScreen = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateTransactions();

  const [isExpense, setIsExpense] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(transactionValidationSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      category: "expense",
      transactionDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const selectedDate = watch("transactionDate");
  const description = watch("description");

  const handleTypeToggle = (expense: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpense(expense);
    setValue("category", expense ? "expense" : "income");
  };

  const handleDescriptionChip = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue("description", suggestion);
  };

  const handleDateSelect = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue("transactionDate", format(date, "yyyy-MM-dd"));
  };

  const onSubmit = (data: FormData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    mutate({ data });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          disabled={isPending}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isPending && styles.saveButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Text style={styles.saveButton}>Save</Text>
              <Ionicons name="checkmark" size={18} color={COLORS.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* TYPE SELECTOR */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, isExpense && styles.typeButtonActive]}
              onPress={() => handleTypeToggle(true)}
              disabled={isPending}
            >
              <Ionicons
                name="arrow-down-circle"
                size={22}
                color={isExpense ? COLORS.white : COLORS.expense}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isExpense && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
              onPress={() => handleTypeToggle(false)}
              disabled={isPending}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={!isExpense ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  !isExpense && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* AMOUNT INPUT */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textLight}
                  value={value?.toString() || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  editable={!isPending}
                />
              )}
            />
          </View>
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount.message}</Text>
          )}

          {/* DATE PICKER */}
          <Pressable
            style={styles.inputContainer}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
            }}
            disabled={isPending}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <Text style={styles.dateText}>
              {format(new Date(selectedDate), "MMM dd, yyyy")}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
          </Pressable>
          {errors.transactionDate && (
            <Text style={styles.errorText}>
              {errors.transactionDate.message}
            </Text>
          )}

          {/* DESCRIPTION INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="create-outline"
              size={22}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Description (e.g., Bought groceries)"
                  placeholderTextColor={COLORS.textLight}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                />
              )}
            />
          </View>
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}

          {/* QUICK DESCRIPTION SUGGESTIONS */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="sparkles-outline" size={16} color={COLORS.text} />{" "}
            Quick Select
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          >
            {DESCRIPTION_SUGGESTIONS.map((suggestion) => (
              <Pressable
                key={suggestion.id}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  description === suggestion.label &&
                  styles.suggestionChipActive,
                  pressed && styles.suggestionChipPressed,
                ]}
                onPress={() => handleDescriptionChip(suggestion.label)}
                disabled={isPending}
              >
                <Ionicons
                  name={suggestion.icon as any}
                  size={18}
                  color={
                    description === suggestion.label
                      ? COLORS.white
                      : COLORS.text
                  }
                />
                <Text
                  style={[
                    styles.suggestionChipText,
                    description === suggestion.label &&
                    styles.suggestionChipTextActive,
                  ]}
                >
                  {suggestion.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* INFO TEXT */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.textLight}
            />
            <Text style={styles.infoText}>
              Tap a suggestion to auto-fill or type your own description
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* DATE PICKER MODAL */}
      <DatePickerModal
        visible={showDatePicker}
        date={new Date(selectedDate)}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
      />

      {/* LOADING OVERLAY */}
      {isPending && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Creating transaction...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
