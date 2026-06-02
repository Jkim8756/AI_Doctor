import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
// import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/authContext';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { supabase } from '@/lib/supabase';
import Login from './(auth)/login';
import Home from './(app)/home';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [session, isCheckingSession] = useAuth();

  if (isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Redirect href="/(app)/home" />;

  // return (
  //   <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  //     <AnimatedSplashOverlay />
  //     <AuthProvider>
  //       {isCheckingSession ? (
  //         <View style={styles.loadingContainer}>
  //           <ActivityIndicator />
  //         </View>
  //       ) : session ? (
  //         // <AppTabs />
  //         <Home />
  //       ) : (
  //         <Login />
  //       )}
  //     </AuthProvider>
  //   </ThemeProvider>
  // );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
