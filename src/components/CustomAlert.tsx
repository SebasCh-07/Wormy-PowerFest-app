import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
        return <Ionicons name="checkmark-circle" size={64} color="#5FFBF1" />;
      case 'error':
        return <Ionicons name="close-circle" size={64} color="#B50095" />;
      case 'info':
        return <Ionicons name="information-circle" size={64} color="#800080" />;
      case 'confirm':
        return <MaterialCommunityIcons name="help-circle" size={64} color="#800080" />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return '#E5FFFE';
      case 'error':
        return '#FFE5F3';
      case 'info':
      case 'confirm':
        return '#F5F0FF';
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
                colors={['#B50095', '#800080']}
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
    backgroundColor: 'rgba(128, 0, 128, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 2,
    borderColor: '#5FFBF1',
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
    color: '#B50095',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#800080',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#800080',
  },
  confirmButtonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#B50095',
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
    color: '#FFFFFF',
  },
});
