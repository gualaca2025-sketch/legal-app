import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Modal,
} from 'react-native';
import { onAuthChange } from '../../firebase/auth';
import { createDocument, updateDocument, deleteDocument, subscribeToCollection } from '../services/firestoreService';
import Card from '../components/Card';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { TIPOS_SERVICIO } from '../utils/constants';

const ServicesScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    nombre: '', tipo: 'Consulta Jurídica', precio: '', descripcion: '', notas: '',
  });

  useEffect(() => {
    const unsubAuth = onAuthChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const unsubServices = subscribeToCollection('servicios', (data) => {
          setServices(data);
        }, [{ field: 'doctorId', operator: '==', value: currentUser.uid }]);
        return unsubServices;
      }
    });
    return unsubAuth;
  }, []);

  const filtered = services.filter((s) =>
    `${s.nombre} ${s.tipo} ${s.descripcion || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ nombre: '', tipo: 'Consulta Jurídica', precio: '', duracion: '', descripcion: '', notas: '' });
    setEditingService(null);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setForm({
      nombre: service.nombre || '',
      tipo: service.tipo || 'Consulta Jurídica',
      precio: service.precio?.toString() || '',
      duracion: service.duracion?.toString() || '',
      descripcion: service.descripcion || '',
      notas: service.notas || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.precio) {
      Alert.alert('Error', 'Nombre y precio son obligatorios');
      return;
    }
    const data = { ...form, precio: parseFloat(form.precio) };
    if (editingService) {
      await updateDocument('servicios', editingService.id, data);
    } else {
      await createDocument('servicios', { ...data, doctorId: user.uid });
    }
    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar Servicio', '¿Está seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteDocument('servicios', id) },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openEdit(item)} onLongPress={() => handleDelete(item.id)}>
      <Card icon="🛠️" title={item.nombre} subtitle={`B/. ${item.precio}`} badge={item.tipo}>
        <Text style={styles.servInfo}>
          {item.duracion ? `Duración: ${item.duracion} min · ` : ''}{item.descripcion || ''}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Servicios Legales" subtitle={`${services.length} registrados`}
        onBack={() => navigation.goBack()}
        rightAction={() => { resetForm(); setModalVisible(true); }} rightIcon="+" />

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Buscar servicio..." value={search}
          onChangeText={setSearch} placeholderTextColor={COLORS.disabled} />
      </View>

      <FlatList data={filtered} renderItem={renderItem} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Card><Text style={styles.emptyText}>No hay servicios registrados</Text></Card>} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <FlatList style={styles.modalContent}
            data={[
              { key: 'nombre', placeholder: 'Nombre del Servicio *' },
              { key: 'precio', placeholder: 'Precio (B/.) *', keyboardType: 'decimal-pad' },
              { key: 'duracion', placeholder: 'Duración (minutos)', keyboardType: 'numeric' },
              { key: 'descripcion', placeholder: 'Descripción' },
              { key: 'notas', placeholder: 'Notas' },
            ]}
            ListHeaderComponent={
              <>
                <Text style={styles.modalTitle}>
                  {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                </Text>
                <Text style={styles.fieldLabel}>Tipo de Servicio:</Text>
                <FlatList data={TIPOS_SERVICIO} horizontal showsHorizontalScrollIndicator={false}
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
              <TextInput style={styles.input} placeholder={item.placeholder}
                placeholderTextColor={COLORS.disabled}
                value={form[item.key]} onChangeText={(v) => setForm({ ...form, [item.key]: v })}
                keyboardType={item.keyboardType || 'default'} />
            )}
            keyExtractor={(item) => item.key}
            ListFooterComponent={
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn}
                  onPress={() => { setModalVisible(false); resetForm(); }}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    margin: SIZES.padding, borderRadius: 12, paddingHorizontal: 12, height: 45,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: SIZES.md, color: COLORS.text },
  list: { paddingHorizontal: SIZES.padding, paddingBottom: 20 },
  servInfo: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, padding: 20 },
  fieldLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '500' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 6,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: SIZES.xs, color: COLORS.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 25, maxHeight: '80%',
  },
  modalTitle: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  input: {
    backgroundColor: COLORS.background, borderRadius: 10, paddingHorizontal: 15,
    height: 45, marginBottom: 10, fontSize: SIZES.md, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalButtons: { flexDirection: 'row', marginTop: 15, gap: 10 },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 1,
    borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontSize: SIZES.md, fontWeight: '600' },
  saveBtn: {
    flex: 1, height: 48, borderRadius: 12, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  saveText: { color: COLORS.textLight, fontSize: SIZES.md, fontWeight: '600' },
});

export default ServicesScreen;
