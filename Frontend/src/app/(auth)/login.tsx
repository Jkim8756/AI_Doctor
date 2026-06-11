import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signinForm, setsigninForm] = useState(true);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideProgress = useRef(new Animated.Value(0)).current;
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    Animated.timing(slideProgress, {
      toValue: signinForm ? 0 : 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [signinForm, slideProgress]);

  async function handleLogin() {
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showError("Please fill out email field");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      showError("Please check email format");
      return;
    }

    if (!password) {
      showError("Please fill out password field");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        showError(error.message);
        return;
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  }
  function showError(message: string) {
    setError(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    errorTimer.current = setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const formTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -slideWidth],
  });

  const formPanelTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, slideWidth],
  });

  const artworkTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -slideWidth],
  });

  const signinOpacity = slideProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.45, 0],
  });

  const signupOpacity = slideProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.45, 1],
  });

  return (
    <View style={style.container}>
      <View style={style.logonContainer}>
        <Animated.View
          style={[style.formWindow, { transform: [{ translateX: formPanelTranslateX }] }]}
          onLayout={(event) => setSlideWidth(event.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[
              style.formTrack,
              {
                width: slideWidth ? slideWidth * 2 : "200%",
                transform: [{ translateX: formTranslateX }],
              },
            ]}
          >
            <Animated.View style={[style.formPanel, { width: slideWidth || "50%", opacity: signinOpacity }]}>
            <Text style={style.brandText}>AI Doctor</Text>
            <Text style={style.title}>Welcome back</Text>
            <Text style={style.subtitle}>Sign in to continue your health conversation.</Text>

            <TextInput style={style.input} placeholder="Email" placeholderTextColor="#8a95a6" value={email} onChangeText={setEmail} />
            <TextInput style={style.input} placeholder="Password" placeholderTextColor="#8a95a6" secureTextEntry value={password} onChangeText={setPassword} />

            <Pressable style={[style.button, isLoading && style.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
              <Text style={style.buttonText}>{isLoading ? "Signing in..." : "Sign in"}</Text>
            </Pressable>

            <View style={style.errorSlot}>
              <Text style={[style.errorText, !errormsg && style.hiddenText]}>{errormsg || " "}</Text>
            </View>

            <Pressable onPress={() => setsigninForm(!signinForm)}>
              <Text style={style.switchText}>Don't have an account? Sign up</Text>
            </Pressable>
            </Animated.View>

            <Animated.View style={[style.formPanel, { width: slideWidth || "50%", opacity: signupOpacity }]}>
            <Text style={style.brandText}>AI Doctor</Text>
            <Text style={style.title}>Create account</Text>
            <Text style={style.subtitle}>Start a new space for symptoms, notes, and AI guidance.</Text>

            <TextInput style={style.input} placeholder="Email" placeholderTextColor="#8a95a6" value={email} onChangeText={setEmail} />
            <TextInput style={style.input} placeholder="Password" placeholderTextColor="#8a95a6" secureTextEntry value={password} onChangeText={setPassword} />

            <Pressable style={[style.button, isLoading && style.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
              <Text style={style.buttonText}>{isLoading ? "Signing up..." : "Sign up"}</Text>
            </Pressable>

            <View style={style.errorSlot}>
              <Text style={[style.errorText, !errormsg && style.hiddenText]}>{errormsg || " "}</Text>
            </View>

            <Pressable onPress={() => setsigninForm(!signinForm)}>
            <Text style={style.switchText}>Already have an account? Sign in</Text>
            </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[style.artPanel, { transform: [{ translateX: artworkTranslateX }] }]}>
          <View style={style.shapeLarge} />
          <View style={style.shapeMedium} />
          <View style={style.shapeSmall} />
          <View style={style.shapeLine} />
          <Text style={style.artTitle}>{signinForm ? "Welcome to smarter intake." : "Build your health profile."}</Text>
          <Text style={style.artText}>
            {signinForm
              ? "Track symptoms, explore body areas, and keep conversations organized."
              : "Your account keeps sessions, notes, and AI responses in one place."}
          </Text>
        </Animated.View>
      </View>
    </View >
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#eaf2ff",
  },
  logonContainer: {
    width: "92%",
    maxWidth: 920,
    minHeight: 520,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "#d7e2ea",
    overflow: "hidden",
    shadowColor: "#0b1f2a",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: Platform.OS === "web" ? 0.10 : 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  formWindow: {
    width: "50%",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    zIndex: 2,
  },
  formTrack: {
    flex: 1,
    flexDirection: "row",
  },
  formPanel: {
    minHeight: 520,
    paddingHorizontal: 42,
    paddingVertical: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  brandText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  title: {
    color: "#102a43",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 0,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 300,
    color: "#66788a",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#cbd8e1",
    backgroundColor: "#f8fbfc",
    borderRadius: 8,
    color: "#102a43",
    fontSize: 15,
  },
  button: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  errorSlot: {
    minHeight: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#c2410c",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },

  hiddenText: {
    opacity: 0,
  },
  switchText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "800",
  },
  artPanel: {
    width: "50%",
    minHeight: 520,
    paddingHorizontal: 42,
    paddingVertical: 40,
    backgroundColor: "#1e3a8a",
    justifyContent: "flex-end",
    overflow: "hidden",
    zIndex: 1,
  },
  shapeLarge: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 8,
    backgroundColor: "#60a5fa",
    opacity: 0.88,
    top: -70,
    right: -60,
    transform: [{ rotate: "28deg" }],
  },
  shapeMedium: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 8,
    backgroundColor: "#bfdbfe",
    opacity: 0.9,
    top: 120,
    left: 54,
    transform: [{ rotate: "-18deg" }],
  },
  shapeSmall: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    opacity: 0.82,
    right: 86,
    bottom: 168,
    transform: [{ rotate: "45deg" }],
  },
  shapeLine: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.38)",
    left: -52,
    bottom: -24,
    transform: [{ rotate: "18deg" }],
  },
  artTitle: {
    color: "#ffffff",
    maxWidth: 340,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 12,
  },
  artText: {
    maxWidth: 340,
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
});




export default Login;
