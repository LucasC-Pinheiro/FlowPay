import React, { useState, useRef } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';

import LogoTest from '@/src/components/logo/LogoTest';
import { ButtonPerfil } from '@/src/components/button/buttonPerfil';
import { ButtonAddCustomer } from '@/src/components/button/buttonAddCustomer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { BottomSheetCliente, BottomSheetHandle } from '@/src/components/button/bottomSheetCliente';


export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  type Payment = { id: number; name: string; value?: number | null; date?: string; contact?: string; phone?: string; document?: string; address?: string };
  const [payments, setPayments] = useState<Array<Payment>>([]);
  const sheetRef = useRef<BottomSheetHandle>(null);

  // carousel state for payments list
  const flatRef = useRef<FlatList<any> | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.83, 360);

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

  const router = useRouter();

  // Persist payments to AsyncStorage whenever mudam
  React.useEffect(() => {
    AsyncStorage.setItem('@FlowPay:payments', JSON.stringify(payments)).catch(() => {});
  }, [payments]);


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


            {(() => {
              const selectedDate = typeof selectedDay === 'number' ? weekDates[selectedDay] : null;
              const paymentsForDay = selectedDate
                ? payments.filter(p => {
                    const pd = p.date ? new Date(p.date) : null;
                    return pd && pd.toDateString() === selectedDate.toDateString();
                  })
                : [];

              if (paymentsForDay.length > 0) {
                // Agrupa pagamentos em páginas de 3 itens
                const itemsPerPage = 3;
                const pages: Array<Payment[]> = [];
                for (let i = 0; i < paymentsForDay.length; i += itemsPerPage) {
                  pages.push(paymentsForDay.slice(i, i + itemsPerPage));
                }

                return (
                  <View className="mt-3 mb-3 w-full max-w-[95%]">
                    <FlatList
                      ref={flatRef}
                      data={pages}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      decelerationRate="fast"
                      snapToInterval={CARD_WIDTH}
                      snapToAlignment="center"
                      contentContainerStyle={{ paddingHorizontal: 8 }}
                      keyExtractor={(_, idx) => String(idx)}
                      renderItem={({ item: page }) => (
                        <View style={{ width: CARD_WIDTH, marginHorizontal: 8 }}>
                          {/* cada página contém até 3 itens na vertical */}
                          {page.map((it: Payment) => (
                            <TouchableOpacity key={it.id} activeOpacity={0.9} onPress={() => { if (sheetRef.current && sheetRef.current.presentWith) sheetRef.current.presentWith(it); }} style={{ marginBottom: 10 }}>
                              <View className="relative bg-green-700 rounded-lg px-3 py-3">
                                <View className="absolute top-2 left-2 mt-1">
                                  <Ionicons name="calendar" size={20} color="#e5e7eb" />
                                </View>
                                <View className="ml-8">
                                  <Text className="text-gray-200 text-sm">A receber</Text>
                                  <Text className="text-white font-bold text-lg">{it.name}</Text>
                                  <Text className="text-white/80 mt-1">{it.value ? `R$ ${Number(it.value).toFixed(2)}` : ''}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                      onMomentumScrollEnd={(ev) => {
                        const index = Math.round(ev.nativeEvent.contentOffset.x / CARD_WIDTH);
                        setCarouselIndex(index);
                      }}
                    />

                    {/* Dots: aparecem somente se houver mais de 3 itens (ou seja, mais de 1 página) */}
                    {pages.length > 1 && (
                      <View className="flex-row justify-center items-center mt-3">
                        {pages.map((_, idx) => (
                          <View key={idx} style={{ width: carouselIndex === idx ? 10 : 6, height: carouselIndex === idx ? 10 : 6, borderRadius: 10, marginHorizontal: 4, backgroundColor: carouselIndex === idx ? '#fff' : '#6b7280' }} />
                        ))}
                      </View>
                    )}
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
                setPayments((prev) => {
                  if (client?.id != null) {
                    return prev.map(p => p.id === client.id ? { ...p, name: client.name, value: client.value ?? null, date: client.date ? new Date(client.date).toString() : p.date, contact: client.contact, phone: client.phone, document: client.document, address: client.address } : p);
                  }
                  const id = Math.floor(Math.random() * 1000000);
                  return [...prev, { id, name: client.name, value: client.value ?? null, date: client.date ? new Date(client.date).toString() : undefined, contact: client.contact, phone: client.phone, document: client.document, address: client.address }];
                });
              }}
              onDelete={(id) => {
                setPayments((prev) => prev.filter(p => p.id !== id));
              }}
            />
            </View>
            {/* Lista horizontal de botões quadrados representando empresas/pessoas */}
              <View className="mt-16 w-full max-w-[95%]">
                <View className='flex-row justify-between items-center mb-1 px-3'>
                  <Text className="text-white font-bold mb-2">Clientes</Text>
                  <TouchableOpacity onPress={() => router.push('/(screens)/clients' as any)} disabled={payments.length === 0}>
                    <Text style={{ color: payments.length === 0 ? '#9ca3af' : '#58a6e3', fontWeight: '700' }} className="text-blue-500 font-bold">Ver todos</Text>
                  </TouchableOpacity>
                </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {payments.map((p) => (
                  <TouchableOpacity key={p.id} onPress={() => { if (sheetRef.current && sheetRef.current.presentWith) sheetRef.current.presentWith(p); }} style={{ width: 100, height: 100, marginRight: 12 }} activeOpacity={0.85}>
                    <View style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="business-outline" size={28} color="#06b6d4" />
                        <Text style={{ color: '#fff', fontWeight: '700', marginTop: 8 }} numberOfLines={1}>{p.name}</Text>
                      <Text style={{ color: '#9ca3af', fontSize: 12 }} numberOfLines={1}>{p.contact ?? ''}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              </View>
            </View>
          </View>


    </View>
  );
}