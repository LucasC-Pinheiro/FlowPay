import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { ButtonSignIn } from "../button/buttonSignIn";

type InputSignInProps = {
  onSignIn: (email: string, password: string) => void;
};

export function InputSignIn({ onSignIn }: InputSignInProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = () => {
    // Lógica de autenticação aqui

    if (!email || !password) {
      setError("Por favor, insira seu e-mail e senha.");
      return;
    }
    setError("");
    router.push('/(screens)/home');
    onSignIn(email, password);
  }

  return (
    <View className="w-11/12 max-w-md mx-auto">
      {/* E-mail */}
      <View className="mb-4">
        <Text className="text-xs text-white mb-2">E-mail</Text>
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-gray-200 shadow-sm">
          <Feather name="mail" size={18} color="#6B7280" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="ml-3 flex-1 text-base text-gray-800"
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="E-mail"
            returnKeyType="next"
          />
        </View>
      </View>

      {/* Senha */}
      <View>
        <Text className="text-xs text-white mb-2">Senha</Text>
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-gray-200 shadow-sm">
          <Feather name="lock" size={18} color="#6B7280" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            className="ml-3 flex-1 text-base text-gray-800"
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            accessibilityLabel="Senha"
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible((v) => !v)}
            accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            className="ml-2 p-1"
          >
            <Feather name={passwordVisible ? "eye-off" : "eye"} size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Erro */}
      {error ? (
        <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
      ) : null}

      {/* Ações */}
      <View className="mt-1">
        <ButtonSignIn onPress={handleSignIn} />
      </View>
    </View>
  );
}
