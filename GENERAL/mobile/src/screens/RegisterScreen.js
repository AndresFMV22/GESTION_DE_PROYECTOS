import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Nombre, email y contraseña son requeridos');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, phone);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Comienza a organizar tu vida adulta</Text>

        <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Teléfono (opcional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear Cuenta'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { color: '#2563eb', textAlign: 'center', fontSize: 14 },
});
