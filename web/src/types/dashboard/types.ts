interface tag {
  type: string;
  title: string;
}

interface toDoCardProps {
  id: number;
  title: string;
  description: string;
  tags: any[];
  status: boolean;
  dueDate?: string;
  dueTime?: string;
  onStatusChange?: (id: number, newStatus: boolean) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  tags: any[];
  status: boolean;
  dueDate?: string;
  dueTime?: string;
}

interface Skill {
  name: string;
  level: number;
  experience: number;
}

interface progressBarProps {
  title: string;
  percentage: number;
  color: string;
}

export type { tag, toDoCardProps, progressBarProps, Task, Skill };
