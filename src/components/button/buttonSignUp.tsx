import { TouchableOpacity, View, Text } from "react-native";

export function ButtonSignUp() {
  return (
    <View className="w-11/12 max-w-md mx-auto mt-6">
      <TouchableOpacity className="bg-blue-500 rounded-2xl px-4 py-2">
        <Text className="text-white text-center">Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}