import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ToDoCard from '@dashboard/components/toDoCard/toDoCard.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
import { useAuth } from '@/hooks/authContext';

export default function Home() {
  const userInfo = useAuth();
  console.log('userinfo', userInfo);

  if (userInfo.user) {
    console.log('Full user object:', userInfo.user);
    console.log(userInfo.user.tasks);
  }

  if (userInfo.user != null) {
    return (
      <div id={styles.home}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <div className={styles.contentContainer}>
            <div className={styles.contentLeft}>
              <div className={styles.progressContainer}>
                <ProgressBar title="Today" percentage={10} color="#4f46e5" />
              </div>
              <h2 className={styles.contentHeader}>Upcoming Work</h2>
              <div className={styles.taskContainer}>
                {userInfo.user.tasks.map((task) => {
                  return (
                    <ToDoCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      tags={task.tags}
                      status={task.status}
                      dueDate={task.dueDate}
                      dueTime={task.dueTime}
                    />
                  );
                })}
              </div>
            </div>
            <div className={styles.contentRight}>
              <div className={styles.dailyTasks}>
                <h3 className={styles.dailyTasksHeader}>Daily Tasks</h3>
                
              </div>
              <div className={styles.mySkills}>
                <h3 className={styles.mySkillsHeader}>Skills</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    userInfo.refreshAuth();
    return <div></div>;
  }
}
