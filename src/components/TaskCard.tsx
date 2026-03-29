import { useState } from 'react';
import type { TaskItem } from '../types/task';

interface TaskCardProps {
  task: TaskItem;
  onStatusChange: (taskId: string, status: TaskItem['status']) => void;
  onNoteSave: (taskId: string, note: string) => void;
}

const statusLabelMap = {
  todo: '未处理',
  completed: '已完成',
  failed: '未完成',
};

const statusClassMap = {
  todo: 'bg-slate-100 text-slate-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
};

const TaskCard = ({ task, onStatusChange, onNoteSave }: TaskCardProps) => {
  const [draftNote, setDraftNote] = useState(task.note);

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs ${statusClassMap[task.status]}`}>
            {statusLabelMap[task.status]}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-emerald-200 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50"
            onClick={() => onStatusChange(task.id, 'completed')}
            type="button"
          >
            ✓
          </button>
          <button
            className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-700 hover:bg-rose-50"
            onClick={() => onStatusChange(task.id, 'failed')}
            type="button"
          >
            ✕
          </button>
          <button
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
            onClick={() => onStatusChange(task.id, 'todo')}
            type="button"
          >
            撤回
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs text-slate-500">便签</label>
        <textarea
          className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-400"
          rows={2}
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <button
            className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            onClick={() => onNoteSave(task.id, draftNote)}
            type="button"
          >
            保存便签
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
