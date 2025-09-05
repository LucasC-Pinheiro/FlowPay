import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export function InputSignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="w-11/12 max-w-md mx-auto">
      {/* Nome */}
      <View className="mb-4">
        <Text className="text-xs text-white mb-2">Nome</Text>
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-gray-200 shadow-sm">
          <Feather name="user" size={18} color="#6B7280" />
          <TextInput
            className="ml-3 flex-1 text-base text-gray-800"
            placeholder="Digite seu nome"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="Nome"
            returnKeyType="next"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* E-mail */}
      <View className="mb-4">
        <Text className="text-xs text-white mb-2">E-mail</Text>
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-gray-200 shadow-sm">
          <Feather name="mail" size={18} color="#6B7280" />
          <TextInput
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
    </View>
  );
}
