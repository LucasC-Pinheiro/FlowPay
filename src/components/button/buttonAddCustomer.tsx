// Botão: abre o BottomSheet para adicionar um cliente.
import { Text, TouchableOpacity } from 'react-native';

type ButtonAddCustomerProps = {
  className?: string;
  onPress?: () => void;
  openSheet?: () => void;
};

export function ButtonAddCustomer({ className, onPress, openSheet }: ButtonAddCustomerProps) {
  function handlePress() {
    
    if (typeof openSheet === 'function') {
      return openSheet();
    }
    if (typeof onPress === 'function') {
      return onPress();
    }
  }
  return (
    <TouchableOpacity 
      onPress={handlePress}
    className="
    bg-[#005c73] 
    rounded-lg 
    p-3 
    shadow-lg
    px-36
    right-3
    "
    >
      <Text className="text-white font-bold text-lg">Adicionar cliente</Text>
    </TouchableOpacity>
  );
}
