import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScanResult } from '../types';
import { COLORS } from '../config/colors';

interface ScanLogProps {
  scans: ScanResult[];
}

export function ScanLog({ scans }: ScanLogProps) {
  if (scans.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={40} color={COLORS.text.primary} />
        </View>
        <Text style={styles.emptyText}>Sin escaneos hoy</Text>
        <Text style={styles.emptySubtext}>Los escaneos aparecerán aquí</Text>
      </View>
    );
  }

  const getModeInfo = (mode: string) => {
    switch (mode) {
      case 'entrada':
        return {
          label: 'ENTRADA',
          icon: 'enter-outline' as const,
          iconLib: 'Ionicons' as const,
          description: 'Control de acceso',
        };
      case 'entrega':
        return {
          label: 'ENTREGA',
          icon: 'clipboard-text' as const,
          iconLib: 'MaterialCommunityIcons' as const,
          description: 'Pasaporte entregado',
        };
      case 'sorteo':
        return {
          label: 'SORTEO',
          icon: 'gift' as const,
          iconLib: 'Ionicons' as const,
          description: 'Participación registrada',
        };
      default:
        return {
          label: mode.toUpperCase(),
          icon: 'qrcode-scan' as const,
          iconLib: 'MaterialCommunityIcons' as const,
          description: 'Escaneo',
        };
    }
  };

  return (
    <View style={styles.container}>
      {scans.map((scan, index) => {
        const isValid = scan.status === 'valid';
        const modeInfo = getModeInfo(scan.mode);
        
        return (
          <ScanLogItem 
            key={scan.id}
            scan={scan}
            index={index}
            totalScans={scans.length}
            isValid={isValid}
            modeInfo={modeInfo}
          />
        );
      })}
    </View>
  );
}

interface ScanLogItemProps {
  scan: ScanResult;
  index: number;
  totalScans: number;
  isValid: boolean;
  modeInfo: any;
}

function ScanLogItem({ scan, index, totalScans, isValid, modeInfo }: ScanLogItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.logItemWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}>
      {isValid ? (
        <View style={[styles.logItem, styles.logItemValid]}>
          <View style={styles.compactContent}>
            <View style={styles.iconContainerValidCompact}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success.main} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.nameText} numberOfLines={1}>
                {scan.name || 'Participante'}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.modeText}>{modeInfo.label}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.timeText}>{scan.timestamp}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.logItem, styles.logItemInvalid]}>
          <View style={styles.compactContent}>
            <View style={styles.iconContainerInvalidCompact}>
              <Ionicons name="close-circle" size={20} color={COLORS.error.main} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.nameTextInvalid} numberOfLines={1}>
                {scan.name || 'Error de escaneo'}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.modeTextInvalid}>{modeInfo.label}</Text>
                <Text style={styles.separatorInvalid}>•</Text>
                <Text style={styles.timeTextInvalid}>{scan.timestamp}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.text.primary,
    opacity: 0.6,
  },
  logItemWrapper: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logItem: {
    backgroundColor: COLORS.neutral.white,
    padding: 12,
  },
  logItemValid: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success.main,
  },
  logItemInvalid: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error.main,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainerValidCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerInvalidCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.error.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  nameTextInvalid: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error.main,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modeTextInvalid: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 12,
    color: COLORS.text.primary,
    opacity: 0.4,
    marginHorizontal: 6,
  },
  separatorInvalid: {
    fontSize: 12,
    color: COLORS.error.main,
    opacity: 0.4,
    marginHorizontal: 6,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text.primary,
    opacity: 0.7,
    fontFamily: 'monospace',
  },
  timeTextInvalid: {
    fontSize: 12,
    color: COLORS.error.main,
    opacity: 0.7,
    fontFamily: 'monospace',
  },
});
