import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { formatCurrency } from '../utils/helpers';
import { AREAS_DERECHO } from '../utils/constants';

const DentalCalculatorsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('costos');
  const [results, setResults] = useState(null);

  const [costosForm, setCostosForm] = useState({
    servicio: 'Consulta Jurídica', cantidad: '1',
  });

  const [presupuestoForm, setPresupuestoForm] = useState({
    concepto: '', cantidad: '1', precioUnitario: '', descuento: '0',
  });

  const [presupuestos, setPresupuestos] = useState([]);

  const CALCULATOR_TABS = [
    { key: 'costos', label: 'Honorarios', icon: '💰' },
    { key: 'presupuesto', label: 'Presupuesto', icon: '📝' },
    { key: 'referencia', label: 'Referencia', icon: '📋' },
  ];

  const honorariosRef = {
    'Consulta Jurídica': 100, 'Redacción de Documentos': 150,
    'Contratos': 200, 'Litigio Civil': 500, 'Litigio Penal': 750,
    'Litigio Laboral': 500, 'Derecho Comercial': 600,
    'Derecho Administrativo': 500, 'Derecho de Familia': 400,
    'Sucesiones': 600, 'Propiedad Intelectual': 700,
    'Constitución de Sociedades': 500, 'Debida Diligencia': 800,
  };

  const handleCalculateCost = () => {
    const precio = honorariosRef[costosForm.servicio] || 0;
    const total = precio * parseInt(costosForm.cantidad || 1);
    setResults({
      type: 'costos',
      data: {
        servicio: costosForm.servicio,
        cantidad: parseInt(costosForm.cantidad),
        precioUnitario: precio,
        total,
      },
    });
  };

  const addToPresupuesto = () => {
    if (!presupuestoForm.precioUnitario) {
      Alert.alert('Error', 'Precio unitario requerido');
      return;
    }
    const item = {
      id: Date.now().toString(),
      concepto: presupuestoForm.concepto || `Item ${presupuestos.length + 1}`,
      cantidad: parseInt(presupuestoForm.cantidad || 1),
      precioUnitario: parseFloat(presupuestoForm.precioUnitario),
    };
    setPresupuestos([...presupuestos, item]);
    setPresupuestoForm({ concepto: '', cantidad: '1', precioUnitario: '', descuento: '0' });
  };

  const calcularPresupuesto = () => {
    const subtotal = presupuestos.reduce((s, p) => s + p.cantidad * p.precioUnitario, 0);
    const descuento = parseFloat(presupuestoForm.descuento || 0);
    const total = subtotal - descuento;
    setResults({
      type: 'presupuesto',
      data: { items: presupuestos, subtotal, descuento, total },
    });
  };

  const renderCostosForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Seleccione Servicio:</Text>
      <View style={styles.chipRow}>
        {Object.keys(honorariosRef).map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, costosForm.servicio === t && styles.chipActive]}
            onPress={() => setCostosForm({ ...costosForm, servicio: t })}>
            <Text style={[styles.chipText, costosForm.servicio === t && { color: COLORS.textLight }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Cantidad" keyboardType="numeric"
        value={costosForm.cantidad} onChangeText={(v) => setCostosForm({ ...costosForm, cantidad: v })} />
    </View>
  );

  const renderPresupuestoForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Agregar Item al Presupuesto:</Text>
      <TextInput style={styles.input} placeholder="Concepto"
        value={presupuestoForm.concepto} onChangeText={(v) => setPresupuestoForm({ ...presupuestoForm, concepto: v })} />
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Cantidad" keyboardType="numeric"
          value={presupuestoForm.cantidad} onChangeText={(v) => setPresupuestoForm({ ...presupuestoForm, cantidad: v })} />
        <TextInput style={[styles.input, { flex: 1, marginLeft: 8 }]} placeholder="Precio Unit. *" keyboardType="decimal-pad"
          value={presupuestoForm.precioUnitario} onChangeText={(v) => setPresupuestoForm({ ...presupuestoForm, precioUnitario: v })} />
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={addToPresupuesto}>
        <Text style={styles.addBtnText}>+ Agregar Item</Text>
      </TouchableOpacity>

      {presupuestos.length > 0 && (
        <>
          <Text style={styles.fieldLabel}>Items agregados ({presupuestos.length})</Text>
          {presupuestos.map((item, i) => (
            <View key={item.id} style={styles.presupuestoItem}>
              <Text style={styles.presupuestoText}>
                {item.concepto} x{item.cantidad} = {formatCurrency(item.cantidad * item.precioUnitario)}
              </Text>
            </View>
          ))}
          <TextInput style={styles.input} placeholder="Descuento (B/.)" keyboardType="decimal-pad"
            value={presupuestoForm.descuento} onChangeText={(v) => setPresupuestoForm({ ...presupuestoForm, descuento: v })} />
        </>
      )}
    </View>
  );

  const renderReferencia = () => (
    <View>
      <Text style={styles.fieldLabel}>Precios de Referencia:</Text>
      {Object.entries(honorariosRef).map(([key, val]) => (
        <View key={key} style={styles.refRow}>
          <Text style={styles.refLabel}>{key}</Text>
          <Text style={styles.refValue}>B/. {val}</Text>
        </View>
      ))}
    </View>
  );

  const renderResults = () => {
    if (!results) return null;
    const { type, data } = results;

    const renderRow = (label, value) => (
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>{label}</Text>
        <Text style={styles.resultValue}>{value}</Text>
      </View>
    );

    if (type === 'costos') {
      return (
        <Card title="Cálculo de Costos" icon="💰" titleColor={COLORS.primary}>
          {renderRow('Servicio', data.servicio)}
          {renderRow('Cantidad', data.cantidad)}
          {renderRow('Precio Unitario', formatCurrency(data.precioUnitario))}
          <View style={styles.divider} />
          {renderRow('TOTAL', formatCurrency(data.total))}
          {data.precioReferencia && (
            <Text style={styles.refNote}>Ref. mercado: {data.precioReferencia}</Text>
          )}
        </Card>
      );
    }

    if (type === 'presupuesto') {
      return (
        <Card title="Presupuesto Total" icon="📝" titleColor={COLORS.primary}>
          {data.items.map((item, i) => (
            <View key={i} style={styles.resultRow}>
              <Text style={styles.resultLabel}>{item.concepto} x{item.cantidad}</Text>
              <Text style={styles.resultValue}>{formatCurrency(item.cantidad * item.precioUnitario)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          {renderRow('Subtotal', formatCurrency(data.subtotal))}
          {data.descuento > 0 && renderRow('Descuento', `-${formatCurrency(data.descuento)}`)}
          {renderRow('TOTAL', formatCurrency(data.total))}
        </Card>
      );
    }

    return null;
  };

  const forms = {
    costos: renderCostosForm,
    presupuesto: renderPresupuestoForm,
    referencia: renderReferencia,
  };

  const calculate = {
    costos: handleCalculateCost,
    presupuesto: calcularPresupuesto,
    referencia: () => setResults(null),
  };

  return (
    <View style={styles.container}>
      <Header title="Calculadoras" onBack={() => navigation.goBack()} />
      <View style={styles.tabRow}>
        {CALCULATOR_TABS.map((tab) => (
          <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => { setActiveTab(tab.key); setResults(null); }}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Card title={CALCULATOR_TABS.find((t) => t.key === activeTab)?.label} icon={CALCULATOR_TABS.find((t) => t.key === activeTab)?.icon}>
          {forms[activeTab]()}
          {activeTab !== 'referencia' && (
            <TouchableOpacity style={styles.calcBtn} onPress={calculate[activeTab]}>
              <Text style={styles.calcBtnText}>
                {activeTab === 'presupuesto' ? 'Calcular Presupuesto' : 'Calcular'}
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {renderResults()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    paddingVertical: 8, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary + '15' },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
  formContainer: { padding: SIZES.padding, paddingBottom: 40 },
  input: {
    backgroundColor: COLORS.background, borderRadius: 10, paddingHorizontal: 15,
    height: 45, marginBottom: 10, fontSize: SIZES.md, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  fieldLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 6, marginTop: 4, fontWeight: '500' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 6 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: SIZES.xs, color: COLORS.text },
  row: { flexDirection: 'row' },
  addBtn: {
    backgroundColor: COLORS.primaryLight, borderRadius: 10, height: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  addBtnText: { color: COLORS.textLight, fontSize: SIZES.sm, fontWeight: '600' },
  presupuestoItem: {
    backgroundColor: COLORS.background, borderRadius: 8, padding: 10, marginBottom: 6,
  },
  presupuestoText: { fontSize: SIZES.sm, color: COLORS.text },
  calcBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12, height: 48,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
  },
  calcBtnText: { color: COLORS.textLight, fontSize: SIZES.md, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
  },
  resultLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  resultValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text },
  refNote: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 4, fontStyle: 'italic' },
  refRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  refLabel: { fontSize: SIZES.sm, color: COLORS.text, flex: 1 },
  refValue: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '500' },
});

export default DentalCalculatorsScreen;
