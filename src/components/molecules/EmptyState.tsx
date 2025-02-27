import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@/config/constant';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('assets/noData.png')}
        resizeMode="center"
      />
      <Text style={Typography.label2}>{title}</Text>
      <Text
        style={{
          ...Typography.paragraph3,
          color: Colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 8,
    height: 200,
    width: 200,
    resizeMode: 'center',
  },
});
