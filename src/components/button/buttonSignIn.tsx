// Botão de entrada (Sign In) com link para a tela de cadastro.
import { TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";

type ButtonSignInProps = {
  onPress: () => void;
}

export function ButtonSignIn( { onPress }: ButtonSignInProps ) {
  return (
    <View className="w-11/12 max-w-md mx-auto mt-6">
      <TouchableOpacity 
      onPress={onPress} 
      accessibilityLabel="Entrar"
      className="
      bg-blue-500 
      rounded-2xl 
      px-4 
      py-2"
      >
        <Text className="text-white text-center">Entrar</Text>
      </TouchableOpacity>

        <View className="mt-4 flex-row justify-center items-center">
          <Text className="text-sm text-white/80">Ainda não tem conta?</Text>
          <TouchableOpacity
            onPress={() => {
              router.push('/(auth)/sign-up');
            }}
            accessibilityLabel="Criar conta"
            className="ml-2"
          >
            <Text className="text-sm text-white font-semibold">Cadastre-se</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}