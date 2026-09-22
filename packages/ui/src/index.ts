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
 *   import { Button, Input, DynamicSelect, StatusBadge } from '@skyra/ui';
 */

// ── Standard Buttons & Actions ──
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

// ── Standard Input Controls ──
export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { SearchInput } from './components/SearchInput';
export type { SearchInputProps } from './components/SearchInput';

export { PasswordInput } from './components/PasswordInput';
export type { PasswordInputProps } from './components/PasswordInput';

export { NumberInput } from './components/NumberInput';
export type { NumberInputProps } from './components/NumberInput';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

// ── Selection & Pickers ──
export { NativeSelect } from './components/NativeSelect';
export type { NativeSelectProps, SelectOption as NativeSelectOption } from './components/NativeSelect';

export { CustomSelect } from './components/CustomSelect';
export type { CustomSelectProps, SelectOption } from './components/CustomSelect';

export { DynamicSelect } from './components/DynamicSelect';
export type {
  DynamicSelectProps,
  DynamicSelectMode,
  DynamicSelectSearchConfig,
  DefaultSelectOption,
} from './components/DynamicSelect';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { CheckboxGroup } from './components/CheckboxGroup';
export type { CheckboxGroupProps, CheckboxGroupOption } from './components/CheckboxGroup';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { RadioGroup } from './components/RadioGroup';
export type { RadioGroupProps, RadioGroupOption } from './components/RadioGroup';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchVariant, SwitchSize } from './components/Switch';

// ── Date & Time System ──
export { Calendar, toISODate, parseISODate } from './components/Calendar';
export type { CalendarProps } from './components/Calendar';

export { DateField } from './components/DateField';
export type { DateFieldProps } from './components/DateField';

export { DateRangeField } from './components/DateRangeField';
export type { DateRangeFieldProps, DateRangeValue } from './components/DateRangeField';

export { TimeField } from './components/TimeField';
export type { TimeFieldProps } from './components/TimeField';

export { TimeRangeField } from './components/TimeRangeField';
export type { TimeRangeFieldProps, TimeRangeValue } from './components/TimeRangeField';

export { DateTimeField } from './components/DateTimeField';
export type { DateTimeFieldProps, DateTimeValue } from './components/DateTimeField';

export { DateTimeRangeField } from './components/DateTimeRangeField';
export type { DateTimeRangeFieldProps } from './components/DateTimeRangeField';

export { MonthField } from './components/MonthField';
export type { MonthFieldProps } from './components/MonthField';

export { YearField } from './components/YearField';
export type { YearFieldProps } from './components/YearField';

export { WeekField } from './components/WeekField';
export type { WeekFieldProps } from './components/WeekField';

// ── Skyra Loading System ──
export { Spinner } from './components/Spinner';
export type { SpinnerProps, SpinnerSize } from './components/Spinner';

export { Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

export { CircularProgress } from './components/CircularProgress';
export type { CircularProgressProps } from './components/CircularProgress';

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { DataLoader } from './components/DataLoader';
export type { DataLoaderProps } from './components/DataLoader';

export { PageLoader } from './components/PageLoader';
export type { PageLoaderProps } from './components/PageLoader';

export { OverlayLoader } from './components/OverlayLoader';
export type { OverlayLoaderProps } from './components/OverlayLoader';

// ── Rich Tooltip System ──
export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipPlacement } from './components/Tooltip';

// ── Notification / Response Bar ──
export { NotificationBar } from './components/NotificationBar';
export type { NotificationBarProps, NotificationType } from './components/NotificationBar';

// ── Badges, Cards & Alerts ──
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { StatusBadge } from './components/StatusBadge';
export type { StatusBadgeProps, StatusConfig, StatusSize } from './components/StatusBadge';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

// ── Document & Export Controls ──
export { PdfViewer } from './components/PdfViewer';
export type { PdfViewerProps } from './components/PdfViewer';

export { PrintButton } from './components/PrintButton';
export type { PrintButtonProps } from './components/PrintButton';

export { DownloadButton } from './components/DownloadButton';
export type { DownloadButtonProps } from './components/DownloadButton';

export { ExportButton } from './components/ExportButton';
export type { ExportButtonProps } from './components/ExportButton';

export { ExportMenu } from './components/ExportMenu';
export type { ExportMenuProps } from './components/ExportMenu';

export { PhoneInputField } from './components/PhoneInputField';
export type { PhoneInputFieldProps } from './components/PhoneInputField';

export { LogoUploader } from './components/LogoUploader';
export type { LogoUploaderProps } from './components/LogoUploader';

// ── Phase 4A: Overlays & Interaction Primitives ──
export { useFloatingPosition } from './hooks/useFloatingPosition';
export type {
  FloatingPlacement,
  FloatingAlign,
  UseFloatingPositionOptions,
  FloatingPositionResult,
  VirtualAnchor,
} from './hooks/useFloatingPosition';

export { Popover } from './components/Popover';
export type { PopoverProps } from './components/Popover';

export { DropdownMenu } from './components/DropdownMenu';
export type { DropdownMenuProps, DropdownMenuItemConfig } from './components/DropdownMenu';

export { ContextMenu } from './components/ContextMenu';
export type { ContextMenuProps } from './components/ContextMenu';

export {
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './components/MenuPrimitives';
export type {
  MenuContentProps,
  MenuItemProps,
  MenuGroupProps,
  MenuSeparatorProps,
  CheckboxMenuItemProps,
  RadioMenuItemProps,
  MenuContextValue,
} from './components/MenuPrimitives';

// ── Phase 4B: Navigation & Disclosure Primitives ──
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsOrientation,
  TabsActivationMode,
  TabsVariant,
  TabsContextValue,
} from './components/Tabs';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/Accordion';
export type {
  AccordionProps,
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionType,
  AccordionContextValue,
  AccordionItemContextValue,
} from './components/Accordion';

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './components/Collapsible';
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
  CollapsibleContextValue,
} from './components/Collapsible';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from './components/Breadcrumb';
export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbPageProps,
  BreadcrumbEllipsisProps,
} from './components/Breadcrumb';

// ── Phase 4C: Navigation & Notification Orchestration ──
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  getPaginationRange,
} from './components/Pagination';
export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationFirstProps,
  PaginationLastProps,
  PaginationEllipsisProps,
  PaginationRangeOptions,
  PaginationItemValue,
  PaginationSize,
  PaginationVariant,
} from './components/Pagination';

export {
  ToastProvider,
  ToastViewport,
  useToast,
  toast,
} from './components/Toast';
export type {
  ToastPosition,
  ToastAction,
  ToastOptions,
  ToastData,
  ToastContextValue,
  ToastProviderProps,
  ToastViewportProps,
} from './components/Toast';

// ── Phase 4D: File Management & Semantic Content States ──
export {
  FileUpload,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  validateFiles,
  formatFileSize,
  isAcceptedFileType,
} from './components/FileUpload';
export type {
  FileUploadProps,
  FileUploadTriggerProps,
  FileUploadListProps,
  FileUploadItemProps,
  FileUploadStatus,
  FileValidationError,
  FileRejection,
  FileUploadContextValue,
  FileValidationOptions,
} from './components/FileUpload';

export { Dropzone, FileUploadDropzone } from './components/Dropzone';
export type { DropzoneProps, FileUploadDropzoneProps } from './components/Dropzone';

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './components/EmptyState';
export type {
  EmptyStateProps,
  EmptyStateIconProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionsProps,
  EmptyStateVariant,
} from './components/EmptyState';

export {
  ErrorState,
  ErrorStateIcon,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateActions,
  ErrorStateDetails,
} from './components/ErrorState';
export type {
  ErrorStateProps,
  ErrorStateIconProps,
  ErrorStateTitleProps,
  ErrorStateDescriptionProps,
  ErrorStateActionsProps,
  ErrorStateDetailsProps,
} from './components/ErrorState';

