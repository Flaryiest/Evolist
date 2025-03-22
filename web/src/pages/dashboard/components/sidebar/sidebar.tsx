import styles from './sidebar.module.css';
import dashboardIcon from './assets/dashboard.svg';
import tasksIcon from './assets/tasks.svg';
import skillsIcon from './assets/skills.svg';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div id={styles.sidebar}>
      <section className={styles.title}><img className={styles.logo} src="/evolition logo.webp"></img></section>
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
      </div>
    </div>
  );
}
