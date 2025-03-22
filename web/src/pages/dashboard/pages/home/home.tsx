import styles from './home.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ToDoCard from '@dashboard/components/toDoCard/toDoCard.tsx';
import type { Skill, Task } from '@/types/dashboard/types';
import SkillCard from '@dashboard/components/skillCard/skillCard.tsx';
import ProgressBar from '../../components/progressBar/progressBar';
import { useAuth } from '@/hooks/authContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const userInfo = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [taskUpdateCounter, setTaskUpdateCounter] = useState(0);

  useEffect(() => {
    const handleTaskStatusChange = () => {
      setTaskUpdateCounter((prev) => prev + 1);
    };

    window.addEventListener('task-status-changed', handleTaskStatusChange);

    return () => {
      window.removeEventListener('task-status-changed', handleTaskStatusChange);
    };
  }, []);

  // Fetch skills
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

  useEffect(() => {
    const fetchTasks = async () => {
      if (userInfo.user?.email) {
        try {
          setIsLoadingTasks(true);
          const response = await fetch('http://localhost:8080/tasks/get', {
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
            console.log('Tasks data:', data);

            let tasksArray: Task[] = [];

            if (data && data.tasks && Array.isArray(data.tasks)) {
              tasksArray = data.tasks;
            } else if (Array.isArray(data)) {
              tasksArray = data;
            } else {
              console.error('Unexpected tasks data format:', data);
              tasksArray = [];
            }

            tasksArray.sort((a, b) => {
              if (Boolean(a.status) !== Boolean(b.status)) {
                return Boolean(a.status) ? 1 : -1;
              }
              const dateA = new Date(
                `${a.dueDate || '9999-12-31'} ${a.dueTime || '23:59'}`
              );
              const dateB = new Date(
                `${b.dueDate || '9999-12-31'} ${b.dueTime || '23:59'}`
              );
              return dateA.getTime() - dateB.getTime();
            });

            setTasks(tasksArray);
          } else {
            console.error('Failed to fetch tasks:', response.status);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsLoadingTasks(false);
        }
      }
    };

    fetchTasks();
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
        .then((response) => response.json())
        .then((data) => {
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
        .catch((error) => console.error('Error refreshing skills:', error))
        .finally(() => setIsLoadingSkills(false));
    }
  };

  const refreshTasks = () => {
    console.log('Manually refreshing tasks...');
    if (userInfo.user?.email) {
      setIsLoadingTasks(true);
      fetch('http://localhost:8080/tasks/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user.email
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Refreshed tasks data:', data);

          let tasksArray: Task[] = [];

          if (data && data.tasks && Array.isArray(data.tasks)) {
            tasksArray = data.tasks;
          } else if (Array.isArray(data)) {
            tasksArray = data;
          } else {
            console.error('Unexpected tasks data format:', data);
            tasksArray = [];
          }

          tasksArray.sort((a, b) => {
            const dateA = new Date(
              `${a.dueDate || '9999-12-31'} ${a.dueTime || '23:59'}`
            );
            const dateB = new Date(
              `${b.dueDate || '9999-12-31'} ${b.dueTime || '23:59'}`
            );
            return dateA.getTime() - dateB.getTime();
          });

          setTasks(tasksArray);
        })
        .catch((error) => console.error('Error refreshing tasks:', error))
        .finally(() => setIsLoadingTasks(false));
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
                <ProgressBar title="Today" percentage={100} color="#4f46e5" />
              </div>
              <h2 className={styles.contentHeader}>
                Upcoming Work
                <button
                  className={styles.refreshTasksButton}
                  onClick={refreshTasks}
                  title="Refresh tasks"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 4v6h6"></path>
                    <path d="M23 20v-6h-6"></path>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
              </h2>
              <div className={styles.taskContainer}>
                {isLoadingTasks ? (
                  <div className={styles.tasksLoading}>
                    <div className={styles.tasksSpinner}></div>
                    <p>Loading tasks...</p>
                  </div>
                ) : Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.map((task) => {
                    return (
                      <ToDoCard
                        key={task.id}
                        id={task.id}
                        title={task.title || 'Untitled Task'}
                        description={task.description || ''}
                        tags={task.tags || []}
                        status={Boolean(task.status)}
                        dueDate={task.dueDate || 'No date'}
                        dueTime={task.dueTime || 'No time'}
                      />
                    );
                  })
                ) : (
                  <div className={styles.emptyTasks}>
                    <p>No tasks yet. Create a task to get started!</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.contentRight}>
              <div className={styles.mySkills}>
                <h3 className={styles.mySkillsHeader}>
                  Skills
                  <button
                    className={styles.refreshButton}
                    onClick={refreshSkills}
                    title="Refresh skills"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 4v6h6"></path>
                      <path d="M23 20v-6h-6"></path>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                  </button>
                </h3>
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
