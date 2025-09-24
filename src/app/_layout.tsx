import "../../global.css";

import { StatusBar } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/authContext";

export default function Layout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <StatusBar translucent backgroundColor="transparent" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/sign-in" />
            <Stack.Screen name="(auth)/sign-up" />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
