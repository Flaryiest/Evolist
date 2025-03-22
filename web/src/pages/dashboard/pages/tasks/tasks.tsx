import styles from './tasks.module.css';
import Sidebar from '@dashboard/components/sidebar/sidebar.tsx';
import Header from '@dashboard/components/header/header.tsx';
import ToDoCard from '@dashboard/components/toDoCard/toDoCard.tsx';
import { useAuth } from '@/hooks/authContext';
import { useEffect, useState } from 'react';
import type { Task, tag } from '@/types/dashboard/types';

type TaskFormData = {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  tags: tag[];
};

export default function Tasks() {
  const userInfo = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [tagType, setTagType] = useState('default');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState('all'); 

  useEffect(() => {
    fetchTasks();
  }, [userInfo.user?.email]);

  const fetchTasks = async () => {
    if (!userInfo.user?.email) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
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
          setError('Failed to load tasks: Unexpected data format');
          tasksArray = [];
        }
        

        if (tasksArray.length > 0) {
          console.log('First task:', tasksArray[0]);
        
          const validTasks = tasksArray.filter(task => 
            task && 
            task.id && 
            task.title && 
            typeof task.status !== 'undefined'
          );
          
          if (validTasks.length !== tasksArray.length) {
            console.warn(`Filtered out ${tasksArray.length - validTasks.length} invalid tasks`);
          }
          
          tasksArray = validTasks;
        }
        
        tasksArray.sort((a, b) => {
          const dateA = new Date(`${a.dueDate || '9999-12-31'} ${a.dueTime || '23:59'}`);
          const dateB = new Date(`${b.dueDate || '9999-12-31'} ${b.dueTime || '23:59'}`);
          return dateA.getTime() - dateB.getTime();
        });
        
        setTasks(tasksArray);
      } else {
        console.error('Failed to fetch tasks:', response.status);
        setError('Failed to load tasks: Server error');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks: Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { title: tagInput.trim(), type: tagType }]
    }));
    
    setTagInput('');
    setTagType('default');
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userInfo.user?.email,
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          dueTime: formData.dueTime || '23:59',
          tags: formData.tags,
          status: false
        })
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          dueTime: '',
          tags: []
        });
        
        setShowForm(false);
        
        fetchTasks();
      } else {
        const errorText = await response.text();
        setError(`Failed to create task: ${errorText || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task: Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'completed') return task.status;
    if (taskFilter === 'incomplete') return !task.status;
    return true;
  });

  return (
    <div id={styles.tasksPage}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.contentContainer}>
          <div className={styles.tasksHeader}>
            <h1>My Tasks</h1>
            <button 
              className={styles.addTaskButton}
              onClick={() => setShowForm(true)}
            >
              + New Task
            </button>
          </div>
          
          <div className={styles.filterContainer}>
            <button 
              className={`${styles.filterButton} ${taskFilter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setTaskFilter('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterButton} ${taskFilter === 'incomplete' ? styles.activeFilter : ''}`}
              onClick={() => setTaskFilter('incomplete')}
            >
              Incomplete
            </button>
            <button 
              className={`${styles.filterButton} ${taskFilter === 'completed' ? styles.activeFilter : ''}`}
              onClick={() => setTaskFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading tasks...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={fetchTasks}
              >
                Retry
              </button>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className={styles.tasksGrid}>
              {filteredTasks.map(task => (
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
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          )}
        </div>
      </div>
      
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalOverlay} onClick={() => setShowForm(false)}></div>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Create New Task</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className={styles.formError}>
                  {error}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Task title"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your task"
                  rows={4}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="dueDate">Due Date*</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="dueTime">Due Time</label>
                  <input
                    type="time"
                    id="dueTime"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Tags</label>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <select 
                    value={tagType}
                    onChange={(e) => setTagType(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="success">Success</option>
                    <option value="danger">Danger</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={addTag}
                    className={styles.addTagButton}
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {formData.tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className={`${styles.tag} ${styles[`tag${tag.type}`]}`}
                      >
                        {tag.title}
                        <button 
                          type="button"
                          onClick={() => removeTag(index)}
                          className={styles.removeTagButton}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.buttonSpinner}></div>
                      Creating...
                    </>
                  ) : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
