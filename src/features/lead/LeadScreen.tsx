import { useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, breakpoints, colors, radius, spacing, typography } from '../../design-system';
import {
  buildInitialValues,
  DynamicForm,
  isFieldVisible,
  useKeyboardAwareScroll,
  type FieldConfig,
  type FieldValue,
  type FormErrors,
  type FormValues,
} from '../../form';
import { leadFormConfig } from './leadFormConfig';
import { validate, validateField } from './leadValidation';

type SubmittedRow = { name: string; label: string; value: string };

// Selects and checkboxes have no typing step, so they validate as soon as they change.
const VALIDATE_ON_CHANGE = new Set<FieldConfig['type']>(['select', 'checkbox']);

function describeValue(field: FieldConfig, value: FieldValue): string {
  if (field.type === 'checkbox') return value === true ? 'Yes' : 'No';
  const text = String(value).trim();
  if (!text) return '—';
  if (field.type === 'select') {
    return field.options?.find((option) => option.value === text)?.label ?? text;
  }
  return text;
}

const initialValues = buildInitialValues(leadFormConfig);

export function LeadScreen() {
  // The ref always holds the latest values, so a blur fired in the same event as a change reads fresh data.
  const valuesRef = useRef<FormValues>(initialValues);
  const { scrollRef, keyboardInset, scrollFocusedIntoView, scrollProps } = useKeyboardAwareScroll();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitFailed, setSubmitFailed] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedRow[] | null>(null);

  const handleChange = (name: string, value: FieldValue) => {
    const next: FormValues = { ...valuesRef.current, [name]: value };
    const hidden = leadFormConfig.filter((field) => !isFieldVisible(field, next));
    // A field that disappears loses its value and its error.
    for (const field of hidden) next[field.name] = initialValues[field.name];

    valuesRef.current = next;
    setValues(next);
    setSubmitted(null);

    const changed = leadFormConfig.find((field) => field.name === name);
    setErrors((previous) => {
      const updated = { ...previous };
      for (const field of hidden) delete updated[field.name];
      if (changed && (VALIDATE_ON_CHANGE.has(changed.type) || previous[name])) {
        const message = validateField(changed, next);
        if (message) updated[name] = message;
        else delete updated[name];
      }
      return updated;
    });
  };

  const handleFocus = () => {
    // Wait a frame so the newly focused input is registered as focused.
    requestAnimationFrame(scrollFocusedIntoView);
  };

  const handleBlur = (name: string) => {
    const field = leadFormConfig.find((entry) => entry.name === name);
    if (!field) return;
    const message = validateField(field, valuesRef.current);
    setErrors((previous) => {
      const updated = { ...previous };
      if (message) updated[name] = message;
      else delete updated[name];
      return updated;
    });
  };

  const handleSubmit = () => {
    const current = valuesRef.current;
    const nextErrors = validate(leadFormConfig, current);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitFailed(true);
      setSubmitted(null);
      return;
    }

    setSubmitFailed(false);
    // The result card keeps a copy of the values, so the form itself can be cleared.
    valuesRef.current = initialValues;
    setValues(initialValues);
    setErrors({});
    Keyboard.dismiss();
    setSubmitted(
      leadFormConfig
        .filter((field) => isFieldVisible(field, current))
        .map((field) => ({
          name: field.name,
          label: field.type === 'checkbox' ? 'Consent' : field.label,
          value: describeValue(field, current[field.name]),
        })),
    );
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        {...scrollProps}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl + keyboardInset }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.column}>
          <Text style={styles.title} accessibilityRole="header">
            Lead capture
          </Text>

          {submitted ? (
            <View style={styles.result} accessibilityRole="summary">
              <Text style={styles.resultTitle}>Lead submitted</Text>
              {submitted.map((row) => (
                <View key={row.name} style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{row.label}</Text>
                  <Text style={styles.resultValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.card}>
            <DynamicForm
              config={leadFormConfig}
              values={values}
              errors={errors}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>

          {submitFailed && errorCount > 0 ? (
            <Text style={styles.summary} accessibilityRole="alert">
              {errorCount === 1 ? 'Fix 1 error above to submit.' : `Fix ${errorCount} errors above to submit.`}
            </Text>
          ) : null}

          <Button label="Submit" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  column: {
    width: '100%',
    maxWidth: breakpoints.contentMaxWidth,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  summary: {
    color: colors.error,
    fontSize: typography.error.fontSize,
    lineHeight: typography.error.lineHeight,
    fontWeight: typography.error.fontWeight,
  },
  result: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.successBackground,
  },
  resultTitle: {
    color: colors.success,
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.subtitle.lineHeight,
    fontWeight: typography.subtitle.fontWeight,
  },
  resultRow: {
    gap: spacing.xs,
  },
  resultLabel: {
    color: colors.textMuted,
    fontSize: typography.hint.fontSize,
    lineHeight: typography.hint.lineHeight,
  },
  resultValue: {
    color: colors.text,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
