import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import CurrencyInput from 'react-native-currency-input';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export type BottomSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

export const BottomSheetCliente = forwardRef<BottomSheetHandle>((props, ref) => {
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
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
});

BottomSheetCliente.displayName = 'BottomSheetCliente';
