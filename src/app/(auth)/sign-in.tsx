import React, { useState } from 'react';
import { View, Text ,SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';

import { Wallpaper } from '../../components/background/wallpaper';
import { InputSignIn } from '../../components/inputs/inputSignIn';
import { useAuth } from '../../contexts/authContext';

export default function SignIn() {
  const { SignIn, user } = useAuth();

  return (
    <View className="flex-1 bg-transparent">

      {/* Renderizando o Wallpaper primeiro para ficar atras do conteudo */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Wallpaper />
      </View>

      <View className="flex-1 justify-center items-center bg-transparent">
       <SafeAreaView className="w-full ">
        <BlurView 
        intensity={100} 
        className="
        items-center 
        justify-center 
        px-4 
        py-6 
        rounded
       bg-white/30
        shadow-lg 
        m-4 
        border"
        tint='dark'
        >
          <View className=' w-full justify-center items-center'>
         <InputSignIn onSignIn={SignIn} />
         </View>

        </BlurView>
       </SafeAreaView>
      </View>
      
    </View>
  );
}