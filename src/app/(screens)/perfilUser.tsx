/**
 * Tela de Perfil do Usuário
 * 
 * Funcionalidades:
 * - Exibição da foto de perfil atual
 * - Seleção de nova foto da galeria
 * - Atualização automática da foto em todas as telas via AuthContext
 * - Solicitação de permissões para acesso à galeria
 * 
 * Tecnologias utilizadas:
 * - expo-image-picker: seleção de imagens
 * - Integração com AuthContext para persistência global
 */

import React,{ useState } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { router } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/src/contexts/authContext';

export default function PerfilUser() {
  const { user, updateUserPhoto } = useAuth();
  const [image, setImage] = React.useState<string | null>(null);

  const pickImage = async () => {
    // Solicita permissão para acessar a galeria de fotos
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    // Abre o seletor de imagens da galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true, // Permite edição/recorte
      aspect: [4, 3], // Proporção da imagem
      quality: 1, // Qualidade máxima
    });

      if (!result.canceled) {
        // Extrai a URI da imagem selecionada (compatível com diferentes versões do SDK)
        const uri = result.assets?.[0]?.uri ?? (result as any).uri;
        if (uri) {
          setImage(uri); // Atualiza estado local para feedback visual imediato
          // Persiste a nova foto no contexto global para propagar para outras telas
          updateUserPhoto(uri).catch(() => {});
        }
      }
  };



  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="items-center mt-8">
        

        <Image
          source={{ uri: image ?? user?.photo ?? 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' }}
          className="w-44 h-44 rounded-full border-4 border-blue-500 mt-4"
        />
        <Text className="text-white text-2xl font-bold mt-4">Lucas Pinheiro</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="
          mt-3
          bg-blue-500 
          px-4 
          py-2 
          rounded-full"
        >
          <Text className="text-white font-semibold">Editar Perfil</Text>
        </TouchableOpacity>
        </View>

        <View className='items-center mt-auto'>
        <TouchableOpacity
          onPress={() => {
            router.push('/(screens)/home');
          }}
          className='mt-3 bg-red-500 px-4 py-2 rounded-full'
        >
          <Text className="text-white font-semibold">Voltar para Home</Text>
        </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
}