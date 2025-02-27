import { TextStyle } from 'react-native';

interface Typography {
  [key: string]: TextStyle;
}

export const Typography: Typography = {
  heading1: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 24,
    lineHeight: 36,
  },
  heading2: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 20,
    lineHeight: 28,
  },
  paragraph1: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 18,
    lineHeight: 24,
  },
  paragraph2: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  paragraph3: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  paragraph4: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  paragraph5: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 10,
    lineHeight: 16,
  },
  label1: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },
  label2: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  label3: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  label4: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  label5: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 10,
    lineHeight: 16,
  },
};
