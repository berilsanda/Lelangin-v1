import { Colors, Spacing, Typography } from '@/config/constant';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface BannerProps {
  title?: string;
  description: string;
  type: 'success' | 'error' | 'info';
  style?: ViewStyle
}

const Banner= React.forwardRef<any, BannerProps>(({
  title,
  description,
  type = 'info',
  style: AddOnStyle
}, ref) => {
  let bannerColor = Colors.textSecondary;

  switch (type) {
    case 'success':
      bannerColor = Colors.success;
      break;
    case 'error':
      bannerColor = Colors.warning;
      break;
    default:
      bannerColor;
      break;
  }

  return (
    <View ref={ref} style={[styles.container, { borderColor: bannerColor }, AddOnStyle]}>
      {title && (
        <Text style={[Typography.label3, { color: bannerColor }]}>{title}</Text>
      )}
      <Text style={[Typography.label4, { color: bannerColor }]}>
        {description}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Spacing.s,
    borderWidth: 1,
  },
});


export default Banner