import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { BottomSheetCliente, BottomSheetHandle } from '@/src/components/button/bottomSheetCliente';

// Simple clients list screen — dark background, show name + phone, open BottomSheet to edit

type Payment = {
  id: string;
  title?: string;
  name?: string;
  value?: number | null;
  amount?: number | null;
  date?: string;
  clientName?: string;
  contactName?: string;
  phone?: string;
  document?: string;
  address?: string;
  recurring?: boolean;
  recurrence?: string;
};

export default function ClientsScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef<BottomSheetHandle>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@FlowPay:payments');
        if (raw) {
          const parsed = JSON.parse(raw) as any[];
          const normalized = (parsed || []).map((p) => ({
            id: String(p?.id ?? Date.now()),
            name: p?.name ?? p?.clientName ?? p?.title,
            value: p?.value ?? p?.amount ?? null,
            date: p?.date ?? undefined,
            recurring: p?.recurring ?? p?.isOn ?? false,
            recurrence: p?.recurrence ?? p?.frequency ?? undefined,
            clientName: p?.clientName ?? undefined,
            contactName: p?.contact ?? p?.contactName ?? undefined,
            phone: p?.phone ?? undefined,
            document: p?.document ?? undefined,
            address: p?.address ?? undefined,
          }));
          setPayments(normalized);
        }
      } catch (e) {
        console.warn('Failed to load payments', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openFor = (item: Payment) => {
    const payload = {
      id: item.id,
      name: item.name ?? item.clientName ?? item.title,
      contact: item.contactName ?? (item as any).contact ?? undefined,
      value: item.value ?? item.amount ?? null,
      phone: item.phone ?? undefined,
      document: item.document ?? undefined,
      address: item.address ?? undefined,
      date: item.date ?? undefined,
      recurring: item?.recurring ?? false,
      recurrence: item?.recurrence ?? undefined,
    };
    sheetRef.current?.presentWith?.(payload as any);
  };

  const renderItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-gray-800 rounded-lg shadow-sm mb-3 mx-4"
      onPress={() => openFor(item)}
    >
      <View className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center mr-4">
        <Ionicons name="business" size={20} color={Colors.light.tint} />
      </View>

      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{item.name ?? item.clientName ?? item.title ?? 'Sem nome'}</Text>
        <Text className="text-slate-300 text-sm mt-1">{item.phone ?? item.contactName ?? '—'}</Text>
      </View>

      <View className="pl-3">
        <Ionicons name="chevron-forward" size={22} color={Colors.light.tint} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row items-center mt-11 px-4 py-3 bg-transparent border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2 rounded-md bg-gray-800">
          <Ionicons name="arrow-back" size={18} color={Colors.light.tint} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Clientes</Text>
      </View>

      {loading ? (
        <View className="p-6">
          <Text className="text-slate-300">Carregando...</Text>
        </View>
      ) : payments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-full bg-gray-800 rounded-2xl p-6 items-center shadow-sm">
            <Ionicons name="people" size={36} color={Colors.light.tint} />
            <Text className="text-white font-semibold text-lg mt-3">Nenhum cliente cadastrado</Text>
            <Text className="text-slate-300 text-center mt-2">Toque em "Adicionar cliente" na tela inicial para criar o primeiro cliente.</Text>
          </View>
        </View>
      ) : (
        <FlatList data={payments} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingVertical: 12 }} />
      )}

      <BottomSheetCliente
        ref={sheetRef}
        onAdd={(client) => {
          setPayments((prev) => {
            if (client?.id != null) {
              const clientIdStr = String(client.id);
              const next = prev.map((p) => (String(p.id) === clientIdStr ? ({
                ...p,
                name: client.name ?? p.name ?? p.clientName,
                clientName: client.name ?? p.clientName ?? p.name,
                contactName: client.contact ?? p.contactName,
                phone: client.phone ?? p.phone,
                document: client.document ?? p.document,
                address: client.address ?? p.address,
                value: client.value ?? p.value ?? p.amount ?? null,
                amount: client.value ?? p.amount ?? p.value ?? null,
                date: client.date ? String(client.date) : p.date,
                recurring: client.recurring ?? p.recurring ?? false,
                recurrence: client.recurrence ?? p.recurrence ?? p.recurrence ?? undefined,
              }) : p));
              AsyncStorage.setItem('@FlowPay:payments', JSON.stringify(next)).catch(() => {});
              // debug: log saved data
              console.warn('[Clients] saved payments (update):', next);
              DeviceEventEmitter.emit('payments:changed');
              return next;
            }

            const id = String(Date.now());
            const newItem: Payment = {
              id,
              name: client?.name ?? undefined,
              clientName: client?.name ?? undefined,
              value: client?.value ?? null,
              amount: client?.value ?? null,
              date: client?.date ? String(client.date) : undefined,
              recurring: client?.recurring ?? false,
              recurrence: client?.recurrence ?? undefined,
              contactName: client?.contact ?? undefined,
              phone: client?.phone ?? undefined,
              document: client?.document ?? undefined,
              address: client?.address ?? undefined,
            };

            const next = [...prev, newItem];
            // debug: log saved data
            console.warn('[Clients] saved payments (create):', next);
            AsyncStorage.setItem('@FlowPay:payments', JSON.stringify(next)).catch(() => {});
            DeviceEventEmitter.emit('payments:changed');
            return next;
          });
        }}
        onDelete={(id) => {
          setPayments((prev) => {
            const idStr = String(id);
            const next = prev.filter((p) => String(p.id) !== idStr);
            AsyncStorage.setItem('@FlowPay:payments', JSON.stringify(next)).catch(() => {});
            DeviceEventEmitter.emit('payments:changed');
            return next;
          });
        }}
      />
    </View>
  );
}
