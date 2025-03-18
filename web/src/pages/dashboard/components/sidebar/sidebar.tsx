import styles from './sidebar.module.css';
import dashboardIcon from './assets/dashboard.svg';
import tasksIcon from './assets/tasks.svg';
import skillsIcon from './assets/skills.svg';
import leaderboardIcon from './assets/leaderboard.svg';
import settingsIcon from './assets/settings.svg';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div id={styles.sidebar}>
      <section className={styles.title}>Evolist</section>
      <div className={styles.divider}></div>
      <div className={styles.sectionContainer}>
        <Link to="/dashboard" className={styles.section}>
          <img src={dashboardIcon} className={styles.icon} alt="Dashboard" />
          <p className={styles.link}>Dashboard</p>
        </Link>
        <Link to="/dashboard/tasks" className={styles.section}>
          <img src={tasksIcon} className={styles.icon} alt="My Tasks" />
          <p className={styles.link}>Tasks</p>
        </Link>
        <Link to="/dashboard/skills" className={styles.section}>
          <img src={skillsIcon} className={styles.icon} alt="Skills" />
          <p className={styles.link}>Skills</p>
        </Link>
        <Link to="/dashboard/leaderboard" className={styles.section}>
          <img
            src={leaderboardIcon}
            className={styles.icon}
            alt="Leaderboard"
          />
          <p className={styles.link}>Leaderboard</p>
        </Link>
        <Link to="/dashboard/settings" className={styles.section}>
          <img src={settingsIcon} className={styles.icon} alt="Settings" />
          <p className={styles.link}>Settings</p>
        </Link>
      </div>
    </div>
  );
}
