import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Drawer } from './src/components/Drawer';
import { ScannerView } from './src/components/ScannerView';
import { HistoryView } from './src/components/HistoryView';
import { AnimatedMenuButton } from './src/components/AnimatedMenuButton';
import { Mode, ScanResult } from './src/types';
import { COLORS } from './src/config/colors';

type ViewType = 'scanner' | 'history';

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('scanner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scans, setScans] = useState<ScanResult[]>([]);

  // Animaciones para la pantalla de inicio
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de flotación para los círculos
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -25,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de rotación sutil
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleScan = (result: ScanResult) => {
    setScans((prev) => [result, ...prev]);
  };

  const handleSelectMode = (mode: Mode) => {
    setActiveMode(mode);
    setActiveView('scanner');
    setDrawerOpen(false);
  };

  const handleViewHistory = () => {
    setActiveView('history');
    setDrawerOpen(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <LinearGradient
          colors={['#F8F9FA', '#FFFFFF']}
          style={styles.header}>
          <AnimatedMenuButton 
            isOpen={drawerOpen}
            onPress={() => setDrawerOpen(true)}
          />

          <View style={styles.headerCenter}>
            <Image 
              source={require('./assets/logo-header.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerRight} />
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.main}>
          {activeView === 'history' ? (
            <HistoryView scans={scans} />
          ) : activeMode ? (
            <ScannerView
              mode={activeMode}
              scans={scans}
              onScan={handleScan}
            />
          ) : (
            <View style={styles.emptyState}>
              {/* Círculos flotantes de fondo */}
              <Animated.View 
                style={[
                  styles.floatingCircle,
                  styles.circle1,
                  { transform: [{ translateY: floatAnim1 }] }
                ]} />
              <Animated.View 
                style={[
                  styles.floatingCircle,
                  styles.circle2,
                  { transform: [{ translateY: floatAnim2 }] }
                ]} />
              <Animated.View 
                style={[
                  styles.floatingCircle,
                  styles.circle3,
                  { transform: [{ translateY: floatAnim3 }] }
                ]} />

              {/* Icono principal con animación */}
              <Animated.View 
                style={[
                  styles.emptyIconContainer,
                  { transform: [{ scale: scaleAnim }] }
                ]}>
                <LinearGradient
                  colors={[COLORS.primary.main, COLORS.primary.dark]}
                  style={styles.emptyIcon}>
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <MaterialCommunityIcons name="qrcode-scan" size={60} color={COLORS.neutral.white} />
                  </Animated.View>
                </LinearGradient>
                <View style={styles.emptyIconRing} />
                <View style={styles.emptyIconRing2} />
              </Animated.View>
              
              <Text style={styles.emptyTitle}>Listo para Escanear</Text>
              <Text style={styles.emptyText}>
                Abre el menú y selecciona un modo para comenzar
              </Text>
              
              <TouchableOpacity
                onPress={() => setDrawerOpen(true)}
                style={styles.emptyButtonContainer}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[COLORS.primary.main, COLORS.primary.dark]}
                  style={styles.emptyButton}>
                  <Ionicons name="menu" size={20} color={COLORS.neutral.white} style={styles.buttonIcon} />
                  <Text style={styles.emptyButtonText}>ABRIR MENÚ</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.featuresContainer}>
                <Animated.View 
                  style={[
                    styles.featureItem,
                    { transform: [{ translateY: floatAnim2 }] }
                  ]}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="enter-outline" size={20} color={COLORS.secondary.main} />
                  </View>
                  <Text style={styles.featureText}>Control de Entrada</Text>
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.featureItem,
                    { transform: [{ translateY: floatAnim3 }] }
                  ]}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={20} color={COLORS.secondary.main} />
                  </View>
                  <Text style={styles.featureText}>Entrega de Pasaporte</Text>
                </Animated.View>
              </View>
            </View>
          )}
        </View>

        {/* Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          onViewHistory={handleViewHistory}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary.light,
    shadowColor: COLORS.shadow.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 50,
    width: 200,
  },
  headerRight: {
    width: 48,
  },
  main: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.background.default,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.primary.main,
    top: 50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.secondary.main,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary.light,
    top: 200,
    left: 30,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 32,
    zIndex: 10,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyIconRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.secondary.light,
    top: -10,
    left: -10,
    opacity: 0.5,
  },
  emptyIconRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.secondary.lighter,
    top: -20,
    left: -20,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary.main,
    marginBottom: 12,
    letterSpacing: -0.5,
    zIndex: 10,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.text.primary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 32,
    lineHeight: 22,
    zIndex: 10,
  },
  emptyButtonContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 40,
    zIndex: 10,
  },
  emptyButton: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 20,
    zIndex: 10,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.secondary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondary.light,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 80,
  },
});
