import styles from './toDoCard.module.css';
import { useState, useEffect} from 'react';
import type { toDoCardProps } from '@/types/dashboard/types';
import calendarIcon from './assets/calendar.svg';
import alarmIcon from './assets/alarm.svg';
import settingsIcon from './assets/dots.svg';
import clockIcon from './assets/clock.svg';
import changeStatus from './statusQuery';
import { useAuth } from '@/hooks/authContext';
import ReactDOM from 'react-dom';

async function extractTaskSkills(taskDescription: string, userEmail: string) {
  try {
    const response = await fetch('http://localhost:8080/skills/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        text: taskDescription,
        email: userEmail
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to extract skills: ${response.status}`, errorText);
      return null;
    }

    const data = await response.json();
    console.log('Skills extracted:', data);
    return data;
  } catch (error) {
    console.error('Error extracting skills:', error);
    return null;
  }
}

function GlobalToast({
  data,
  onClose
}: {
  data: { skillName: string; experience: number };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className={styles.globalToast}>
      <div className={styles.toastContent}>
        <svg
          className={styles.toastIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span>
          +{data.experience} XP gained in {data.skillName}!
        </span>
      </div>
      <button className={styles.toastClose} onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>,
    document.body
  );
}

export default function ToDoCard({
  title,
  description,
  tags,
  status,
  dueDate,
  dueTime,
  id,
}: toDoCardProps) {
  const [isCompleted, setIsCompleted] = useState(status);
  const [showToast, setShowToast] = useState(false);
  console.log(tags)
  const [toastData, setToastData] = useState<{
    skillName: string;
    experience: number;
  } | null>(null);
  const [isProcessingSkills, setIsProcessingSkills] = useState(false);
  const userInfo = useAuth();

  useEffect(() => {
    setIsCompleted(status);
  }, [status]);

  const today = new Date();
  const dueDateTime = new Date(`${dueDate} ${dueTime}`);
  const timeLeft = dueDateTime.getTime() - today.getTime();
  const timeLeftInDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  const handleStatusToggle = async () => {
    if (isProcessingSkills) return;

    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    setIsProcessingSkills(true);

    if (newStatus && userInfo.user) {
      const skillData = await extractTaskSkills(
        title + ' ' + description,
        userInfo.user.email
      );
      if (skillData && skillData.skill) {
        setToastData({
          skillName: skillData.skill.name,
          experience: skillData.skill.experience
        });
        setShowToast(true);
      }
    }

    try {
      const result = await changeStatus(id, newStatus);

      if (result) {
        userInfo.updateTaskStatus(id, newStatus);
        
        window.dispatchEvent(new CustomEvent('task-status-changed'));
      } else {
        await userInfo.refreshAuth();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      setIsCompleted(!newStatus);
    } finally {
      setIsProcessingSkills(false);
    }
  };

  return (
    <>
      <div key={id} className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.checkmarkContainer}>
            <button
              className={`${styles.checkmarkButton} ${isCompleted ? styles.completed : ''} ${isProcessingSkills ? styles.processing : ''}`}
              onClick={handleStatusToggle}
              aria-label={
                isCompleted ? 'Mark as incomplete' : 'Mark as complete'
              }
              disabled={isProcessingSkills}
            >
              {isProcessingSkills ? (
                <svg
                  className={styles.spinner}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className={styles.spinnerPath}
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="3"
                  />
                </svg>
              ) : isCompleted ? (
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
            <img src={clockIcon} alt="clock" className={styles.timeLeftIcon} />
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
              />
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
              />
            </div>
            <span className={styles.dueDateTitle}>{dueDate || 'No date'}</span>
          </div>
          <div className={styles.dueTime}>
            <div className={styles.dueTimeIcon}>
              <img className={styles.dueTimeIcon} src={alarmIcon} alt="alarm" />
            </div>
            <span className={styles.dueTimeTitle}>{dueTime || 'No time'}</span>
          </div>
        </div>
      </div>

      {showToast && toastData && (
        <GlobalToast data={toastData} onClose={() => setShowToast(false)} />
      )}
    </>
  );
}
