import { View } from 'react-native';

import { InputSignUp } from '../components/inputs/inputSignUp';
import { ButtonSignUp } from '../components/inputs/button/buttonSignUp';
import { Wallpaper } from '../components/background/wallpaper';

export default function SignUp() {
  return (
    <View className="flex-1 bg-transparent">
      {/* Wallpaper rendered first so it stays behind content */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Wallpaper />
      </View>

      <View className="flex-1 justify-center items-center bg-transparent">
        <InputSignUp />
        <ButtonSignUp />
      </View>
    </View>
  );
}