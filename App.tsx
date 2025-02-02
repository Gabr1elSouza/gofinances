import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { Register } from "./src/screens/Register";
import { Dashboard } from "./src/screens/Dashboard";
import { CategorySelect } from "./src/screens/CategorySelect";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import { ThemeProvider } from "styled-components/native";
import theme from "./src/global/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (!fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ThemeProvider theme={theme}>
      <CategorySelect />
    </ThemeProvider>
  );
}
