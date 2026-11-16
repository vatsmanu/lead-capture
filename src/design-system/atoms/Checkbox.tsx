import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, sizes, spacing, typography } from '../tokens';

export type CheckboxProps = {
  value: boolean;
  /** Text shown next to the box. */
  label: string;
  onChange: (value: boolean) => void;
  invalid?: boolean;
};

export function Checkbox({ value, label, onChange, invalid = false }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={styles.row}
    >
      <View style={[styles.box, value && styles.boxChecked, invalid && !value && styles.boxInvalid]}>
        {value ? <Text style={styles.mark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: sizes.checkbox,
    height: sizes.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  boxInvalid: {
    borderColor: colors.error,
  },
  mark: {
    color: colors.onPrimary,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    flexShrink: 1,
    marginLeft: spacing.md,
    color: colors.text,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
