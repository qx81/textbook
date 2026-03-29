import { useEffect, useMemo, useState } from 'react';
import CreateNextPlanPanel from './components/CreateNextPlanPanel';
import HistoryList from './components/HistoryList';
import PlanHeader from './components/PlanHeader';
import ProgressSummary from './components/ProgressSummary';
import TaskList from './components/TaskList';
import {
  canCreateNextPlan,
  createPlanDay,
  getCurrentActivePlan,
  getTasksByPlan,
  loadState,
  saveState,
  updateTaskNote,
  updateTaskStatus,
} from './lib/notebook';
import type { NotebookState, PlanDay, TaskItem } from './types/task';

const App = () => {
  const [state, setState] = useState<NotebookState>(() => loadState());
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const fallbackPlan = getCurrentActivePlan(state);

  const selectedPlan: PlanDay | undefined = useMemo(() => {
    if (!selectedPlanId) return fallbackPlan;
    return state.plans.find((p) => p.id === selectedPlanId) ?? fallbackPlan;
  }, [fallbackPlan, selectedPlanId, state.plans]);

  const tasks: TaskItem[] = useMemo(() => {
    if (!selectedPlan) return [];
    return getTasksByPlan(state, selectedPlan.id);
  }, [selectedPlan, state]);

  const gate = canCreateNextPlan(state);

  const handleStatus = (taskId: string, status: TaskItem['status']) => {
    setState((prev) => updateTaskStatus(prev, taskId, status));
  };

  const handleSaveNote = (taskId: string, note: string) => {
    setState((prev) => updateTaskNote(prev, taskId, note));
  };

  const handleCreatePlan = (items: Array<{ title: string; note: string }>) => {
    try {
      setState((prev) => createPlanDay(prev, items));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建计划失败');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-4 p-4 md:p-8">
      <PlanHeader currentPlan={selectedPlan} />

      {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4">
          {selectedPlan ? (
            <>
              <ProgressSummary plan={selectedPlan} />
              <TaskList tasks={tasks} onStatusChange={handleStatus} onNoteSave={handleSaveNote} />
            </>
          ) : (
            <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-600">暂无计划。请先创建明天事项。</p>
            </section>
          )}
        </section>

        <section className="space-y-4">
          <CreateNextPlanPanel
            nextDate={gate.nextDate}
            canCreate={gate.ok}
            reason={gate.reason}
            onCreate={handleCreatePlan}
          />
          <HistoryList
            plans={[...state.plans].sort((a, b) => b.targetDate.localeCompare(a.targetDate))}
            activePlanId={selectedPlan?.id}
            onSelect={setSelectedPlanId}
          />
        </section>
      </div>
    </main>
  );
};

export default App;
