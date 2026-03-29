import { dayAfter, tomorrowKey } from './date';
import type { NotebookState, PlanDay, TaskItem, TaskStatus } from '../types/task';

const STORAGE_KEY = 'task-notebook-v1';

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const byDateAsc = (a: PlanDay, b: PlanDay) => a.targetDate.localeCompare(b.targetDate);

export const recalcPlanSummary = (plan: PlanDay, tasks: TaskItem[]): PlanDay => {
  const planTasks = tasks.filter((t) => t.planDayId === plan.id);
  const totalCount = planTasks.length;
  const completedCount = planTasks.filter((t) => t.status === 'completed').length;
  const failedCount = planTasks.filter((t) => t.status === 'failed').length;
  const unprocessedCount = planTasks.filter((t) => t.status === 'todo').length;
  return {
    ...plan,
    totalCount,
    completedCount,
    failedCount,
    unprocessedCount,
    status: totalCount > 0 && unprocessedCount === 0 ? 'finished' : 'pending',
    updatedAt: new Date().toISOString(),
  };
};

const recalcAllPlans = (state: NotebookState): NotebookState => {
  const plans = state.plans.map((plan) => recalcPlanSummary(plan, state.tasks)).sort(byDateAsc);
  return { ...state, plans };
};

export const loadState = (): NotebookState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { plans: [], tasks: [] };
  }
  try {
    const parsed = JSON.parse(raw) as NotebookState;
    if (!Array.isArray(parsed.plans) || !Array.isArray(parsed.tasks)) {
      return { plans: [], tasks: [] };
    }
    return recalcAllPlans(parsed);
  } catch {
    return { plans: [], tasks: [] };
  }
};

export const saveState = (state: NotebookState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getLatestPlan = (state: NotebookState): PlanDay | undefined =>
  [...state.plans].sort(byDateAsc).at(-1);

export const getCurrentActivePlan = (state: NotebookState): PlanDay | undefined => {
  const pending = [...state.plans].sort(byDateAsc).find((p) => p.status === 'pending');
  if (pending) {
    return pending;
  }
  return getLatestPlan(state);
};

export const canCreateNextPlan = (state: NotebookState): { ok: boolean; reason?: string; nextDate: string } => {
  const latest = getLatestPlan(state);
  if (!latest) {
    return { ok: true, nextDate: tomorrowKey() };
  }
  if (latest.unprocessedCount > 0) {
    return {
      ok: false,
      reason: `当前计划日 ${latest.targetDate} 仍有 ${latest.unprocessedCount} 条未处理事项，请先闭环。`,
      nextDate: dayAfter(latest.targetDate),
    };
  }
  return { ok: true, nextDate: dayAfter(latest.targetDate) };
};

export const createPlanDay = (state: NotebookState, payload: Array<{ title: string; note: string }>): NotebookState => {
  const gate = canCreateNextPlan(state);
  if (!gate.ok) {
    throw new Error(gate.reason ?? '当前不允许创建下一计划');
  }
  if (payload.length === 0) {
    throw new Error('至少添加一条事项');
  }

  const normalized = payload.map((item) => ({
    title: item.title.trim(),
    note: item.note.trim(),
  }));

  if (normalized.some((i) => !i.title)) {
    throw new Error('事项标题不能为空');
  }

  const duplicate = state.plans.some((p) => p.targetDate === gate.nextDate);
  if (duplicate) {
    throw new Error('同一天计划不可重复创建');
  }

  const now = new Date().toISOString();
  const plan: PlanDay = {
    id: createId(),
    targetDate: gate.nextDate,
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    totalCount: normalized.length,
    completedCount: 0,
    failedCount: 0,
    unprocessedCount: normalized.length,
  };

  const tasks: TaskItem[] = normalized.map((item, index) => ({
    id: createId(),
    planDayId: plan.id,
    title: item.title,
    note: item.note,
    status: 'todo',
    createdAt: now,
    updatedAt: now,
    order: index,
  }));

  return recalcAllPlans({
    plans: [...state.plans, plan],
    tasks: [...state.tasks, ...tasks],
  });
};

export const updateTaskStatus = (state: NotebookState, taskId: string, status: TaskStatus): NotebookState => {
  const nextTasks = state.tasks.map((task) => {
    if (task.id !== taskId) return task;
    if (task.status === status) return task;
    return { ...task, status, updatedAt: new Date().toISOString() };
  });
  return recalcAllPlans({ ...state, tasks: nextTasks });
};

export const updateTaskNote = (state: NotebookState, taskId: string, note: string): NotebookState => {
  const nextTasks = state.tasks.map((task) => {
    if (task.id !== taskId) return task;
    return { ...task, note: note.trim(), updatedAt: new Date().toISOString() };
  });
  return { ...state, tasks: nextTasks };
};

export const getTasksByPlan = (state: NotebookState, planId: string): TaskItem[] =>
  state.tasks
    .filter((task) => task.planDayId === planId)
    .sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));

export { STORAGE_KEY };
