import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { getCurrentUser, getUserProfile, logoutUser } from '../../firebase/auth';
import { getDashboardStats, subscribeToCollection } from '../services/firestoreService';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Header from '../components/Header';
import { COLORS, SIZES } from '../utils/theme';
import { formatCurrency, parseDate } from '../utils/helpers';

const QUICK_ACTIONS = [
  { key: 'Patients', icon: '👥', label: 'Clientes', color: '#1976D2' },
  { key: 'ClinicalHistories', icon: '📋', label: 'Expedientes', color: '#388E3C' },
  { key: 'Appointments', icon: '📅', label: 'Citas', color: '#F57C00' },
  { key: 'Payments', icon: '💰', label: 'Cobros', color: '#D32F2F' },
  { key: 'Calculators', icon: '🧮', label: 'Calculadoras', color: '#7B1FA2' },
  { key: 'Services', icon: '⚖️', label: 'Servicios', color: '#1A237E' },
  { key: 'Chat', icon: '💬', label: 'Chatbot', color: '#00897B' },
  { key: 'Leyes', icon: '📜', label: 'Leyes', color: '#5D4037' },
  { key: 'Reports', icon: '📊', label: 'Reportes', color: '#3E2723' },
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proximasCitas, setProximasCitas] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
      setLoading(false);
    }, 8000);

    (async () => {
      const currentUser = await getCurrentUser();
      clearTimeout(timer);
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        setInitializing(false);
        loadProfile(currentUser.uid);
        loadStats(currentUser.uid);
        loadProximasCitas(currentUser.uid);
      } else {
        setLoading(false);
        setInitializing(false);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  const loadProfile = async (uid) => {
    const result = await getUserProfile(uid);
    if (result.success) setProfile(result.data);
  };

  const loadStats = async (userId) => {
    try {
      const result = await getDashboardStats(userId);
      if (result.success) setStats(result.data);
    } catch (e) {
      console.warn('Error loading stats:', e);
    }
    setLoading(false);
  };

  const loadProximasCitas = (userId) => {
    try {
      const unsubscribe = subscribeToCollection('citas', (citas) => {
        const pendientes = citas
          .filter((c) => c.estado === 'pendiente')
          .sort((a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0))
          .slice(0, 3);
        setProximasCitas(pendientes);
      }, [{ field: 'doctorId', operator: '==', value: userId }]);
      return unsubscribe;
    } catch (e) {
      console.warn('Error loading citas:', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await loadStats(user.uid);
    }
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro de cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  if (initializing || loading) return <Loading message="Cargando aplicación..." />;
  if (!user) {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    return null;
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Hola, ${profile?.nombre || profile?.displayName || user?.email?.split('@')[0] || 'Usuario'}`}
        subtitle={profile?.rol ? `Rol: ${profile.rol}` : 'Abogado'}
        rightIcon="Salir" rightBtnColor={COLORS.headerBg} rightIconSize={16}
        rightAction={handleLogout}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>{stats?.totalPacientes || 0}</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statNumber}>{stats?.totalHistorias || 0}</Text>
            <Text style={styles.statLabel}>Expedientes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statNumber}>{stats?.citasPendientes || 0}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNumber}>
              {formatCurrency(stats?.cobrosDelMes || 0)}
            </Text>
            <Text style={styles.statLabel}>Del Mes</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.quickAction}
              onPress={() => navigation.navigate(action.key)}
            >
              <View style={[styles.actionIconBg, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {proximasCitas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            {proximasCitas.map((cita) => (
              <Card key={cita.id} icon="📅" title={cita.titulo || cita.pacienteNombre}>
                <Text style={styles.citaDetail}>
                    Cliente: {cita.pacienteNombre} | {parseDate(cita.fecha)?.toLocaleDateString('es-PA')} - {cita.hora}
                </Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: { fontSize: 28 },
  statNumber: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },
  statLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIconBg: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: { fontSize: 26 },
  actionLabel: {
    fontSize: SIZES.xs,
    color: COLORS.text,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '700',
  },
  citaDetail: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default HomeScreen;
