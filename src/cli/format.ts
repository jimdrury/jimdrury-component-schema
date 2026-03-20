import type { ApplyResult } from './apply';
import type { FieldChange, Plan, PlanAction } from './plan';

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const SYMBOLS: Record<PlanAction['action'], string> = {
  create: `${GREEN}+${RESET}`,
  update: `${YELLOW}~${RESET}`,
  delete: `${RED}-${RESET}`,
};

const ACTION_COLORS: Record<PlanAction['action'], string> = {
  create: GREEN,
  update: YELLOW,
  delete: RED,
};

function formatValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function formatChange(change: FieldChange): string {
  const path = `${DIM}${change.path}${RESET}`;

  switch (change.type) {
    case 'added':
      return `      ${GREEN}+${RESET} ${path}${change.local !== undefined ? `: ${DIM}${formatValue(change.local)}${RESET}` : ''}`;
    case 'removed':
      return `      ${RED}-${RESET} ${path}${change.remote !== undefined ? `: ${DIM}${formatValue(change.remote)}${RESET}` : ''}`;
    case 'changed':
      return `      ${YELLOW}~${RESET} ${path}: ${DIM}${formatValue(change.remote)} → ${formatValue(change.local)}${RESET}`;
  }
}

function formatAction(action: PlanAction): string {
  const symbol = SYMBOLS[action.action];
  const color = ACTION_COLORS[action.action];
  const verb = `${color}${action.action}${RESET}`;
  const type = action.resourceType;
  const name = `"${action.name}"`;
  const id =
    action.remoteId !== undefined
      ? `${DIM}id: ${action.remoteId}${RESET}`
      : `${DIM}(known after apply)${RESET}`;

  const lines = [
    `  ${symbol} ${verb} ${type} ${name}  ${id}`,
  ];

  if (action.changes && action.changes.length > 0) {
    for (const change of action.changes) {
      lines.push(formatChange(change));
    }
  }

  return lines.join('\n');
}

export function formatPlan(plan: Plan): string {
  const lines: string[] = [];

  const creates = plan.actions.filter((a) => a.action === 'create');
  const updates = plan.actions.filter((a) => a.action === 'update');
  const deletes = plan.actions.filter((a) => a.action === 'delete');

  if (plan.actions.length === 0) {
    lines.push('');
    lines.push(
      `${GREEN}No changes.${RESET} Your Storyblok space matches the local configuration.`,
    );
    lines.push('');
    return lines.join('\n');
  }

  lines.push('');

  const groups: Array<{
    label: string;
    resourceType: PlanAction['resourceType'];
  }> = [
    {
      label: 'Folder changes',
      resourceType: 'folder',
    },
    {
      label: 'Tag changes',
      resourceType: 'tag',
    },
    {
      label: 'Component changes',
      resourceType: 'component',
    },
  ];

  for (const { label, resourceType } of groups) {
    const groupActions = plan.actions.filter(
      (a) => a.resourceType === resourceType,
    );
    if (groupActions.length === 0) {
      continue;
    }

    lines.push(`${BOLD}${label}:${RESET}`);
    lines.push('');
    for (const action of groupActions) {
      lines.push(formatAction(action));
    }
    lines.push('');
  }

  lines.push(
    `${BOLD}Plan:${RESET} ${GREEN}${creates.length} to create${RESET}, ${YELLOW}${updates.length} to update${RESET}, ${RED}${deletes.length} to delete${RESET}.`,
  );
  lines.push('');

  return lines.join('\n');
}

export function formatApplyResult(result: ApplyResult): string {
  const lines: string[] = [];

  for (const { action, id } of result.succeeded) {
    const color = ACTION_COLORS[action.action];
    const idStr = id !== undefined ? ` ${DIM}(id: ${id})${RESET}` : '';
    const past =
      action.action === 'create'
        ? 'created'
        : action.action === 'update'
          ? 'updated'
          : 'deleted';
    lines.push(
      `  ${color}✓${RESET} ${past} ${action.resourceType} "${action.name}"${idStr}`,
    );
  }

  for (const { action, error } of result.failed) {
    const msg = error instanceof Error ? error.message : String(error);
    lines.push(
      `  ${RED}✗${RESET} ${action.action} ${action.resourceType} "${action.name}": ${msg}`,
    );
  }

  lines.push('');

  if (result.failed.length > 0) {
    lines.push(
      `${BOLD}Apply complete.${RESET} ${GREEN}${result.succeeded.length} succeeded${RESET}, ${RED}${result.failed.length} failed${RESET}.`,
    );
  } else {
    lines.push(
      `${GREEN}${BOLD}Apply complete!${RESET} ${result.succeeded.length} changes applied.`,
    );
  }

  lines.push('');

  return lines.join('\n');
}
