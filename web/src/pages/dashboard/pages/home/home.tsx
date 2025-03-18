import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
export default function Home() {
  return (
    <div id={styles.home}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.contentContainer}>
          <div className={styles.contentLeft}>
            <ProgressBar title="Today" percentage={50} color="#4f46e5" />
          </div>
          <div className={styles.contentRight}></div>
        </div>
      </div>
    </div>
  );
}
