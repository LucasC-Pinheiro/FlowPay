import React, { useState } from 'react';
import { 
  Image, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView } from 'react-native';

import LogoTest from '@/src/components/logo/LogoTest';
import { ButtonPerfil } from '@/src/components/button/buttonPerfil';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
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
            </View>
          </View>
          <Text className="text-white text-2xl">Home Screen</Text>
    </View>
  );
}