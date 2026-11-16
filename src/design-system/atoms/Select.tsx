import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, sizes, spacing, typography } from '../tokens';

export type SelectOption = { label: string; value: string };

export type SelectProps = {
  value: string;
  /** Accessible name and sheet title. The visible label is rendered by the Field molecule. */
  label: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
};

export function Select({
  value,
  label,
  options,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Select an option',
  invalid = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const selected = options.find((option) => option.value === value);

  const openSheet = () => {
    onFocus?.();
    setOpen(true);
  };
  const closeSheet = () => {
    setOpen(false);
    onBlur?.();
  };
  const pick = (next: string) => {
    onChange(next);
    closeSheet();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        onPress={openSheet}
        style={[styles.trigger, invalid && styles.invalid]}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no">
          ▾
        </Text>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={closeSheet}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} accessibilityLabel="Close" />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView bounces={false}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => pick(option.value)}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                    {isSelected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: '100%',
    minHeight: sizes.control,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  invalid: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  triggerText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  placeholder: {
    color: colors.textMuted,
  },
  chevron: {
    marginLeft: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  sheet: {
    width: '100%',
    maxWidth: sizes.sheetMaxWidth,
    maxHeight: '70%',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  sheetTitle: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.subtitle.lineHeight,
    fontWeight: typography.subtitle.fontWeight,
  },
  option: {
    minHeight: sizes.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  check: {
    marginLeft: spacing.sm,
    color: colors.primary,
    fontSize: typography.body.fontSize,
  },
});
