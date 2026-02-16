import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScanResult } from '../types';

interface ResultBannerProps {
  result: ScanResult | null;
}

export function ResultBanner({ result }: ResultBannerProps) {
  if (!result) return <View style={styles.spacer} />;

  const isValid = result.status === 'valid';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isValid ? ['#5FFBF1', '#5FFBF1'] : ['#B50095', '#800080']}
        style={styles.banner}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isValid ? "checkmark-circle" : "close-circle"} 
              size={32} 
              color="#800080" 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.statusText}>
              {isValid ? 'VÁLIDO' : 'INVÁLIDO'}
            </Text>
            <Text style={styles.dataText}>{result.data}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.timeText}>{result.timestamp}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: 80,
  },
  container: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#B50095',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 12,
    color: '#800080',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#800080',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
