import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Switch,
  Pressable,
  TextInput,
} from 'react-native';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import CurrencyInput from 'react-native-currency-input';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export type BottomSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

interface BottomSheetProps {
  onAdd?: (client: {
    name: string;
    contact?: string;
    phone?: string;
    document?: string;
    address?: string;
    value?: number | null;
    date?: Date | null;
  }) => void;
}

export const BottomSheetCliente = forwardRef<BottomSheetHandle, BottomSheetProps>(({ onAdd }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.present();
    },
    dismiss: () => {
      bottomSheetRef.current?.dismiss();
    },
  }));

  const [value, setValue] = React.useState<number | null>(null);
  
  const [clientName, setClientName] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [document, setDocument] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');

  const randomFutureDate = () => {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 365) + 1;
    const d = new Date(today);
    d.setDate(d.getDate() + daysToAdd);
    return d;
  };

  const [date, setDate] = React.useState<Date | null>(randomFutureDate());
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setDatePickerVisible(false);
  };

  const [isOn, setIsOn] = React.useState(false);

  const [showList, setShowList] = React.useState(false);
  const data = ['Semanalmente', 'Mensalmente', 'Anualmente'];
  const [selectedFreq, setSelectedFreq] = React.useState<string>(data[0]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#1f2937' }}
      handleIndicatorStyle={{ backgroundColor: '#ccc' }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetView className="p-4 flex-1">
            <Text className="text-2xl font-bold text-white">Adicionar Cliente</Text>

            <View>
              <View className="flex-row items-start space-x-3 mt-7 gap-2">
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold">Valor</Text>
                  <CurrencyInput
                    placeholder="R$ 0,00"
                    value={value}
                    onChangeValue={setValue}
                    prefix="R$"
                    delimiter="."
                    separator=","
                    precision={2}
                    placeholderTextColor={'#888'}
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />
                </View>

                <View style={{ minWidth: 140 }}>
                  <Text className="text-white text-lg font-semibold">Data de cobrança</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDatePickerVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={{
                        height: 50,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        marginTop: 8,
                      }}
                    >
                      <Text style={{ flex: 1, color: date ? '#fff' : '#ccc' }}>
                        {date ? date.toLocaleDateString('pt-BR') : 'Selecione a data'}
                      </Text>
                      <Ionicons name="calendar" size={20} color="#ccc" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {isDatePickerVisible && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  themeVariant="dark"
                />
              )}
            </View>
            <View 
            className="flex-row items-center left-1"
            style={Platform.OS === 'ios' ? { marginTop: 20 } : { marginTop: 5 }}
            >
              <Text className="text-white text-lg font-semibold mr-2">
                Cobrança recorrente?
              </Text>
              <Switch
                value={isOn}
                onValueChange={setIsOn}
                thumbColor={isOn ? '#0396bb' : '#f3f4f6'}
                trackColor={{ false: '#374151', true: '#00C2CB' }}
                style={
                  Platform.OS === "ios"
                    ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginTop: 4 } // só reduz no iOS
                    : undefined
                }
              />

              <View style={{ marginLeft: 12, position: 'relative' }}>
                <Pressable
                  onPress={() => setShowList((s) => !s)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: '#333',
                    backgroundColor: '#111827',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', marginRight: 8 }}>{selectedFreq}</Text>
                  <Ionicons name="chevron-down" size={18} color="#0396bb" />
                </Pressable>

                {showList && (
                  <View style={{ position: 'absolute', top: 52, left: 0, backgroundColor: '#0b1220', borderRadius: 8, borderWidth: 1, borderColor: '#222', overflow: 'hidden', zIndex: 1000, minWidth: 140 }}>
                    {data.map((item) => (
                      <Pressable key={item} onPress={() => { setSelectedFreq(item); setShowList(false); }} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#fff' }}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View
              className='
              h-px
              bg-[#444]
              my-4
              '
            />

              <View>
                <View style={{ marginTop: 12 }}>
                  <Text className="text-white text-lg font-semibold">Nome do cliente</Text>
                  <TextInput
                    value={clientName}
                    onChangeText={setClientName}
                    placeholder="Ex: João da Silva | Loja do Bairro"
                    placeholderTextColor={'#888'}
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />

                  <Text className="text-white text-lg font-semibold mt-3">Contato</Text>
                  <TextInput
                    value={contactName}
                    onChangeText={setContactName}
                    placeholder="Ex: joao@gmail.com"
                    placeholderTextColor={'#888'}
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />

                  <Text className="text-white text-lg font-semibold mt-3">Telefone</Text>
                  <TextInput
                    value={phone}
                    onChangeText={(t) => {
                      // keep only digits, limit to 11 (DDD + 9 digits) — accepts 10 or 11 but caps to 11
                      const digits = t.replace(/\D/g, '');
                      const limited = digits.slice(0, 11);
                      setPhone(limited);
                    }}
                    placeholder="Ex: 999999999"
                    placeholderTextColor={'#888'}
                    keyboardType="phone-pad"
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />

                  <Text className="text-white text-lg font-semibold mt-3">CNPJ ou CPF</Text>
                  <TextInput
                    value={document}
                    onChangeText={(t) => {
                      const digits = t.replace(/\D/g, '');
                      const limited = digits.length <= 11 ? digits.slice(0, 11) : digits.slice(0, 14);
                      setDocument(limited);
                    }}
                    placeholder="Ex: 12345678901 ou 12345678000195"
                    placeholderTextColor={'#888'}
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />

                  <Text className="text-white text-lg font-semibold mt-3">Endereço</Text>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Ex: Rua das Flores, 123, Bairro, Cidade"
                    placeholderTextColor={'#888'}
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      color: '#fff',
                      marginTop: 8,
                    }}
                  />
                </View>


                <View className='
                mt-6
                space-y-2
                flex-row
                justify-end
                items-end
                right-4
                '
                >

                  <TouchableOpacity
                    onPress={() => bottomSheetRef.current?.dismiss()}
                    className='
                    bg-gray-600 
                    p-3
                    items-center
                    rounded-lg
                    mr-2
                    '
                  >
                    <Text className='text-white font-semibold'>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='
                    bg-blue-500 
                    p-3
                    items-center
                    rounded-lg
                    '
                    onPress={() => {
                      const payload = {
                        name: clientName,
                        contact: contactName,
                        phone,
                        document,
                        address,
                        value,
                        date,
                      };
                      onAdd?.(payload);
                      bottomSheetRef.current?.dismiss();
                    }}
                  >
                    <Text className='text-white font-semibold'>Salvar alterações</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </BottomSheetView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </BottomSheetModal>
  );
});

BottomSheetCliente.displayName = 'BottomSheetCliente';
