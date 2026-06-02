import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import type { Session } from '@supabase/supabase-js';
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
      <ActivityIndicator size="large" color="#0000ff" />
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
  },
});
