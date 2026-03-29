import type { PlanDay } from '../types/task';

interface ProgressSummaryProps {
  plan: PlanDay;
}

const ProgressSummary = ({ plan }: ProgressSummaryProps) => {
  const processed = plan.completedCount + plan.failedCount;
  const percentage = plan.totalCount === 0 ? 0 : Math.round((processed / plan.totalCount) * 100);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>处理进度</span>
        <span>{processed}/{plan.totalCount}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
      </div>
      <div className="mt-3 flex gap-2 text-xs">
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">完成 {plan.completedCount}</span>
        <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">失败 {plan.failedCount}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">待处理 {plan.unprocessedCount}</span>
      </div>
    </section>
  );
};

export default ProgressSummary;
