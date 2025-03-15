import styles from './index.module.css';
import Navbar from '@/components/navbar/navbar';
export default function Index() {
  return (
    <div className="page">
      <Navbar></Navbar>
      <div className={styles.indexPage}>
        
      </div>
    </div>
  );
}
