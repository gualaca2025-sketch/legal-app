import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Modal, Linking,
} from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { CATEGORIAS_LEYES, LEYES_PANAMA } from '../utils/constants';

const GACETA_URL = 'https://www.gacetaoficial.gob.pa/';

const LeyesScreen = ({ navigation }) => {
  const [selectedCategoria, setSelectedCategoria] = useState('Constitución');
  const [search, setSearch] = useState('');
  const [selectedLey, setSelectedLey] = useState(null);

  const leyes = selectedCategoria
    ? LEYES_PANAMA[selectedCategoria] || []
    : Object.values(LEYES_PANAMA).flat();

  const filtered = leyes.filter((l) =>
    `${l.nombre} ${l.numero} ${l.descripcion}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirDocumento = (url) => {
    Linking.openURL(url || GACETA_URL).catch(() => {
      Linking.openURL(GACETA_URL);
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Leyes Vigentes" subtitle="República de Panamá"
        onBack={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Buscar ley..."
          value={search} onChangeText={setSearch} placeholderTextColor={COLORS.disabled} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        {CATEGORIAS_LEYES.map((cat) => (
          <TouchableOpacity key={cat}
            style={[styles.chip, selectedCategoria === cat && styles.chipActive]}
            onPress={() => setSelectedCategoria(cat)}>
            <Text style={[styles.chipText, selectedCategoria === cat && { color: COLORS.textLight }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.countText}>{filtered.length} ley(es) encontrada(s)</Text>

      <FlatList data={filtered} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedLey(item)}>
          <Card icon="⚖️" title={item.nombre} subtitle={item.numero}>
            <Text style={styles.descripcion} numberOfLines={2}>{item.descripcion}</Text>
            <Text style={styles.expandHint}>Tocar para ver documento</Text>
          </Card>
        </TouchableOpacity>
      )} keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card><Text style={styles.emptyText}>No se encontraron leyes</Text></Card>
        } />

      <Modal visible={!!selectedLey} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            {selectedLey && (
              <>
                <Text style={styles.modalIcon}>⚖️</Text>
                <Text style={styles.modalTitle}>{selectedLey.nombre}</Text>
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>{selectedCategoria}</Text>
                </View>
                <Text style={styles.modalNumero}>{selectedLey.numero}</Text>
                <Text style={styles.modalDescripcion}>{selectedLey.descripcion}</Text>

                <TouchableOpacity style={styles.docBtn}
                  onPress={() => abrirDocumento(selectedLey.url)}>
                  <Text style={styles.docBtnIcon}>📄</Text>
                  <Text style={styles.docBtnText}>Abrir Documento</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.goBtn}
                  onPress={() => Linking.openURL(GACETA_URL)}>
                  <Text style={styles.goBtnIcon}>🔍</Text>
                  <Text style={styles.goBtnText}>Buscar en Gaceta Oficial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn}
                  onPress={() => setSelectedLey(null)}>
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
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
  chipsRow: { paddingHorizontal: SIZES.padding, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 6,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: SIZES.xs, color: COLORS.text, fontWeight: '600' },
  countText: { fontSize: SIZES.xs, color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, marginBottom: 4 },
  list: { paddingHorizontal: SIZES.padding, paddingBottom: 20 },
  descripcion: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  expandHint: { fontSize: SIZES.xs, color: COLORS.disabled, marginTop: 4, fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, padding: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 25, maxHeight: '80%',
  },
  modalIcon: { fontSize: 50, textAlign: 'center', marginBottom: 10 },
  modalTitle: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 8 },
  modalBadge: {
    alignSelf: 'center', backgroundColor: COLORS.primary + '20', paddingHorizontal: 14,
    paddingVertical: 4, borderRadius: 12, marginBottom: 8,
  },
  modalBadgeText: { fontSize: SIZES.xs, color: COLORS.primary, fontWeight: '600' },
  modalNumero: { fontSize: SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 12 },
  modalDescripcion: { fontSize: SIZES.md, color: COLORS.text, lineHeight: 22, marginBottom: 20 },
  docBtn: {
    flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  docBtnIcon: { fontSize: 20, marginRight: 8 },
  docBtnText: { color: COLORS.textLight, fontSize: SIZES.md, fontWeight: '600' },
  goBtn: {
    flexDirection: 'row', borderRadius: 12, height: 50, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  goBtnIcon: { fontSize: 16, marginRight: 8 },
  goBtnText: { color: COLORS.textSecondary, fontSize: SIZES.md, fontWeight: '500' },
  closeBtn: { alignItems: 'center', paddingVertical: 12 },
  closeBtnText: { color: COLORS.disabled, fontSize: SIZES.md },
});

export default LeyesScreen;
