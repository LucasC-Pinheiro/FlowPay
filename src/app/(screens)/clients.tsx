import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

// Tailwind-styled clients list screen — nativewind `className` usage

type Payment = {
  id: string;
  title?: string;
  amount: number;
  date: string; // ISO
  clientName?: string;
  contactName?: string;
  phone?: string;
  document?: string;
  address?: string;
  recurrence?: string;
};

export default function ClientsScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@FlowPay:payments');
        if (raw) {
          const parsed: Payment[] = JSON.parse(raw);
          setPayments(parsed || []);
        }
      } catch (e) {
        console.warn('Failed to load payments', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white rounded-lg shadow-sm mb-3 mx-4"
      onPress={() => router.push('/' as any)}
    >
      <View className="w-12 h-12 rounded-lg bg-slate-100 items-center justify-center mr-4">
        <Ionicons name="business" size={20} color="#0f172a" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-900 font-semibold text-base">{item.clientName || item.title || 'Sem nome'}</Text>
        <Text className="text-slate-500 text-sm mt-1">{item.contactName || '—'}</Text>
        <Text className="text-slate-400 text-xs mt-1">{item.phone || ''} {item.document ? `• ${item.document}` : ''}</Text>
      </View>
      <View className="pl-3">
        <Ionicons name="chevron-forward" size={22} color="#0f172a" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2 rounded-md bg-slate-100">
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Clientes</Text>
      </View>

      {loading ? (
        <View className="p-6">
          <Text className="text-slate-600">Carregando...</Text>
        </View>
      ) : payments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-full bg-white rounded-2xl p-6 items-center shadow-sm">
            <Ionicons name="people" size={36} color="#06b6d4" />
            <Text className="text-slate-900 font-semibold text-lg mt-3">Nenhum cliente cadastrado</Text>
            <Text className="text-slate-500 text-center mt-2">Toque em "Adicionar cliente" na tela inicial para criar o primeiro cliente.</Text>
          </View>
        </View>
      ) : (
        <FlatList data={payments} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingVertical: 12 }} />
      )}
    </View>
  );
}
