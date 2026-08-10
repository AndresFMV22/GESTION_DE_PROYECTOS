import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function ModuleDetailScreen({ route, navigation }) {
  const { moduleId, moduleName, moduleSlug } = route.params;
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [remindersData, categoriesData] = await Promise.all([
        api.reminders.getAll({ moduleId }),
        api.modules.getCategories(moduleId),
      ]);
      setReminders(remindersData);
      setCategories(categoriesData);
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleComplete(id, currentStatus) {
    try {
      await api.reminders.update(id, { isCompleted: !currentStatus });
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function deleteReminder(id) {
    Alert.alert('Eliminar', '¿Eliminar este recordatorio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await api.reminders.delete(id);
            loadData();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      },
    ]);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{moduleName}</Text>
        <Text style={styles.count}>{reminders.length} recordatorios</Text>
      </View>

      {categories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionLabel}>Categorías</Text>
          <View style={styles.categoriesRow}>
            {categories.map(cat => (
              <View key={cat.id} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sin recordatorios</Text>
            <Text style={styles.emptySubtext}>Toca + para crear uno</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.is_completed && styles.cardCompleted]}>
            <TouchableOpacity style={styles.checkBtn} onPress={() => toggleComplete(item.id, item.is_completed)}>
              <View style={[styles.checkbox, item.is_completed && styles.checked]}>
                {item.is_completed && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, item.is_completed && styles.textCompleted]}>{item.title}</Text>
              <Text style={styles.cardDate}>{formatDate(item.reminder_date)}</Text>
              {item.category_name && <Text style={styles.cardCategory}>{item.category_name}</Text>}
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[item.priority] + '20' }]}>
              <Text style={[styles.priorityText, { color: PRIORITY_COLORS[item.priority] }]}>
                {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateReminder', { moduleId, moduleName, categories })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#2563eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  count: { fontSize: 14, color: '#bfdbfe', marginTop: 4 },
  categoriesSection: { padding: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { backgroundColor: '#e0e7ff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  categoryText: { fontSize: 12, color: '#3730a3', fontWeight: '500' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, borderRadius: 12, padding: 14 },
  cardCompleted: { opacity: 0.5 },
  checkBtn: { marginRight: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  textCompleted: { textDecorationLine: 'line-through' },
  cardDate: { fontSize: 12, color: '#6b7280', marginTop: 3 },
  cardCategory: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  priorityBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteText: { color: '#ef4444', fontSize: 16 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#6b7280' },
  emptySubtext: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
});
