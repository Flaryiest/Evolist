import styles from './skillCard.module.css';
import type { Skill } from '@/types/dashboard/types';
import { useEffect, useState } from 'react';

export default function SkillCard({ name, level, experience }: Skill) {
  const [progressWidth, setProgressWidth] = useState('0%');
  useEffect(() => {
    const maxExperience = 100;
    const width = Math.min((experience / maxExperience) * 100, 100);
    setProgressWidth(`${width}%`);
  }, [experience]);

  const getLevelInfo = () => {
    let levelLabel = 'Beginner';
    let levelColor = '#4ade80';

    if (level >= 80) {
      levelLabel = 'Expert';
      levelColor = '#f59e0b';
    } else if (level >= 60) {
      levelLabel = 'Advanced';
      levelColor = '#8b5cf6';
    } else if (level >= 40) {
      levelLabel = 'Intermediate';
      levelColor = '#3b82f6';
    }

    return { levelLabel, levelColor };
  };

  const { levelLabel, levelColor } = getLevelInfo();

  return (
    <div className={styles.skillCard}>
      <div className={styles.skillHeader}>
        <h3 className={styles.skillName}>{name}</h3>
        <span
          className={styles.skillLevel}
          style={{ backgroundColor: levelColor }}
        >
          {levelLabel}
        </span>
      </div>

      <div className={styles.experienceContainer}>
        <div className={styles.experienceBar}>
          <div
            className={styles.progressBar}
            style={{
              width: progressWidth,
              backgroundColor: levelColor
            }}
          />
        </div>
        <div className={styles.statsRow}>
          <span className={styles.levelText}>Level {level}</span>
          <span className={styles.experienceText}>{experience} Experience</span>
        </div>
      </div>
    </div>
  );
}
