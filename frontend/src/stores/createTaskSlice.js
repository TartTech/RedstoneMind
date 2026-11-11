
import { apiHelper } from '@/lib/api';

export const createTaskSlice = (set, get) => ({
    tasks: [],
    
    fetchTasks: async () => {
        try {
            const tasksData = await apiHelper('/api/tasks');
            set({ tasks: tasksData || [] });
        } catch (error) {
            console.error("Не удалось загрузить задачи:", error.message);
            set({ tasks: [] });
        }
    },

    createTask: async (taskData) => {
        const newTask = await apiHelper('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        }, t('zadachaUspeshnoSozdana'));
        
        if (newTask) {
            set(state => {
                state.tasks.unshift(newTask);
            });
        }
        return newTask;
    },

    updateTask: async (taskId, dataToUpdate) => {
        const updatedTask = await apiHelper(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToUpdate),
        }, t('zadachaUspeshnoObnovlena'));
        
        if (updatedTask) {
            set(state => {
                const taskIndex = state.tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
                }
            });
        }
        return updatedTask;
    },

    deleteTask: async (taskId) => {
        await apiHelper(`/api/tasks/${taskId}`, { method: 'DELETE' }, t('zadachaUspeshnoUdalena'));
        set(state => {
            state.tasks = state.tasks.filter(t => t.id !== taskId);
        });
    },
});