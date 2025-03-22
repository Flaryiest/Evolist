import styles from './toDoCard.module.css';
import type { toDoCardProps } from '@/types/dashboard/types';
import calendarIcon from './assets/calendar.svg';
import alarmIcon from './assets/alarm.svg';
import settingsIcon from './assets/dots.svg';
import clockIcon from './assets/clock.svg';
import { useState, useEffect } from 'react';
import changeStatus from './statusQuery';
import { useAuth } from '@/hooks/authContext';

export default function ToDoCard({
  title,
  description,
  tags,
  status,
  dueDate,
  dueTime,
  id,
  onStatusChange
}: toDoCardProps) {
  const [isCompleted, setIsCompleted] = useState(status);
  const userInfo = useAuth();

  useEffect(() => {
    setIsCompleted(status);
  }, [status]);

  const today = new Date();
  const dueDateTime = new Date(`${dueDate} ${dueTime}`);
  const timeLeft = dueDateTime.getTime() - today.getTime();
  const timeLeftInDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  const handleStatusToggle = async () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);

    try {
      const result = await changeStatus(id, newStatus);
      if (result) {
        userInfo.updateTaskStatus(id, newStatus);
      } else {
        await userInfo.refreshAuth();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      setIsCompleted(!newStatus); 
    }
  };

  return (
    <div key={id} className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.checkmarkContainer}>
          <button
            className={`${styles.checkmarkButton} ${isCompleted ? styles.completed : ''}`}
            onClick={handleStatusToggle}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            ) : (
              <span className={styles.emptyCheck}></span>
            )}
          </button>
        </div>

        <div className={styles.timeLeft}>
          <img
            src={clockIcon}
            alt="clock"
            className={styles.timeLeftIcon}
          ></img>
          <span className={styles.timeLeftTitle}>
            {timeLeftInDays} Days Left
          </span>
        </div>
        <div className={styles.settings}>
          <button className={styles.settingsButton}>
            <img
              className={styles.settingsIcon}
              src={settingsIcon}
              alt="settings"
            ></img>
          </button>
        </div>
      </div>
      <h5
        className={`${styles.title} ${isCompleted ? styles.completedText : ''}`}
      >
        {title}
      </h5>
      <p
        className={`${styles.description} ${isCompleted ? styles.completedText : ''}`}
      >
        {description}
      </p>

      <div className={styles.tags}>
        {tags &&
          tags.map((tag, index) => {
            const tagType = tag.type || 'default';
            const tagClassName = `${styles.tag} ${styles[`tag${tagType}`] || styles.tagDefault}`;
            return (
              <span key={index} className={tagClassName}>
                {tag.title || 'Tag'}
              </span>
            );
          })}
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.dueDate}>
          <div className={styles.dueDateIcon}>
            <img
              className={styles.dueDateIcon}
              src={calendarIcon}
              alt="calendar"
            ></img>
          </div>
          <span className={styles.dueDateTitle}>{dueDate || 'No date'}</span>
        </div>
        <div className={styles.dueTime}>
          <div className={styles.dueTimeIcon}>
            <img
              className={styles.dueTimeIcon}
              src={alarmIcon}
              alt="alarm"
            ></img>
          </div>
          <span className={styles.dueTimeTitle}>{dueTime || 'No time'}</span>
        </div>
      </div>
    </div>
  );
}
