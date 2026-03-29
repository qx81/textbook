import { useMemo, useState } from 'react';

interface DraftTask {
  title: string;
  note: string;
}

interface CreateNextPlanPanelProps {
  nextDate: string;
  canCreate: boolean;
  reason?: string;
  onCreate: (items: DraftTask[]) => void;
}

const blankItem = (): DraftTask => ({ title: '', note: '' });

const CreateNextPlanPanel = ({ nextDate, canCreate, reason, onCreate }: CreateNextPlanPanelProps) => {
  const [items, setItems] = useState<DraftTask[]>([blankItem()]);
  const [error, setError] = useState<string>('');

  const hasInvalid = useMemo(() => items.some((item) => !item.title.trim()), [items]);

  const updateItem = (index: number, patch: Partial<DraftTask>) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, blankItem()]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreate = () => {
    if (!canCreate) return;
    if (items.length === 0 || hasInvalid) {
      setError('请至少输入一条非空标题事项');
      return;
    }
    setError('');
    onCreate(items);
    setItems([blankItem()]);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-900">创建下一天计划（{nextDate}）</h2>
        <p className="text-sm text-slate-500">只有当前计划闭环后，才可创建下一天事项。</p>
      </div>

      {!canCreate && <p className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{reason}</p>}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-100 p-3">
            <input
              className="mb-2 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-400 disabled:bg-slate-100"
              placeholder="事项标题"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              disabled={!canCreate}
            />
            <textarea
              className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-400 disabled:bg-slate-100"
              placeholder="便签（可选）"
              rows={2}
              value={item.note}
              onChange={(e) => updateItem(index, { note: e.target.value })}
              disabled={!canCreate}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={!canCreate}
                className="mt-2 text-xs text-rose-600 disabled:text-slate-400"
              >
                删除该事项
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={addItem}
          disabled={!canCreate}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:text-slate-400"
        >
          + 新增事项
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white disabled:bg-slate-300"
        >
          保存计划
        </button>
      </div>
    </section>
  );
};

export default CreateNextPlanPanel;
