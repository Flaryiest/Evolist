import styles from './index.module.css';
import Navbar from '@/components/navbar/navbar';
import { Link } from 'react-router-dom';
export default function Index() {
  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.indexPage}>
        <div className={styles.content}>
          <div className={styles.leftSide}>
            <h1 className={styles.headline}>Level Up Your Productivity Journey</h1>
            <p className={styles.description}>
              Evolition transforms your everyday tasks into a meaningful skill development system. 
              Track your progress, visualize your growth, and watch as completed tasks translate into 
              tangible skills that evolve with you. Whether you're pursuing professional goals or 
              personal development, our platform helps you turn daily efforts into measurable growth.
            </p>
            <div className={styles.buttonContainer}>
              <Link to="/signup" className={styles.primaryButton}>Get Started</Link>
              <Link to="/login" className={styles.secondaryButton}>Sign In</Link>
            </div>
            <div className={styles.featureList}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Turn tasks into skills</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Track your progress visually</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Personalized skill suggestions</span>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <img src="/skill.webp" alt="skill" className={styles.rightImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
