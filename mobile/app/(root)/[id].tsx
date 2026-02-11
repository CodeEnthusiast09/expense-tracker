import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useTransaction, useUpdateTransactions } from "@/hooks/services";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionValidationSchema } from "@/validations";
import { InferType } from "yup";
import { format } from "date-fns";
import { DatePickerModal } from "@/components/date-picker-modal";
import * as Haptics from "expo-haptics";
import { addCommaToNumber } from "@/lib/utils";
import { styles } from "@/assets/styles/edit.styles";

type FormData = InferType<typeof transactionValidationSchema>;

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

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animated value for smooth transitions
  const editModeAnim = useRef(new Animated.Value(0)).current;

  const { data: transaction, isPending, isError } = useTransaction(id);
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransactions();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(transactionValidationSchema),
  });

  const description = watch("description");
  const selectedDate = watch("transactionDate");

  // Populate form when transaction loads
  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        transactionDate: transaction.transactionDate,
      });
    }
  }, [transaction, reset]);

  // Animate edit mode transition
  useEffect(() => {
    Animated.spring(editModeAnim, {
      toValue: isEditMode ? 1 : 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isEditMode, editModeAnim]);

  const toggleEditMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isEditMode) {
      // Cancel edit - reset form
      if (transaction) {
        reset({
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category,
          transactionDate: transaction.transactionDate,
        });
      }
    }
    setIsEditMode(!isEditMode);
  };

  const onSubmit = (data: FormData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateTransaction({ id, data });
  };

  const handleDescriptionChip = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue("description", suggestion);
  };

  const handleDateSelect = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue("transactionDate", format(date, "yyyy-MM-dd"));
  };

  if (isPending) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <SkeletonWrapper isLoading count={5} height={60} />
        </View>
      </View>
    );
  }

  if (isError || !transaction) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.expense} />
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </View>
    );
  }

  const isIncome = transaction.category === "income";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isUpdating}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Edit Transaction" : "Transaction Details"}
        </Text>
        <TouchableOpacity
          onPress={isEditMode ? handleSubmit(onSubmit) : toggleEditMode}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons
              name={isEditMode ? "checkmark" : "create-outline"}
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AMOUNT CARD */}
        <View
          style={[
            styles.amountCard,
            isIncome ? styles.incomeCard : styles.expenseCard,
          ]}
        >
          <Ionicons
            name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
            size={48}
            color={COLORS.white}
          />
          <View style={styles.amountCardContent}>
            <Text style={styles.amountLabel}>
              {isIncome ? "Income" : "Expense"}
            </Text>
            {isEditMode ? (
              <View style={styles.amountEditContainer}>
                <Text style={styles.amountEditSymbol}>₦</Text>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.amountEditInput}
                      value={value?.toString() || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      editable={!isUpdating}
                      placeholder="0.00"
                      placeholderTextColor={COLORS.white + "80"}
                    />
                  )}
                />
              </View>
            ) : (
              <Text style={styles.amountText}>
                ₦{addCommaToNumber(transaction.amount.toFixed(2), true)}
              </Text>
            )}
          </View>
        </View>

        {errors.amount && (
          <Text style={styles.errorFieldText}>{errors.amount.message}</Text>
        )}

        {/* DETAILS CARD */}
        <View style={styles.detailsCard}>
          {/* Category */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="pricetag" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabelText}>Category</Text>
            </View>
            {isEditMode ? (
              <View style={styles.categoryToggle}>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Pressable
                        style={[
                          styles.categoryButton,
                          value === "expense" && styles.categoryButtonActive,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                          onChange("expense");
                        }}
                        disabled={isUpdating}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            value === "expense" &&
                            styles.categoryButtonTextActive,
                          ]}
                        >
                          Expense
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.categoryButton,
                          value === "income" && styles.categoryButtonActive,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                          onChange("income");
                        }}
                        disabled={isUpdating}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            value === "income" &&
                            styles.categoryButtonTextActive,
                          ]}
                        >
                          Income
                        </Text>
                      </Pressable>
                    </>
                  )}
                />
              </View>
            ) : (
              <Text style={styles.detailValue}>
                {transaction.category.charAt(0).toUpperCase() +
                  transaction.category.slice(1)}
              </Text>
            )}
          </View>

          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="calendar" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabelText}>Date</Text>
            </View>
            {isEditMode ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDatePicker(true);
                }}
                disabled={isUpdating}
              >
                <Text style={styles.detailValueEdit}>
                  {format(new Date(selectedDate), "MMM dd, yyyy")}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.detailValue}>
                {format(new Date(transaction.transactionDate), "MMM dd, yyyy")}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={[styles.detailRow, styles.detailRowColumn]}>
            <View style={styles.detailLabel}>
              <Ionicons
                name="document-text"
                size={20}
                color={COLORS.textLight}
              />
              <Text style={styles.detailLabelText}>Description</Text>
            </View>
            {isEditMode ? (
              <View style={styles.descriptionEditContainer}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.descriptionInput}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter description"
                      placeholderTextColor={COLORS.textLight}
                      multiline
                      editable={!isUpdating}
                    />
                  )}
                />
                {errors.description && (
                  <Text style={styles.errorFieldText}>
                    {errors.description.message}
                  </Text>
                )}

                {/* Quick Select Chips */}
                <Text style={styles.quickSelectLabel}>Quick Select:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsContainer}
                >
                  {DESCRIPTION_SUGGESTIONS.map((suggestion) => (
                    <Pressable
                      key={suggestion.id}
                      style={[
                        styles.chip,
                        description === suggestion.label && styles.chipActive,
                      ]}
                      onPress={() => handleDescriptionChip(suggestion.label)}
                      disabled={isUpdating}
                    >
                      <Ionicons
                        name={suggestion.icon as any}
                        size={16}
                        color={
                          description === suggestion.label
                            ? COLORS.white
                            : COLORS.text
                        }
                      />
                      <Text
                        style={[
                          styles.chipText,
                          description === suggestion.label &&
                          styles.chipTextActive,
                        ]}
                      >
                        {suggestion.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text style={styles.detailValueDescription}>
                {transaction.description}
              </Text>
            )}
          </View>
        </View>

        {/* CANCEL BUTTON (only in edit mode) */}
        {isEditMode && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
            onPress={toggleEditMode}
            disabled={isUpdating}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* DATE PICKER MODAL */}
      <DatePickerModal
        visible={showDatePicker}
        date={new Date(selectedDate)}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
      />

      {/* LOADING OVERLAY */}
      {isUpdating && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Updating transaction...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
