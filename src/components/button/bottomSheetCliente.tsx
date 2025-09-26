// Componente BottomSheet para adicionar/editar clientes e cobranças.
// Contém campos de valor, data, recorrência e informações do cliente.
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
  presentWith?: (client: any) => void;
};

interface BottomSheetProps {
  onAdd?: (client: any) => void;
  onDelete?: (id: number) => void;
}

export const BottomSheetCliente = forwardRef<BottomSheetHandle, BottomSheetProps>(({ onAdd, onDelete }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const [editingId, setEditingId] = React.useState<number | null>(null);

  const [value, setValue] = React.useState<number | null>(null);
  const [clientName, setClientName] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [document, setDocument] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');

  const randomFutureDate = () => {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 30) + 1;
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

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
    presentWith: (client: any) => {
      setClientName(client?.name ?? '');
      setContactName(client?.contact ?? '');
      setPhone(client?.phone ?? '');
      setDocument(client?.document ?? '');
      setAddress(client?.address ?? '');
      setValue(client?.value ?? null);
      setDate(client?.date ? new Date(client.date) : randomFutureDate());
      setEditingId(client?.id ?? null);
      bottomSheetRef.current?.present();
    },
  }));

  const resetForm = () => {
    setEditingId(null);
    setClientName('');
    setContactName('');
    setPhone('');
    setDocument('');
    setAddress('');
    setValue(null);
    setDate(randomFutureDate());
    setIsOn(false);
    setSelectedFreq(data[0]);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#0f172a' }}
      handleIndicatorStyle={{ backgroundColor: '#475569' }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={resetForm}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetView className="p-4 flex-1">
            <Text className="text-2xl font-bold text-white">{editingId != null ? 'Editar Cliente' : 'Adicionar Cliente'}</Text>

            {/* Valor + Data */}
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
                    style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }}
                  />
                </View>

                <View style={{ minWidth: 140 }}>
                  <Text className="text-white text-lg font-semibold">Data de cobrança</Text>
                  <TouchableOpacity onPress={() => setDatePickerVisible(true)} activeOpacity={0.8}>
                    <View style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', marginTop: 8 }}>
                      <Text style={{ flex: 1, color: date ? '#fff' : '#94a3b8' }}>{date ? date.toLocaleDateString('pt-BR') : 'Selecione a data'}</Text>
                      <Ionicons name="calendar" size={18} color="#94a3b8" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {isDatePickerVisible && (
                <DateTimePicker value={date ?? new Date()} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={handleDateChange} themeVariant="dark" />
              )}
            </View>

            {/* Recorrente + pílula */}
            <View className="flex-row items-center left-1" style={Platform.OS === 'ios' ? { marginTop: 20 } : { marginTop: 8 }}>
              <Text className="text-white text-lg font-semibold mr-2">Cobrança recorrente?</Text>
              <Switch value={isOn} onValueChange={setIsOn} thumbColor={isOn ? '#06b6d4' : '#f3f4f6'} trackColor={{ false: '#334155', true: '#0891b2' }} style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginTop: 4 } : undefined} />

              <View style={{ marginLeft: 12, position: 'relative' }}>
                <Pressable onPress={() => setShowList((s) => !s)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0b1220', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', marginRight: 8 }}>{selectedFreq}</Text>
                  <Ionicons name="chevron-down" size={18} color="#06b6d4" />
                </Pressable>

                {showList && (
                  <View style={{ position: 'absolute', top: 52, left: 0, backgroundColor: '#071026', borderRadius: 8, borderWidth: 1, borderColor: '#0f172a', overflow: 'hidden', zIndex: 1000, minWidth: 140 }}>
                    {data.map((item) => (
                      <Pressable key={item} onPress={() => { setSelectedFreq(item); setShowList(false); }} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#fff' }}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Campos */}
            <View style={{ marginTop: 12 }}>
              <Text className="text-white text-lg font-semibold">Nome do cliente</Text>
              <TextInput value={clientName} onChangeText={setClientName} placeholder="Ex: João da Silva | Loja do Bairro" placeholderTextColor={'#888'} style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }} />

              <Text className="text-white text-lg font-semibold mt-3">Contato</Text>
              <TextInput value={contactName} onChangeText={setContactName} placeholder="Ex: joao@gmail.com" placeholderTextColor={'#888'} style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }} />

              <Text className="text-white text-lg font-semibold mt-3">Telefone</Text>
              <TextInput value={phone} onChangeText={(t) => { const digits = t.replace(/\D/g, ''); const limited = digits.slice(0, 11); setPhone(limited); }} placeholder="Ex: 999999999" placeholderTextColor={'#888'} keyboardType="phone-pad" style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }} />

              <Text className="text-white text-lg font-semibold mt-3">CNPJ ou CPF</Text>
              <TextInput value={document} onChangeText={(t) => { const digits = t.replace(/\D/g, ''); const limited = digits.length <= 11 ? digits.slice(0, 11) : digits.slice(0, 14); setDocument(limited); }} placeholder="Ex: 12345678901 ou 12345678000195" placeholderTextColor={'#888'} style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }} />

              <Text className="text-white text-lg font-semibold mt-3">Endereço</Text>
              <TextInput value={address} onChangeText={setAddress} placeholder="Ex: Rua das Flores, 123, Bairro, Cidade" placeholderTextColor={'#888'} style={{ height: 50, borderColor: '#334155', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: '#fff', marginTop: 8 }} />
            </View>

            {/* Ações: lixeira no início (start) e botões à direita na mesma linha */}
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Left slot: trash (visible somente em edição) */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {editingId != null && (
                  <TouchableOpacity onPress={() => { onDelete?.(editingId); resetForm(); bottomSheetRef.current?.dismiss(); }} style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }}>
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Right slot: Cancelar e Salvar/Adicionar */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { bottomSheetRef.current?.dismiss(); }} style={{ backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginRight: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  const payload = { id: editingId ?? undefined, name: clientName, contact: contactName, phone, document, address, value, date };
                  onAdd?.(payload as any);
                  resetForm();
                  bottomSheetRef.current?.dismiss();
                }} style={{ backgroundColor: '#06b6d4', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 }}>
                  <Text style={{ color: '#062024', fontWeight: '700' }}>{editingId != null ? 'Salvar alterações' : 'Adicionar'}</Text>
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
