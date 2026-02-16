import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Drawer } from './src/components/Drawer';
import { ScannerView } from './src/components/ScannerView';
import { HistoryView } from './src/components/HistoryView';
import { Mode, ScanResult } from './src/types';

type ViewType = 'scanner' | 'history';

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('scanner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scans, setScans] = useState<ScanResult[]>([]);

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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerOpen(true)}
            style={styles.menuButton}
            accessibilityLabel="Open menu">
            <Ionicons name="menu" size={28} color="#800080" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image 
              source={require('./assets/logo-header.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerRight} />
        </View>

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
              <LinearGradient
                colors={['#B50095', '#800080']}
                style={styles.emptyIcon}>
                <MaterialCommunityIcons name="qrcode-scan" size={60} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={styles.emptyTitle}>Sistema Listo</Text>
              <Text style={styles.emptyText}>
                Selecciona un modo de escaneo desde el menú para comenzar las operaciones
              </Text>
              
              <TouchableOpacity
                onPress={() => setDrawerOpen(true)}
                style={styles.emptyButtonContainer}>
                <LinearGradient
                  colors={['#B50095', '#800080']}
                  style={styles.emptyButton}>
                  <Ionicons name="menu" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.emptyButtonText}>ABRIR MENÚ</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#5FFBF1',
    shadowColor: '#5FFBF1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#5FFBF1',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#FFFFFF',
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#B50095',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B50095',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#800080',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 40,
    lineHeight: 24,
  },
  emptyButtonContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#B50095',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
