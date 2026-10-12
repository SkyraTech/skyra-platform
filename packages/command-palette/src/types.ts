import type { CommandLike } from '@skyra-tech-platform/utils';

export interface CommandItem extends CommandLike {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  group?: string;
  shortcut?: string;
  disabled?: boolean;
  hidden?: boolean;
  closeOnExecute?: boolean;
  icon?: string;
  payload?: unknown;
  onExecute?: () => void;
}

export interface CommandSelectDetail {
  command: CommandItem;
  id: string;
  label: string;
}

export interface CommandPaletteOpenDetail {
  shortcut?: string;
}

export interface CommandPaletteCloseDetail {
  reason: 'escape' | 'backdrop' | 'select' | 'programmatic' | string;
}

export interface CommandPaletteChangeDetail {
  open: boolean;
}

export interface CommandPaletteQueryDetail {
  query: string;
  count: number;
}

export const COMMAND_SELECT_EVENT = 'skyra-command-select';
export const COMMAND_PALETTE_OPEN_EVENT = 'skyra-command-palette-open';
export const COMMAND_PALETTE_CLOSE_EVENT = 'skyra-command-palette-close';
export const COMMAND_PALETTE_CHANGE_EVENT = 'skyra-command-palette-change';
export const COMMAND_PALETTE_QUERY_EVENT = 'skyra-command-palette-query';
