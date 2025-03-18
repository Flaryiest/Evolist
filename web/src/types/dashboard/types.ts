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

export type { tag, toDoCardProps };

