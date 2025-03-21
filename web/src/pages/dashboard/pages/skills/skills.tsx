import styles from './skills.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
export default function Skills() {
  return (
    <div id={styles.skillsPage}>
      <Sidebar />
      <div className={styles.skillsContainer}>
        <h1 className={styles.skillsHeader}>Skills</h1>
      </div>
    </div>
  );
}
