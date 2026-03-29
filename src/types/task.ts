export type TaskStatus = 'todo' | 'completed' | 'failed';
export type PlanStatus = 'pending' | 'finished';

export interface TaskItem {
  id: string;
  planDayId: string;
  title: string;
  note: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface PlanDay {
  id: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  status: PlanStatus;
  totalCount: number;
  completedCount: number;
  failedCount: number;
  unprocessedCount: number;
}

export interface NotebookState {
  plans: PlanDay[];
  tasks: TaskItem[];
}
