import { formatDateCN } from '../lib/date';
import type { PlanDay } from '../types/task';

interface HistoryListProps {
  plans: PlanDay[];
  activePlanId?: string;
  onSelect: (planId: string) => void;
}

const HistoryList = ({ plans, activePlanId, onSelect }: HistoryListProps) => {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">历史计划</h2>
      <div className="space-y-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan.id)}
            className={`w-full rounded-lg border p-3 text-left text-sm transition ${
              activePlanId === plan.id ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            <p className="font-medium text-slate-800">{formatDateCN(plan.targetDate)}</p>
            <p className="mt-1 text-xs text-slate-500">
              完成 {plan.completedCount} / 失败 {plan.failedCount} / 待处理 {plan.unprocessedCount}
            </p>
          </button>
        ))}
        {plans.length === 0 && <p className="text-sm text-slate-500">暂无历史计划</p>}
      </div>
    </section>
  );
};

export default HistoryList;
