import { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signinForm, setsigninForm] = useState(true);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <View style={style.container}>
      <View style={style.logonContainer}>
        {signinForm === true ? (
          <>
            <Text>Login</Text>

            <TextInput style={style.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={style.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

            <Pressable style={[style.button, isLoading && style.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
              <Text>{isLoading ? "Signing in..." : "Sign in"}</Text>
            </Pressable>

            <View style={style.errorSlot}>
              <Text style={[style.errorText, !errormsg && style.hiddenText]}>{errormsg || " "}</Text>
            </View>

            <Pressable onPress={() => setsigninForm(!signinForm)}>
              <Text style={{ color: "blue" }}>Don't have an account? Sign up</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text>Sign Up</Text>

            <TextInput style={style.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={style.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

            <Pressable style={[style.button, isLoading && style.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
              <Text>{isLoading ? "Signing up..." : "Sign up"}</Text>
            </Pressable>

            <View style={style.errorSlot}>
              <Text style={[style.errorText, !errormsg && style.hiddenText]}>{errormsg || " "}</Text>
            </View>

            <Pressable onPress={() => setsigninForm(!signinForm)}>
              <Text style={{ color: "blue" }}>Already have an account? Sign in</Text>
            </Pressable>
          </>
        )}
      </View>
    </View >
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#6ca0d1",
  },
  logonContainer: {
    width: "90%",
    maxWidth: 400,
    minHeight: 400,
    padding: 20,
    backgroundColor: Platform.OS === "web" ? "#2b944a" : "#80aa1e",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorSlot: {
    minHeight: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "red",
    textAlign: "center",
  },

  hiddenText: {
    opacity: 0,
  },
});




export default Login;
