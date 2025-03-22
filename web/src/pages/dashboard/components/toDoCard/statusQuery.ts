export default async function changeStatus(taskId: number, newStatus: boolean) {
  try {
    console.log(`Attempting to update task ${taskId} status to ${newStatus}`);

    const response = await fetch(`http://localhost:8080/tasks/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId: taskId, status: newStatus })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`Server error updating task ${taskId}:`, responseData);
      throw new Error(`Failed to update task status: ${response.statusText}`);
    }

    if (responseData.success === true) {
      console.log(`Successfully updated task ${taskId} status to ${newStatus}`);
      return true;
    } else {
      console.error(
        `Server returned success: false for task ${taskId}:`,
        responseData
      );
      return false;
    }
  } catch (error) {
    console.error(`Error updating task ${taskId} status:`, error);
    return false;
  }
}
