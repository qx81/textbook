import { formatDateCN, todayKey } from '../lib/date';
import type { PlanDay } from '../types/task';

interface PlanHeaderProps {
  currentPlan?: PlanDay;
}

const PlanHeader = ({ currentPlan }: PlanHeaderProps) => {
  return (
    <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm text-slate-500">今天：{formatDateCN(todayKey())}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">事项记事本</h1>
      <p className="mt-2 text-slate-600">
        {currentPlan
          ? `当前计划日：${formatDateCN(currentPlan.targetDate)}（已处理 ${currentPlan.completedCount + currentPlan.failedCount}/${currentPlan.totalCount}）`
          : '暂无计划，创建第一天事项开始闭环。'}
      </p>
    </header>
  );
};

export default PlanHeader;
