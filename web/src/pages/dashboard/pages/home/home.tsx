import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ToDoCard from '@dashboard/components/toDoCard/toDoCard.tsx';
import type {Skill} from '@/types/dashboard/types';
import SkillCard from '@dashboard/components/skillCard/skillCard.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
import { useAuth } from '@/hooks/authContext';
import { useEffect, useState } from 'react';


export default function Home() {
  const userInfo = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [taskUpdateCounter, setTaskUpdateCounter] = useState(0);

  useEffect(() => {
    const handleTaskStatusChange = () => {
      setTaskUpdateCounter(prev => prev + 1);
    };

    window.addEventListener('task-status-changed', handleTaskStatusChange);
    
    return () => {
      window.removeEventListener('task-status-changed', handleTaskStatusChange);
    };
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      if (userInfo.user?.email) {
        try {
          setIsLoadingSkills(true);
          const response = await fetch('http://localhost:8080/skills/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              email: userInfo.user.email
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Skills data:', data);
            
            let skillsArray: Skill[] = [];
            
            if (data && data.skills && Array.isArray(data.skills)) {
              skillsArray = data.skills;
            } else if (Array.isArray(data)) {
              skillsArray = data;
            } else {
              console.error('Unexpected skills data format:', data);
              skillsArray = [];
            }
            
            skillsArray.sort((a, b) => {
              const levelDiff = (b.level || 0) - (a.level || 0);
              
              if (levelDiff === 0) {
                return (b.experience || 0) - (a.experience || 0);
              }
              
              return levelDiff;
            });
            
            setSkills(skillsArray);
          } else {
            console.error('Failed to fetch skills:', response.status);
          }
        } catch (error) {
          console.error('Error fetching skills:', error);
        } finally {
          setIsLoadingSkills(false);
        }
      }
    };

    fetchSkills();
  }, [userInfo.user?.email, taskUpdateCounter]);

  const refreshSkills = () => {
    console.log('Manually refreshing skills...');
    if (userInfo.user?.email) {
      setIsLoadingSkills(true);
      fetch('http://localhost:8080/skills/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user.email
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Refreshed skills data:', data);
        
        let skillsArray: Skill[] = [];
        
        if (data && data.skills && Array.isArray(data.skills)) {
          skillsArray = data.skills;
        } else if (Array.isArray(data)) {
          skillsArray = data;
        } else {
          console.error('Unexpected skills data format:', data);
          skillsArray = [];
        }
        
        skillsArray.sort((a, b) => {
          const levelDiff = (b.level || 0) - (a.level || 0);
          
          if (levelDiff === 0) {
            return (b.experience || 0) - (a.experience || 0);
          }
          
          return levelDiff;
        });
        
        setSkills(skillsArray);
      })
      .catch(error => console.error('Error refreshing skills:', error))
      .finally(() => setIsLoadingSkills(false));
    }
  };

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
                  {isLoadingSkills ? (
                    <div className={styles.skillsLoading}>
                      <div className={styles.skillsSpinner}></div>
                      <p>Loading skills...</p>
                    </div>
                  ) : Array.isArray(skills) && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <SkillCard
                        key={skill.id || index}
                        id={skill.id}
                        name={skill.name || 'Unnamed Skill'}
                        level={skill.level || 0}
                        experience={skill.experience || 0}
                      />
                    ))
                  ) : (
                    <div className={styles.emptySkills}>
                      <p>No skills yet. Complete tasks to earn skills!</p>
                      <button 
                        className={styles.refreshButton}
                        onClick={refreshSkills}
                      >
                        Refresh Skills
                      </button>
                      <div className={styles.debugInfo}>
                        <p>Debug Info:</p>
                        <pre>
                          {JSON.stringify({
                            userEmail: userInfo.user?.email,
                            skills: skills,
                            isArray: Array.isArray(skills),
                            skillsLength: Array.isArray(skills) ? skills.length : 'not an array',
                            originalData: userInfo.user?.skills
                          }, null, 2)}
                        </pre>
                      </div>
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
