import styles from './toDoCard.module.css';
import type { toDoCardProps } from '@/types/dashboard/types';
import calendarIcon from './assets/calendar.svg';
import alarmIcon from './assets/alarm.svg';
import settingsIcon from './assets/settings.svg';
export default function ToDoCard({
  title,
  description,
  tags,
  status,
  dueDate,
  dueTime,
  id
}: toDoCardProps) {
  const today = new Date();
  const dueDateTime = new Date(`${dueDate} ${dueTime}`);
  const timeLeft = dueDateTime.getTime() - today.getTime();
  const timeLeftInDays = timeLeft / (1000 * 60 * 60 * 24);
  return (
    <div key={id} className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.timeLeft}>
          <span className={styles.timeLeftTitle}>{timeLeftInDays}</span>
        </div>
        <div className={styles.status}>
          <span className={styles.statusTitle}>{status}</span>
        </div>
        <div className={styles.settings}>
          <button className={styles.settingsButton}>
            <img src={settingsIcon} alt="settings"></img>
          </button>
        </div>
      </div>
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
      <div className={styles.cardBottom}>
        <div className={styles.dueDate}>
          <div className={styles.dueDateIcon}>
            <img src={calendarIcon} alt="calendar"></img>
          </div>
          <span className={styles.dueDateTitle}>{dueDate}</span>
        </div>
        <div className={styles.dueTime}>
          <div className={styles.dueTimeIcon}>
            <img src={alarmIcon} alt="alarm"></img>
          </div>
          <span className={styles.dueTimeTitle}>{dueTime}</span>
        </div>
      </div>
    </div>
  );
}
