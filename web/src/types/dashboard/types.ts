interface tag {
  type: string;
  title: string;
}

interface toDoCardProps {
  title: string;
  description: string;
  tags: tag[];
  status: boolean;
  dueDate: string;
  dueTime: string;
  id: number;
}

interface progressBarProps {
  title: string;
  percentage: number;
  color: string;
}

export type { tag, toDoCardProps, progressBarProps };
