/**
 * @skyra/ui
 *
 * Reusable UI primitives for the Skyra Platform.
 * All components are visually derived from skyra-erp (read-only reference).
 * Layer 2 — depends on @skyra/design-tokens.
 *
 * Usage:
 *   import '@skyra/design-tokens/tokens.css';
 *   import '@skyra/design-tokens/reset.css';
 *   import '@skyra/ui/styles.css';
 *   import { Button, Input, StatusBadge } from '@skyra/ui';
 */

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { NativeSelect } from './components/NativeSelect';
export type { NativeSelectProps, SelectOption as NativeSelectOption } from './components/NativeSelect';

export { CustomSelect } from './components/CustomSelect';
export type { CustomSelectProps, SelectOption } from './components/CustomSelect';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { StatusBadge } from './components/StatusBadge';
export type { StatusBadgeProps, StatusConfig, StatusSize } from './components/StatusBadge';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { Spinner } from './components/Spinner';
export type { SpinnerProps, SpinnerSize } from './components/Spinner';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { PhoneInputField } from './components/PhoneInputField';
export type { PhoneInputFieldProps } from './components/PhoneInputField';

export { LogoUploader } from './components/LogoUploader';
export type { LogoUploaderProps } from './components/LogoUploader';
