import "../../global.css";

import { StatusBar, View, Text } from "react-native";
import { Stack } from "expo-router";
import LogoTest from "../components/logo/LogoTest";
import { AuthProvider } from "../contexts/authContext";

export default function Layout() {
  return (
    <AuthProvider>
    <>
      <StatusBar translucent backgroundColor="transparent" />
      {/* Test-only: small logo + app name in top-left */}
      {/* <View className="absolute top-10 left-0 right-0 z-50 mt-20 flex-row justify-center items-center">
        <LogoTest size={29} />
          <Text className="text-white ml-2 font-bold text-2xl">FlowPay</Text>
      </View> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
      </Stack>
    </>
    </AuthProvider>
  );
}
