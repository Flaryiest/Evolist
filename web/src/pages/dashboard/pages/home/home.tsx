import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ToDoCard from '@dashboard/components/toDoCard/toDoCard.tsx';
import SkillCard from '@dashboard/components/skillCard/skillCard.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
import { useAuth } from '@/hooks/authContext';
import { useEffect } from 'react';
export default function Home() {
  const userInfo = useAuth();
  
  useEffect(() => {

  }, [])

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
                <div className={styles.skillsGrid}>
                  {userInfo.user.skills && userInfo.user.skills.length > 0 ? (
                    userInfo.user.skills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        name={skill.name}
                        level={skill.level || 0}
                        experience={skill.experience}
                      />
                    ))
                  ) : (
                    <div className={styles.emptySkills}>
                      <p>No skills yet. Complete tasks to earn skills!</p>
                    </div>
                  )}
                </div>
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
