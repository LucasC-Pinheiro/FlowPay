/**
 * Tela de Sign In do FlowPay
 * 
 * Funcionalidades implementadas:
 * - Login com email e senha
 * - Autenticação biométrica (Face ID/Touch ID) como segundo fator
 * - Validação de credenciais
 * - Navegação automática para Home após login bem-sucedido
 * 
 * Fluxo de autenticação:
 * 1. Usuário insere email e senha
 * 2. Sistema valida credenciais
 * 3. Se dispositivo suporta biometria, solicita confirmação
 * 4. Após sucesso, redireciona para tela Home
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

// Componentes internos
import LogoTest from '../../components/logo/LogoTest';
import { Wallpaper } from '../../components/background/wallpaper';
import { InputSignIn } from '../../components/inputs/inputSignIn';
import { useAuth } from '../../contexts/authContext';



export default function SignIn() {
  const { SignIn } = useAuth();

  const checkBiometricSupport = async () => {
    try {
      // Verifica se o hardware suporta biometria
      const isCompatible = await LocalAuthentication.hasHardwareAsync();
      console.log('Hardware compatível:', isCompatible);
      
      // Verifica se há biometria cadastrada no dispositivo
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Biometria cadastrada:', isEnrolled);
      
      // Verifica quais tipos de autenticação estão disponíveis
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Tipos suportados:', supportedTypes);
      
      if (!isCompatible || !isEnrolled) {
        console.log('Biometria não disponível - Hardware:', isCompatible, 'Cadastrada:', isEnrolled);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar suporte biométrico:', error);
      return false;
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      // Configurações mais específicas para biometria
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade para entrar no FlowPay',
        fallbackLabel: 'Use sua senha do dispositivo',
        cancelLabel: 'Cancelar',
        requireConfirmation: false,
        disableDeviceFallback: false, // Permite fallback para senha do dispositivo se biometria falhar
      });

      console.log('Resultado da autenticação biométrica:', result);
      return result.success;
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return false;
    }
  };

  const handleSignInWithBiometrics = async (email: string, password: string) => {
    console.log('Iniciando processo de login para:', email);
    
    // Primeiro, verifica se as credenciais estão corretas
    if (email === "teste@gmail.com" && password === "123") {
      console.log('Credenciais válidas, verificando biometria...');
      
      // Se o dispositivo suporta biometria, pede confirmação
      const biometricSupported = await checkBiometricSupport();
      console.log('Suporte biométrico:', biometricSupported);
      
      if (biometricSupported) {
        console.log('Solicitando autenticação biométrica...');
        const biometricSuccess = await authenticateWithBiometrics();
        console.log('Resultado biométrico:', biometricSuccess);
        
        if (!biometricSuccess) {
          console.log('Biometria falhou, bloqueando login');
          throw new Error('Autenticação biométrica falhou');
        }
        
        console.log('Biometria bem-sucedida, fazendo login...');
      } else {
        console.log('Biometria não disponível, fazendo login direto...');
      }
      
      // Se chegou até aqui, faz o login
      await SignIn(email, password);
      console.log('Login realizado com sucesso');
    } else {
      console.log('Credenciais inválidas:', email);
      throw new Error('Credenciais inválidas');
    }
  };

  return (
    <View className="flex-1 bg-transparent">

      <View className="
      absolute 
      top-10 
      left-0 
      right-0 
      z-50 
      mt-20 
      flex-row 
      justify-center 
      items-center"
      >
        <LogoTest size={29} />
        <Text className="
        text-white 
        ml-2 
        font-bold 
        text-2xl"
        >
          FlowPay</Text>
      </View>

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
         <InputSignIn onSignIn={handleSignInWithBiometrics} />
         </View>

        </BlurView>
       </SafeAreaView>
      </View>
      
    </View>
  );
}