import type { TextStyle } from 'react-native';

type TextToken = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>;

export const typography = {
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  hint: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  error: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
} satisfies Record<string, TextToken>;
