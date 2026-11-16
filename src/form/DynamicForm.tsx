import { useIsRegularWidth } from '../design-system';
import { FormField } from './FormField';
import { CompactLayout } from './layouts/CompactLayout';
import { RegularLayout } from './layouts/RegularLayout';
import type { FieldConfig, FieldValue, FormErrors, FormValues } from './types';
import { isFieldVisible } from './visibility';

export type DynamicFormProps = {
  config: FieldConfig[];
  values: FormValues;
  errors: FormErrors;
  onChange: (name: string, value: FieldValue) => void;
  onFocus?: (name: string) => void;
  onBlur: (name: string) => void;
};

/** Renders one field per visible config entry, in the layout that fits the window width. */
export function DynamicForm({ config, values, errors, onChange, onFocus, onBlur }: DynamicFormProps) {
  const isRegular = useIsRegularWidth();

  const items = config
    .filter((field) => isFieldVisible(field, values))
    .map((field) => ({
      key: field.name,
      span: field.span ?? 'full',
      node: (
        <FormField
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ),
    }));

  return isRegular ? <RegularLayout items={items} /> : <CompactLayout items={items} />;
}
