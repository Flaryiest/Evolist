import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
import { useAuth } from '@/hooks/authContext';
export default function Home() {
  const userInfo = useAuth();
  console.log('userinfo', userInfo);
  if (userInfo.user) {
    console.log('User object keys:', Object.keys(userInfo.user));
    console.log('Full user object:', userInfo.user);
  }
  if (userInfo.user != null) {
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
  } else {
    userInfo.refreshAuth();
    return <div></div>;
  }
}
