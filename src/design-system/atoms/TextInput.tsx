import { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, type TextInputProps as RNTextInputProps } from 'react-native';

import { colors, radius, sizes, spacing, typography } from '../tokens';

export type TextInputProps = {
  value: string;
  /** Accessible name. The visible label is rendered by the Field molecule. */
  label: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  multiline?: boolean;
  invalid?: boolean;
} & Pick<RNTextInputProps, 'placeholder' | 'inputMode' | 'autoCapitalize' | 'autoCorrect' | 'autoComplete'>;

export function TextInput({
  value,
  label,
  onChangeText,
  onFocus,
  onBlur,
  multiline = false,
  invalid = false,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <RNTextInput
      {...rest}
      value={value}
      accessibilityLabel={label}
      onChangeText={onChangeText}
      onFocus={() => {
        setFocused(true);
        onFocus?.();
      }}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor={colors.textMuted}
      style={[
        styles.input,
        multiline && styles.multiline,
        focused && styles.focused,
        invalid && styles.invalid,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: sizes.control,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  multiline: {
    minHeight: sizes.textareaMin,
    paddingTop: spacing.md,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  invalid: {
    borderColor: colors.error,
    borderWidth: 2,
  },
});
