import type { TaskItem } from '../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: TaskItem[];
  onStatusChange: (taskId: string, status: TaskItem['status']) => void;
  onNoteSave: (taskId: string, note: string) => void;
}

const TaskList = ({ tasks, onStatusChange, onNoteSave }: TaskListProps) => {
  return (
    <section className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onNoteSave={onNoteSave} />
      ))}
    </section>
  );
};

export default TaskList;
