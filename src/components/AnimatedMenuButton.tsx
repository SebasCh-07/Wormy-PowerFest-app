import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../config/colors';

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onPress: () => void;
}

export function AnimatedMenuButton({ isOpen, onPress }: AnimatedMenuButtonProps) {
  const topLineAnim = useRef(new Animated.Value(0)).current;
  const middleLineAnim = useRef(new Animated.Value(1)).current;
  const bottomLineAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      // Transformar a X
      Animated.parallel([
        Animated.timing(topLineAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(middleLineAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bottomLineAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Volver a hamburguesa
      Animated.parallel([
        Animated.timing(topLineAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(middleLineAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bottomLineAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const topLineTransform = {
    transform: [
      {
        translateY: topLineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8],
        }),
      },
      {
        rotate: topLineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const bottomLineTransform = {
    transform: [
      {
        translateY: bottomLineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        rotate: bottomLineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
    ],
  };

  const containerRotate = {
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      activeOpacity={0.7}>
      <LinearGradient
        colors={[COLORS.secondary.light, COLORS.secondary.main]}
        style={styles.gradient}>
        <Animated.View style={[styles.iconContainer, containerRotate]}>
          <Animated.View style={[styles.line, topLineTransform]} />
          <Animated.View 
            style={[
              styles.line, 
              styles.middleLine,
              { opacity: middleLineAnim }
            ]} />
          <Animated.View style={[styles.line, bottomLineTransform]} />
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  line: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary.dark,
    borderRadius: 2,
  },
  middleLine: {
    width: 20,
    alignSelf: 'center',
  },
});
