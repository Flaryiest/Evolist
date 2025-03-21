import styles from './tasks.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
export default function Tasks() {
  return (
    <div id={styles.tasksPage}>
      <Sidebar />
    </div>
  );
}
