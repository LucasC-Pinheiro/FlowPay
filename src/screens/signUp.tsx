import { View, SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';

import { InputSignUp } from '../components/inputs/inputSignUp';
import { ButtonSignUp } from '../components/button/buttonSignUp';
import { Wallpaper } from '../components/background/wallpaper';

export default function SignUp() {
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
         <InputSignUp />
         <ButtonSignUp />
        </BlurView>
       </SafeAreaView>
      </View>
      
    </View>
  );
}