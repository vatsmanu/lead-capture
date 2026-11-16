import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../tokens';

export type FieldProps = {
  /** Omit when the control renders its own label (checkbox). */
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/** Label, control, hint and error. The error replaces the hint while it is shown. */
export function Field({ label, required = false, hint, error, children }: FieldProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: typography.label.fontWeight,
  },
  required: {
    color: colors.error,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.hint.fontSize,
    lineHeight: typography.hint.lineHeight,
  },
  error: {
    color: colors.error,
    fontSize: typography.error.fontSize,
    lineHeight: typography.error.lineHeight,
    fontWeight: typography.error.fontWeight,
  },
});
