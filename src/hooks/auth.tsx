import * as AuthSession from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { makeRedirectUri } from "expo-auth-session";

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User | null;
  signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);



function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const config = {
    clientId: "652447546002-osd3ij64ase5rgr71k3relk61d3gnu1q.apps.googleusercontent.com", // Web
    androidClientId: "652447546002-c4qd1t7oe9hf17kpu53h7tiq5ippvr98.apps.googleusercontent.com", // Android
    iosClientId: "652447546002-6t689qlgknkr6m8vgurp9826b0nq09fs.apps.googleusercontent.com", // iOS (se precisar)
    expoClientId: "652447546002-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com", // Expo (se precisar)
  };

  const redirectUri = makeRedirectUri({
    useProxy: true, // Garante que funcione corretamente no Expo Go
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: config.clientId,
      androidClientId: config.androidClientId,
      iosClientId: config.iosClientId,
      expoClientId: config.expoClientId,
      scopes: ["profile", "email"],
      responseType: "token",
      redirectUri,
    }
  );

  async function signInWithGoogle() {
    try {
      const result = await promptAsync();

      if (result.type === "success" && result.authentication?.accessToken) {
        const token = result.authentication.accessToken;

        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
        );
        const userInfo = await userInfoResponse.json();

        setUser({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          photo: userInfo.picture,
        });
      } else {
        Alert.alert("Login cancelado");
      }
    } catch (error) {
      Alert.alert("Erro ao fazer login com Google");
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
