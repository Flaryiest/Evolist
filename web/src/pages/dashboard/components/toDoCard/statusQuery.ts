export default async function changeStatus(taskId: number, newStatus: boolean) {
  try {
    const response = await fetch(`http://localhost:8080/tasks/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId: taskId, status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    return true;
  } catch (error) {
    console.error('Error updating task status:', error);
    return false;
  }
}
