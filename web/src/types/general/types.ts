interface UserData {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  skills: Skill[];
  tasks: Task[];
}

interface Skill {
  id: number;
  name: string;
  level: number;
  experience: number;
  userId: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: boolean;
  tags: tag[];
}

interface tag {
  id: number;
  taskId: number;
  title: string;
  type: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateTaskStatus: (taskId: number, newStatus: boolean) => void;
}
export type { UserData, AuthContextType };
