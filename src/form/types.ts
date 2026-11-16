export type FieldType = 'text' | 'email' | 'select' | 'textarea' | 'checkbox';

export type FieldValue = string | boolean;
export type FormValues = Record<string, FieldValue>;
/** Field name to message. A missing key means the field is valid. */
export type FormErrors = Record<string, string>;

export type SelectOption = { label: string; value: string };

export type Validations = {
  /** `true` uses the default message. A string is used as the message. */
  required?: boolean | string;
  email?: boolean;
  /** Exactly this many digits, nothing else. */
  digits?: number;
  maxLength?: number;
};

export type FieldConfig = {
  name: string;
  type: FieldType;
  label: string;
  validations: Validations;
  options?: SelectOption[];
  placeholder?: string;
  hint?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  /** Width in the two-column layout. Defaults to `full`. */
  span?: 'half' | 'full';
  /** Show the field only while another field has this value. Hidden fields are not validated. */
  visibleWhen?: { field: string; equals: FieldValue };
};
