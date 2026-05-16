import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Modal,
} from 'react-native';
import { onAuthChange } from '../../firebase/auth';
import { createDocument, updateDocument, deleteDocument, subscribeToCollection } from '../services/firestoreService';
import { sendWelcomeMessage } from '../services/whatsapp';
import Card from '../components/Card';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { formatDate } from '../utils/helpers';
import { TIPOS_CLIENTE } from '../utils/constants';

const PatientsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState({
    nombre: '', apellido: '', cedula: '', telefono: '', email: '',
    direccion: '', tipo: 'Nuevo', notas: '',
  });

  useEffect(() => {
    const unsubAuth = onAuthChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const unsubPatients = subscribeToCollection('pacientes', (data) => {
          setPatients(data);
        }, [{ field: 'doctorId', operator: '==', value: currentUser.uid }]);
        return unsubPatients;
      }
    });
    return unsubAuth;
  }, []);

  const filteredPatients = patients.filter((c) =>
    `${c.nombre} ${c.apellido} ${c.cedula || ''} ${c.telefono || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      nombre: '', apellido: '', cedula: '', telefono: '', email: '',
      direccion: '',
      tipo: 'Nuevo', notas: '',
    });
    setEditingPatient(null);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      nombre: patient.nombre || '',
      apellido: patient.apellido || '',
      cedula: patient.cedula || '',
      telefono: patient.telefono || '',
      email: patient.email || '',
      direccion: patient.direccion || '',
      tipo: patient.tipo || 'Nuevo',
      notas: patient.notas || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.apellido) {
      Alert.alert('Error', 'Nombre y apellido son obligatorios');
      return;
    }
    if (editingPatient) {
      await updateDocument('pacientes', editingPatient.id, form);
    } else {
      const result = await createDocument('pacientes', {
        ...form,
        doctorId: user.uid,
        doctorNombre: user.displayName || '',
      });
      if (result.success && form.telefono) {
        sendWelcomeMessage(form.telefono, `${form.nombre} ${form.apellido}`);
      }
    }
    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (patientId) => {
    Alert.alert(
      'Eliminar Cliente',
      '¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteDocument('pacientes', patientId),
        },
      ]
    );
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity onPress={() => openEdit(item)} onLongPress={() => handleDelete(item.id)}>
      <Card
        icon="👤"
        title={`${item.nombre} ${item.apellido}`}
        subtitle={`${item.tipo || 'Nuevo'} • ${item.cedula || 'Sin cédula'}`}
        badge={item.telefono}
      >
        <Text style={styles.patientInfo}>
          {item.email || 'Sin email'} · {item.telefono || 'Sin teléfono'}
          {item.email ? ` · ${item.email}` : ''}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Clientes"
        subtitle={`${patients.length} registrados`}
        onBack={() => navigation.goBack()}
        rightAction={() => { resetForm(); setModalVisible(true); }}
        rightIcon="+"
      />

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, cédula o teléfono..."
          placeholderTextColor={COLORS.disabled}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>
              {search ? 'No se encontraron clientes' : 'No hay clientes registrados. Presione + para agregar.'}
            </Text>
          </Card>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingPatient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </Text>
            <FlatList
              data={[
                { key: 'nombre', placeholder: 'Nombre *' },
                { key: 'apellido', placeholder: 'Apellido *' },
                { key: 'cedula', placeholder: 'Cédula' },
                { key: 'telefono', placeholder: 'Teléfono' },
                { key: 'email', placeholder: 'Email' },
                { key: 'direccion', placeholder: 'Dirección' },
                { key: 'notas', placeholder: 'Notas' },
              ]}
              ListHeaderComponent={
                <>
                  <Text style={styles.fieldLabel}>Tipo de Cliente:</Text>
                  <FlatList data={TIPOS_CLIENTE} horizontal showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={[styles.chip, form.tipo === item && styles.chipActive]}
                        onPress={() => setForm({ ...form, tipo: item })}>
                        <Text style={[styles.chipText, form.tipo === item && { color: COLORS.textLight }]}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    style={{ marginBottom: 10 }}
                  />
                </>
              }
              renderItem={({ item }) => (
                <TextInput
                  style={styles.modalInput}
                  placeholder={item.placeholder}
                  placeholderTextColor={COLORS.disabled}
                  value={form[item.key]}
                  onChangeText={(v) => setForm({ ...form, [item.key]: v })}
                />
              )}
              keyExtractor={(item) => item.key}
              style={{ maxHeight: 350 }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { setModalVisible(false); resetForm(); }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: SIZES.md, color: COLORS.text },
  list: { paddingHorizontal: SIZES.padding, paddingBottom: 20 },
  patientInfo: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, padding: 20 },
  fieldLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 5, marginTop: 5, fontWeight: '500' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 6,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: SIZES.xs, color: COLORS.text },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 10,
    fontSize: SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontSize: SIZES.md, fontWeight: '600' },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { color: COLORS.textLight, fontSize: SIZES.md, fontWeight: '600' },
});

export default PatientsScreen;
