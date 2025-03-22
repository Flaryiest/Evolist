import styles from './skills.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import SkillCard from '@dashboard/components/skillCard/skillCard.tsx';
import { useAuth } from '@/hooks/authContext';
import { useEffect, useState } from 'react';
import type { Skill, Task } from '@/types/dashboard/types';

type GeneratedTask = {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  tags: { title: string; type: string }[];
  status?: boolean;
};

export default function Skills() {
  const userInfo = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isAcceptingTask, setIsAcceptingTask] = useState(false);
  const [acceptingTaskId, setAcceptingTaskId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo.user?.email) {
      fetchSkills();
    }
  }, [userInfo.user?.email]);

  const fetchSkills = async () => {
    try {
      setIsLoadingSkills(true);
      setErrorMessage(null);

      const response = await fetch('http://localhost:8080/skills/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user?.email
        })
      });

      if (response.ok) {
        const data = await response.json();

        let skillsArray: Skill[] = [];

        if (data && data.skills && Array.isArray(data.skills)) {
          skillsArray = data.skills;
        } else if (Array.isArray(data)) {
          skillsArray = data;
        } else {
          console.error('Unexpected skills data format:', data);
          skillsArray = [];
        }

        // Sort skills by level (highest to lowest) and then by experience
        skillsArray.sort((a, b) => {
          const levelDiff = (b.level || 0) - (a.level || 0);

          if (levelDiff === 0) {
            return (b.experience || 0) - (a.experience || 0);
          }

          return levelDiff;
        });

        setSkills(skillsArray);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to fetch skills: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setErrorMessage('Network error while fetching skills');
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const generateTasks = async () => {
    if (!userInfo.user?.email) {
      setErrorMessage('You must be logged in to generate tasks');
      return;
    }

    try {
      setIsGeneratingTasks(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await fetch('http://localhost:8080/tasks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user.email,
          preferences: 'Generate tasks based on my skills'
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.tasks && Array.isArray(data.tasks)) {
          setGeneratedTasks(data.tasks);
          setSuccessMessage(
            'Tasks generated successfully! Review and accept them below.'
          );
        } else {
          setErrorMessage('Received invalid task data');
          console.error('Invalid task data:', data);
        }
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to generate tasks: ${errorText}`);
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
      setErrorMessage('Network error while generating tasks');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const acceptTask = async (task: GeneratedTask) => {
    if (!userInfo.user?.email) {
      setErrorMessage('You must be logged in to accept tasks');
      return;
    }

    try {
      setIsAcceptingTask(true);
      setAcceptingTaskId(task.id || null);
      setErrorMessage(null);

      const response = await fetch('http://localhost:8080/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user.email,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          dueTime: '12:00', // Default time
          tags: task.tags,
          status: false
        })
      });

      if (response.ok) {
        // Remove the accepted task from the generated tasks list
        setGeneratedTasks((prev) =>
          prev.filter(
            (t) => t.title !== task.title || t.description !== task.description
          )
        );

        setSuccessMessage(
          `Task "${task.title}" accepted and added to your tasks!`
        );

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to accept task: ${errorText}`);
      }
    } catch (error) {
      console.error('Error accepting task:', error);
      setErrorMessage('Network error while accepting task');
    } finally {
      setIsAcceptingTask(false);
      setAcceptingTaskId(null);
    }
  };

  return (
    <div id={styles.skillsPage}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.contentContainer}>
          <div className={styles.skillsHeader}>
            <h1>Skills</h1>
            <div className={styles.skillsActions}>
              <button
                className={styles.refreshButton}
                onClick={fetchSkills}
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
                <span>Refresh</span>
              </button>
              <button
                className={styles.generateTasksButton}
                onClick={generateTasks}
                disabled={isGeneratingTasks}
              >
                {isGeneratingTasks ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span>Generate Tasks</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className={styles.errorMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)}>×</button>
            </div>
          )}

          {successMessage && (
            <div className={styles.successMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)}>×</button>
            </div>
          )}
          {generatedTasks.length > 0 && (
            <div className={styles.generatedTasksSection}>
              <h2>Suggested Tasks</h2>
              <p className={styles.generatedTasksIntro}>
                Based on your skills, here are some suggested tasks you might
                want to take on:
              </p>
              <div className={styles.generatedTasksGrid}>
                {generatedTasks.map((task, index) => (
                  <div key={index} className={styles.generatedTaskCard}>
                    <h3 className={styles.generatedTaskTitle}>{task.title}</h3>
                    <p className={styles.generatedTaskDescription}>
                      {task.description}
                    </p>
                    <div className={styles.generatedTaskDetails}>
                      <span className={styles.generatedTaskDueDate}>
                        Due: {task.dueDate}
                      </span>
                      <div className={styles.generatedTaskTags}>
                        {task.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`${styles.generatedTaskTag} ${styles[`tag${tag.type || 'default'}`]}`}
                          >
                            {tag.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      className={styles.acceptTaskButton}
                      onClick={() => acceptTask(task)}
                      disabled={isAcceptingTask && acceptingTaskId === task.id}
                    >
                      {isAcceptingTask && acceptingTaskId === task.id ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          <span>Accepting...</span>
                        </>
                      ) : (
                        <>
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
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          <span>Accept Task</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className={styles.skillsSectionHeader}>My Skills</h2>

          {isLoadingSkills ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3>No skills yet</h3>
              <p>
                Complete tasks to gain skills and level them up. As you work
                through tasks, you'll automatically build your skill set.
              </p>
            </div>
          ) : (
            <div className={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id || index}
                  id={skill.id}
                  name={skill.name}
                  level={skill.level || 1}
                  experience={skill.experience || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
