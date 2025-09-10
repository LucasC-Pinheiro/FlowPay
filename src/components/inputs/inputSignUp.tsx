import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";

import { Feather } from "@expo/vector-icons";
import { ButtonSignUp } from "../button/buttonSignUp";

type InputSignUpProps = {
  onSignUp: (name: string, email: string, password: string) => void;
}

export function InputSignUp({ onSignUp }: InputSignUpProps) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);



  const handleSignUp = () => {
    // Lógica de autenticação aqui
    if (!name || !email || !password) {
      setError("Por favor, insira nome, e-mail e senha.");
      return;
    }
    setError("");
    onSignUp(name, email, password);
  };
  return (
    <View className="w-11/12 max-w-md">
      {/* Nome */}
      <View className="mb-4">
        <Text className="text-xs text-white mb-2">Nome</Text>
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-gray-200 shadow-sm">
          <Feather name="user" size={18} color="#6B7280" />
          <TextInput
            value={name}
            onChangeText={setName}
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
      <View>
        <ButtonSignUp onPress={handleSignUp} />
      </View>

    </View>
  );
}
