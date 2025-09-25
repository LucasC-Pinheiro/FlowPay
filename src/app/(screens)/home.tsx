import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, } from 'react-native';

import LogoTest from '@/src/components/logo/LogoTest';
import { ButtonPerfil } from '@/src/components/button/buttonPerfil';
import { ButtonAddCustomer } from '@/src/components/button/buttonAddCustomer';
import { Ionicons } from '@expo/vector-icons';

import { useRef } from 'react';
import { BottomSheetCliente, BottomSheetHandle } from '@/src/components/button/bottomSheetCliente';


export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [payments, setPayments] = useState<Array<{ name: string; value?: number | null; date?: string }>>([]);
  const sheetRef = useRef<BottomSheetHandle>(null);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = (dayOfWeek + 6) % 7; 
  const monday = new Date(today);

  monday.setDate(today.getDate() - mondayOffset);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
 
  const weekdayShorts = ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'];


  return (
    <View className="flex-1 justify-center items-center bg-gray-900">

      <View className="absolute top-10 left-0 right-0 z-50 mt-2 px-5 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <LogoTest size={29} />
          <Text className="text-white ml-2 font-bold text-2xl">FlowPay</Text>
        </View>

        <ButtonPerfil />
      </View>

      {/* Lista horizontal de dias da semana */}
      <View className="
      absolute 
      top-28 
      left-0 
      right-0 
      px-4
      mt-6"
      >

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            {weekDates.map((date, i) => {
                const isSelected = i === selectedDay;
                const bgClass = isSelected ? 'bg-blue-600' : 'bg-white/10';
                const textClass = isSelected ? 'text-white font-bold' : 'text-white/80';
                const short = weekdayShorts[i];
                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    onPress={() => setSelectedDay(i)}
                    className={`mr-3 ${bgClass} rounded-xl px-4 py-3 items-center`}
                  >
                    <Text className={`text-lg ${textClass}`}>{short}</Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

            <View className="mt-4 left-3">
            {selectedDay !== null ? (
              weekDates[selectedDay].toDateString() === today.toDateString() ? (
                <Text className="text-white font-bold">Hoje</Text>
              ) : (
                <Text className="text-white/80 font-bold">{`${weekdayShorts[selectedDay]}, ${weekDates[selectedDay].getDate()}/${weekDates[selectedDay].getMonth() + 1}`}</Text>
              )
            ) : (
              <Text className="text-white/70 font-bold">Selecione um dia</Text>
            )}

            {/* If there's a payment for the selected day, show it; otherwise show the empty card */}
            {(() => {
              const selectedDate = typeof selectedDay === 'number' ? weekDates[selectedDay] : null;
              const paymentsForDay = selectedDate
                ? payments.filter(p => {
                    const pd = p.date ? new Date(p.date) : null;
                    return pd && pd.toDateString() === selectedDate.toDateString();
                  })
                : [];

              if (paymentsForDay.length > 0) {
                return (
                  <View className="space-y-3 mt-3 mb-3 w-full max-w-[95%]">
                    {paymentsForDay.map((payment, idx) => (
                      <View key={`${payment.name}-${idx}`} className="relative bg-green-700 rounded-lg px-3 py-3 mt-2">
                        <View className="absolute top-2 left-2 mt-1">
                          <Ionicons name="calendar" size={20} color="#e5e7eb" />
                        </View>
                        <View className="ml-8">
                          <Text className="text-gray-200 text-sm">A receber</Text>
                          <Text className="text-white font-bold text-lg">{payment.name}</Text>
                          <Text className="text-white/80 mt-1">{payment.value ? `R$ ${Number(payment.value).toFixed(2)}` : ''}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              }

              return (
                <View className="relative bg-gray-700 rounded-lg px-3 py-3 mt-3 mb-3 w-full max-w-[95%]">
                  <View className="absolute top-2 left-2 mt-1">
                    <Ionicons name="calendar" size={20} color="#e5e7eb" />
                  </View>
                  <View className="ml-8">
                    <Text className="text-white font-bold mb-1">Nenhum pagamento agendado para hoje</Text>
                    <Text className="text-gray-200">Acompanhe seus próximos recebimentos ou revise seu histórico.</Text>
                  </View>
                </View>
              );
            })()}

            <View className="mt-2">
            <ButtonAddCustomer
              onPress={() => {
                sheetRef.current?.present();
              }}
            />

            <BottomSheetCliente
              ref={sheetRef}
              onAdd={(client) => {
                setPayments((prev) => [...prev, { name: client.name, value: client.value ?? null, date: client.date ? client.date.toString() : undefined }]);
              }}
            />
            </View>
            </View>
          </View>


    </View>
  );
}