import { TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";

type Props = {
  onPress?: () => void;
  label?: string;
  showLink?: boolean;
};

export function ButtonSignUp({ onPress, label = "Cadastrar", showLink = true }: Props) {
  return (
    <View className="w-11/12 max-w-md mx-auto mt-6">
      <TouchableOpacity onPress={onPress} className="bg-blue-500 rounded-2xl px-4 py-2">
        <Text className="text-white text-center">{label}</Text>
      </TouchableOpacity>

      {showLink ? (
        <View className="mt-4 flex-row justify-center items-center">
          <Text className="text-sm text-white/80">Já tem conta?</Text>
          <TouchableOpacity
            onPress={() => {
              router.push('/(auth)/sign-in');
            }}
            accessibilityLabel="Entrar"
            className="ml-2"
          >
            <Text className="text-sm text-white font-semibold">Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}