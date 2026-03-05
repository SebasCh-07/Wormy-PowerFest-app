import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedBackground } from './AnimatedBackground';
import { getStats, StatsResponse } from '../services/scanService';
import { COLORS } from '../config/colors';

export function StatsView() {
  const [stats, setStats] = useState<StatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadStats();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      loadStats(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [stats]);

  const loadStats = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await getStats();
      
      if (response.success && response.data) {
        setStats(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <AnimatedBackground />
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </View>
    );
  }

  if (error && !stats) {
    return (
      <View style={styles.container}>
        <AnimatedBackground />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.primary.main} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => loadStats()} style={styles.retryButtonContainer}>
            <LinearGradient
              colors={[COLORS.primary.main, COLORS.primary.dark]}
              style={styles.retryButton}>
              <Ionicons name="refresh" size={20} color={COLORS.neutral.white} />
              <Text style={styles.retryButtonText}>REINTENTAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary.main]}
            tintColor={COLORS.primary.main}
          />
        }>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <MaterialCommunityIcons name="chart-box" size={28} color={COLORS.primary.main} />
            <Text style={styles.headerTitle}>Estadísticas en Tiempo Real</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {stats?.date && new Date(stats.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {stats?.last_updated && (
            <Text style={styles.lastUpdated}>
              Última actualización: {formatLastUpdated(stats.last_updated)}
            </Text>
          )}
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          {/* Total General */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN GENERAL</Text>
            <View style={styles.totalCard}>
              <LinearGradient
                colors={[COLORS.primary.main, COLORS.primary.dark]}
                style={styles.totalCardGradient}>
                <MaterialCommunityIcons name="qrcode-scan" size={48} color={COLORS.neutral.white} />
                <Text style={styles.totalValue}>
                  {((stats?.by_mode.entrega || 0) + (stats?.by_mode.sorteo || 0))}
                </Text>
                <Text style={styles.totalLabel}>ESCANEOS TOTALES</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Escaneos por Modo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ESCANEOS POR MODO</Text>
            <View style={styles.cardsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="clipboard-text" size={28} color="#FF9800" />
                </View>
                <Text style={styles.statValue}>{stats?.by_mode.entrega || 0}</Text>
                <Text style={styles.statLabel}>Entrada y Entrega</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FCE4EC' }]}>
                  <Ionicons name="gift" size={28} color="#E91E63" />
                </View>
                <Text style={styles.statValue}>{stats?.by_mode.sorteo || 0}</Text>
                <Text style={styles.statLabel}>Sorteo</Text>
              </View>
            </View>
          </View>

          {/* Participantes en Sorteo */}
          {stats?.sorteo_participants !== undefined && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SORTEO</Text>
              <View style={styles.sorteoCard}>
                <LinearGradient
                  colors={['#FCD34D', '#F59E0B']}
                  style={styles.sorteoCardGradient}>
                  <MaterialCommunityIcons name="trophy" size={48} color={COLORS.primary.dark} />
                  <Text style={styles.sorteoValue}>{stats.sorteo_participants}</Text>
                  <Text style={styles.sorteoLabel}>PARTICIPANTES REGISTRADOS</Text>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Botón de Actualización Manual */}
          <View style={styles.refreshSection}>
            <TouchableOpacity
              onPress={() => loadStats()}
              disabled={loading}
              style={styles.refreshButtonContainer}>
              <LinearGradient
                colors={[COLORS.secondary.main, COLORS.secondary.dark]}
                style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color={COLORS.primary.dark} />
                <Text style={styles.refreshButtonText}>ACTUALIZAR AHORA</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.autoRefreshText}>
              Actualización automática cada 30 segundos
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 64,
    height: 64,
    borderWidth: 4,
    borderColor: COLORS.primary.main,
    borderTopColor: 'transparent',
    borderRadius: 32,
    marginBottom: 16,
  },
  loadingText: {
    color: COLORS.primary.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary.main,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  retryButtonText: {
    color: COLORS.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary.light,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary.main,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
    opacity: 0.7,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 10,
    color: COLORS.text.primary,
    opacity: 0.5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  totalCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  totalCardGradient: {
    padding: 32,
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginTop: 12,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    letterSpacing: 2,
    opacity: 0.9,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.primary,
    fontWeight: '600',
    opacity: 0.7,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statusCardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginTop: 8,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  sorteoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sorteoCardGradient: {
    padding: 32,
    alignItems: 'center',
  },
  sorteoValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginTop: 12,
    marginBottom: 4,
  },
  sorteoLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    letterSpacing: 1.5,
    opacity: 0.9,
    textAlign: 'center',
  },
  refreshSection: {
    padding: 20,
    alignItems: 'center',
  },
  refreshButtonContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  refreshButtonText: {
    color: COLORS.primary.dark,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  autoRefreshText: {
    fontSize: 11,
    color: COLORS.text.primary,
    opacity: 0.5,
    textAlign: 'center',
  },
});
