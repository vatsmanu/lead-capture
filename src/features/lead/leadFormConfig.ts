import type { FieldConfig } from '../../form';
import { LEAD_TYPE_OPTIONS } from './leadMockData';

/** Adding a field to the lead form means adding an entry here. */
export const leadFormConfig: FieldConfig[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full name',
    placeholder: 'Jane Doe',
    span: 'half',
    validations: { required: true },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'jane@example.com',
    span: 'half',
    validations: { required: true, email: true },
  },
  {
    name: 'leadType',
    type: 'select',
    label: 'Lead type',
    placeholder: 'Select a lead type',
    options: LEAD_TYPE_OPTIONS,
    span: 'half',
    validations: { required: true },
  },
  {
    name: 'companyName',
    type: 'text',
    label: 'Company name',
    placeholder: 'Acme Inc.',
    span: 'half',
    visibleWhen: { field: 'leadType', equals: 'company' },
    validations: { required: true },
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: '10 digits',
    hint: 'Digits only, no spaces or +.',
    inputMode: 'numeric',
    span: 'half',
    validations: { required: true, digits: 10 },
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    hint: 'Optional. Up to 200 characters.',
    span: 'full',
    validations: { maxLength: 200 },
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'I agree to be contacted about my enquiry.',
    span: 'full',
    validations: { required: 'Consent is required to submit.' },
  },
];
