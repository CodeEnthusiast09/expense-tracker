import { useSignIn } from "@clerk/clerk-expo";
import { styles } from "@/assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import type { EmailCodeFactor } from "@clerk/types";
import { Link, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getErrorMessage } from "@/lib/utils";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");

  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");

  const [showEmailCode, setShowEmailCode] = useState(false);

  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    setError("");

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              // console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else if (signInAttempt.status === "needs_second_factor") {
        // Check if email_code is a valid second factor
        // This is required when Client Trust is enabled and the user
        // is signing in from a new device.
        // See https://clerk.com/docs/guides/secure/client-trust
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor =>
            factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
        } else {
          setError(
            "Second factor authentication is required but email verification is not available.",
          );
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError(
          "Sign in failed. Please check your credentials and try again.",
        );
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      // Show user-friendly error message
      setError(getErrorMessage(err));
    }
  }, [isLoaded, signIn, setActive, router, emailAddress, password]);

  // Handle the submission of the email verification code
  const onVerifyPress = useCallback(async () => {
    if (!isLoaded) return;

    setError("");

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              // console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      // Show user-friendly error message
      setError(getErrorMessage(err));
    }
  }, [isLoaded, signIn, setActive, router, code]);

  // Display email code verification form
  if (showEmailCode) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.verificationText}>
          A verification code has been sent to your email.
        </Text>

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#9a8478"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !code && styles.buttonDisabled,
            pressed && code && styles.buttonPressed,
          ]}
          onPress={onVerifyPress}
          disabled={!code}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i3.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9a8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9a8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!emailAddress || !password) && styles.buttonDisabled,
            pressed && emailAddress && password && styles.buttonPressed,
          ]}
          onPress={onSignInPress}
          disabled={!emailAddress || !password}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>

          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
