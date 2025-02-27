import * as SplashScreen from "expo-splash-screen";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React, { useCallback, useEffect } from "react";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components/native";
import theme from "./src/global/styles/theme";

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { AuthProvider } from "./src/hooks/auth";
import { AppRoutes } from "./src/routes/app.routes";

import { tokenCache } from "./src/storage/tokenCache";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Evita renderizar antes das fontes carregarem
  }
  const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env
    .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

  function InitialLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
      if (!isLoaded) return;

      if (isSignedIn) {
        router.replace(AppRoutes);
      } else {
        router.replace;
      }
    }, [isSignedIn]);
  }

  return (
    <ThemeProvider theme={theme}>
      <ClerkProvider
        publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>{<AppRoutes />}</AuthProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ClerkProvider>
    </ThemeProvider>
  );
}
