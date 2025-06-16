import Tasks from '@/components/pages/Tasks';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  }
};

export const routeArray = Object.values(routes);
export default routes;