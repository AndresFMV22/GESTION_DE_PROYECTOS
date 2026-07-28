import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MODULE_ICONS = { hogar: '🏠', vehiculo: '🚗', salud: '❤️', finanzas: '💰', familia: '👨‍👩‍👧', mascotas: '🐾', general: '🔔' };
const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function HomeScreen({ navigation }) {
  const [upcoming, setUpcoming] = useState([]);
  const [modules, setModules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [upcomingData, modulesData] = await Promise.all([
        api.reminders.getUpcoming(),
        api.modules.getAll(),
      ]);
      setUpcoming(upcomingData);
      setModules(modulesData.filter(m => m.user_has_module));
    } catch (e) {
      console.error(e);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.date}>Tus próximos recordatorios</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modulesRow}>
        <FlatList
          horizontal
          data={modules}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('ModuleDetail', { moduleId: item.id, moduleName: item.name, moduleSlug: item.slug })}
            >
              <Text style={styles.moduleIcon}>{MODULE_ICONS[item.slug] || '📋'}</Text>
              <Text style={styles.moduleName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos 7 días</Text>
      </View>

      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay recordatorios próximos</Text>
            <Text style={styles.emptySubtext}>¡Agrega uno desde un módulo!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reminderCard}>
            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderModule}>{MODULE_ICONS[item.module_slug]} {item.module_name}{item.category_name ? ` - ${item.category_name}` : ''}</Text>
            </View>
            <View style={styles.reminderDate}>
              <Text style={styles.dateText}>{formatDate(item.reminder_date)}</Text>
              <Text style={styles.timeText}>{formatTime(item.reminder_date)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateReminder')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#2563eb' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  date: { fontSize: 14, color: '#bfdbfe', marginTop: 4 },
  logoutBtn: { padding: 8 },
  logoutText: { color: '#fff', fontSize: 14 },
  modulesRow: { paddingVertical: 16, paddingLeft: 16 },
  moduleCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginRight: 12, alignItems: 'center', width: 80, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  moduleIcon: { fontSize: 28, marginBottom: 6 },
  moduleName: { fontSize: 11, color: '#374151', textAlign: 'center', fontWeight: '500' },
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  reminderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  reminderModule: { fontSize: 12, color: '#6b7280', marginTop: 3 },
  reminderDate: { alignItems: 'flex-end' },
  dateText: { fontSize: 13, fontWeight: '500', color: '#374151' },
  timeText: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#6b7280' },
  emptySubtext: { fontSize: 14, color: '#9ca3af', marginTop: 6 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
});
