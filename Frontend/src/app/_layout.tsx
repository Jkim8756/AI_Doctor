import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/authContext';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Slot />
          <AuthGate />
        </ThemeProvider>
      </AuthProvider>
    </>
  );

};


function AuthGate() {
  const { session, isCheckingSession } = useAuth();
  if (isCheckingSession) { // check if not logged in.
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (!session) {
    return <Redirect href="/login" />;
    // return <Login />;
  }
  return <Redirect href="/home" />;
  // return <AppTabs />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf2ff',
  },
});
