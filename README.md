# Lead Capture

An Expo (React Native + TypeScript) app with a small design system and a lead capture form that renders itself from a config array. iOS only.

## Install and run on the iOS simulator

Requirements: macOS, Xcode with at least one iOS simulator, Node 22.13 or newer (Expo SDK 58 asks for it; Node 20 still bundles but prints a warning).

```bash
cd lead-capture
npm install
npx expo start --ios
```

Expo opens the booted simulator and loads the app in Expo Go. To choose a device, boot it first (Simulator.app > File > Open Simulator), then press `i` in the Metro terminal.

- Toggle the software keyboard with Cmd+K to check keyboard behaviour.
- Rotate with Cmd+Left / Cmd+Right. `app.json` sets `orientation` to `default` so rotation works.
- If Expo Go does not match the SDK, run a development build instead: `npx expo run:ios`.
- If Metro misbehaves, run `npx expo start --ios --clear`.

Checks: `npx tsc --noEmit` and `npx eslint .`.

## Folder layout

```
App.tsx                         SafeAreaProvider + LeadScreen
src/
  design-system/                knows nothing about leads or forms
    tokens/                     colors, spacing, typography, breakpoints
    atoms/                      TextInput, Select, Checkbox, Button
    molecules/Field.tsx         label, control, hint, error
    useIsRegularWidth.ts        window width >= breakpoint
  form/                         generic, config-driven rendering
    types.ts                    FieldConfig, values, errors
    FormField.tsx               type -> atom map, wraps the control in Field
    DynamicForm.tsx             one field per visible config entry, picks a layout
    layouts/                    CompactLayout, RegularLayout
    visibility.ts, initialValues.ts
  features/lead/                everything specific to the lead form
    leadFormConfig.ts           the field config array
    leadValidation.ts           pure validation rules
    leadMockData.ts             lead type options
    LeadScreen.tsx              state, submit, result display
```

Dependencies point one way: `features/lead` -> `form` -> `design-system`.

## Where things live

| Thing | Location |
| --- | --- |
| Tokens (color, spacing, type, two-column breakpoint) | `src/design-system/tokens/` (breakpoint: `breakpoints.ts`, 600dp) |
| Atoms | `src/design-system/atoms/` |
| Field molecule | `src/design-system/molecules/Field.tsx` |
| Form (config -> fields) | `src/form/DynamicForm.tsx`, type-to-atom map in `src/form/FormField.tsx` |
| Field config | `src/features/lead/leadFormConfig.ts` |
| Validation rules | `src/features/lead/leadValidation.ts` (`validate(config, values)` and `validateField`) |

Adding a field means adding an entry to `leadFormConfig.ts`. Adding a new control type means adding an atom and one entry in the `controls` map in `FormField.tsx`.

## Layouts

| Layout | Owner |
| --- | --- |
| Choosing compact or regular | `src/form/DynamicForm.tsx`, using `useIsRegularWidth` |
| Compact (one column, below 600dp) | `src/form/layouts/CompactLayout.tsx` |
| Regular (two columns, 600dp and up) | `src/form/layouts/RegularLayout.tsx` |
| Row pairing | `span: 'half' \| 'full'` on each config entry |
| Keyboard, safe area, scrolling | `src/features/lead/LeadScreen.tsx` |

Two `half` fields share a row, a `full` field takes its own row. Hidden fields are removed before rows are built, so Company name appearing or disappearing re-flows the rows.

The keyboard is handled by `src/form/useKeyboardAwareScroll.ts`. It adds bottom padding while the keyboard is open and scrolls the focused input, including the tall Notes box, fully above the keyboard. `ScrollView` uses `keyboardShouldPersistTaps="handled"`. The Submit button is the last item in the scroll content, so it is always reachable. Safe-area insets come from `SafeAreaView` (`react-native-safe-area-context`).

## Validation behaviour

- Fields validate on blur and on submit. Selects and checkboxes validate when they change.
- A field with an error re-validates as the user types, so the error clears once it is fixed.
- Submit validates every visible field, shows every error, and stops if any remain.
- Hidden fields are skipped. Company name is required only while Lead type is Company, and it is cleared when hidden.
- Phone means exactly 10 digits, with no spaces or `+`.
