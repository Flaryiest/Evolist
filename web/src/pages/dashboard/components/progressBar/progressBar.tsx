import styles from './progressBar.module.css';
import type { progressBarProps } from '@/types/dashboard/types';

export default function ProgressBar({
  title,
  percentage,
  color
}: progressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={styles.progressContainer}>
      <span className={styles.progressTitle}>{title}</span>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBarFill}
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: color || '#4f46e5'
          }}
        ></div>
      </div>
      <span className={styles.progressPercentage}>
        {clampedPercentage}% Complete
      </span>
    </div>
  );
}
