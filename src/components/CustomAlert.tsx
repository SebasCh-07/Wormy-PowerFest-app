import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../config/colors';

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error' | 'info' | 'confirm';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CustomAlert({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
}: CustomAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={64} color={COLORS.success.main} />;
      case 'error':
        return <Ionicons name="close-circle" size={64} color={COLORS.error.main} />;
      case 'info':
        return <Ionicons name="information-circle" size={64} color={COLORS.primary.main} />;
      case 'confirm':
        return <MaterialCommunityIcons name="help-circle" size={64} color={COLORS.primary.main} />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return COLORS.success.light;
      case 'error':
        return COLORS.error.light;
      case 'info':
      case 'confirm':
        return COLORS.primary.lighter;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
            {getIcon()}
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {type === 'confirm' && (
              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButtonWrapper}
                activeOpacity={0.8}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onConfirm || onClose}
              style={styles.confirmButtonWrapper}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[COLORS.primary.main, COLORS.primary.dark]}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(107, 15, 127, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary.light,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary.main,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButtonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    paddingVertical: 14,
    backgroundColor: COLORS.neutral.gray100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral.gray300,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  confirmButtonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text.white,
  },
});
