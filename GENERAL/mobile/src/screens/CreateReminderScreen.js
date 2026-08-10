import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { api } from '../services/api';

const RECURRENCES = [
  { value: 'none', label: 'Una vez' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
];

const PRIORITIES = [
  { value: 'low', label: 'Baja', color: '#22c55e' },
  { value: 'medium', label: 'Media', color: '#f59e0b' },
  { value: 'high', label: 'Alta', color: '#ef4444' },
];

export default function CreateReminderScreen({ route, navigation }) {
  const { moduleId, moduleName, categories } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('none');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Error', 'La fecha es requerida (formato: YYYY-MM-DD)');
      return;
    }

    setLoading(true);
    try {
      const reminderDate = new Date(`${date}T${time}:00`);
      await api.reminders.create({
        moduleId: parseInt(moduleId),
        categoryId: selectedCategory,
        title: title.trim(),
        description: description.trim() || null,
        reminderDate: reminderDate.toISOString(),
        recurrence,
        priority,
        notes: notes.trim() || null,
      });
      Alert.alert('Éxito', 'Recordatorio creado', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Nuevo Recordatorio</Text>
      <Text style={styles.headerModule}>{moduleName}</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Cambio de aceite" />

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholder="Detalles adicionales..." />

      {categories?.length > 0 && (
        <>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.chipRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Fecha (YYYY-MM-DD) *</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-08-15" keyboardType={Platform.OS === 'ios' ? 'default' : 'default'} />

      <Text style={styles.label}>Hora</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="09:00" />

      <Text style={styles.label}>Frecuencia</Text>
      <View style={styles.chipRow}>
        {RECURRENCES.map(r => (
          <TouchableOpacity
            key={r.value}
            style={[styles.chip, recurrence === r.value && styles.chipActive]}
            onPress={() => setRecurrence(r.value)}
          >
            <Text style={[styles.chipText, recurrence === r.value && styles.chipTextActive]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.chipRow}>
        {PRIORITIES.map(p => (
          <TouchableOpacity
            key={p.value}
            style={[styles.priorityChip, { borderColor: p.color }, priority === p.value && { backgroundColor: p.color }]}
            onPress={() => setPriority(p.value)}
          >
            <Text style={[styles.chipText, priority === p.value && { color: '#fff' }]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notas</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline numberOfLines={3} placeholder="Información extra..." />

      <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
        <Text style={styles.createBtnText}>{loading ? 'Creando...' : 'Crear Recordatorio'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  headerModule: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  textArea: { height: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#fff' },
  priorityChip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 2 },
  createBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  createBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
