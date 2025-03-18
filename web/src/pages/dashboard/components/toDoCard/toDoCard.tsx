import styles from './toDoCard.module.css';
import type { toDoCardProps } from '@/types/dashboard/types';

export default function ToDoCard({
  title,
  description,
  tags,
  status,
  dueDate,
  dueTime,
  id
}: toDoCardProps) {
  return (
    <div key={id} className={styles.card}>
      <div className={styles.cardTop}></div>
      <h5 className={styles.title}>{title}</h5>
      <p className={styles.description}>{description}</p>
      <div className={styles.tags}>
        {tags.map((tag, index) => {
          const tagClassName = `${styles.tag} ${styles[`tag${tag.type}`]}`;
          return (
            <span key={index} className={tagClassName}>
              {tag.title}
            </span>
          );
        })}
      </div>
      <div className={styles.cardBottom}></div>
    </div>
  );
}
