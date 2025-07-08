import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Dashboard } from "@/components/Dashboard"
import { TaskList } from "@/components/TaskList"
import { CreateTaskModal } from "@/components/CreateTaskModal"
import { Task, TaskStatus } from "@/components/TaskCard"
import { useToast } from "@/hooks/use-toast"

type TaskFilter = 'assigned-to-me' | 'assigned-by-me' | 'dashboard'

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up login/logout functionality with email validation and secure session management.',
    status: 'progress',
    assignedTo: 'john.doe@company.com',
    assignedBy: 'manager@company.com',
    dueDate: '2024-12-15',
    createdAt: '2024-12-01',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Design database schema',
    description: 'Create PostgreSQL database schema for task management system with proper relationships.',
    status: 'pending',
    assignedTo: 'jane.smith@company.com',
    assignedBy: 'john.doe@company.com',
    dueDate: '2024-12-20',
    createdAt: '2024-12-02',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples and response formats.',
    status: 'completed',
    assignedTo: 'john.doe@company.com',
    assignedBy: 'manager@company.com',
    dueDate: '2024-12-10',
    createdAt: '2024-11-28',
    priority: 'low'
  },
  {
    id: '4',
    title: 'Set up email notifications',
    description: 'Configure email service for task assignments and status updates.',
    status: 'pending',
    assignedTo: 'alice.wilson@company.com',
    assignedBy: 'john.doe@company.com',
    dueDate: '2024-12-18',
    createdAt: '2024-12-03',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Mobile responsive testing',
    description: 'Test and fix mobile responsiveness across different devices and screen sizes.',
    status: 'overdue',
    assignedTo: 'john.doe@company.com',
    assignedBy: 'manager@company.com',
    dueDate: '2024-12-05',
    createdAt: '2024-11-25',
    priority: 'high'
  }
]

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('dashboard')
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { toast } = useToast()

  // Calculate task counts
  const taskCounts = {
    assignedToMe: tasks.filter(t => t.assignedTo === 'john.doe@company.com').length,
    assignedByMe: tasks.filter(t => t.assignedBy === 'john.doe@company.com').length,
    myPending: tasks.filter(t => t.assignedTo === 'john.doe@company.com' && t.status === 'pending').length,
    myInProgress: tasks.filter(t => t.assignedTo === 'john.doe@company.com' && t.status === 'progress').length,
    myCompleted: tasks.filter(t => t.assignedTo === 'john.doe@company.com' && t.status === 'completed').length,
    delegatedPending: tasks.filter(t => t.assignedBy === 'john.doe@company.com' && t.status === 'pending').length,
    delegatedInProgress: tasks.filter(t => t.assignedBy === 'john.doe@company.com' && t.status === 'progress').length,
    delegatedCompleted: tasks.filter(t => t.assignedBy === 'john.doe@company.com' && t.status === 'completed').length,
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`,
    })
  }

  const handleCreateTask = () => {
    setCreateModalOpen(true)
  }

  const handleCreateNewTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'assignedBy'>) => {
    const newTask: Task = {
      ...taskData,
      id: (tasks.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0],
      assignedBy: 'john.doe@company.com' // Current user
    }
    
    setTasks(prev => [...prev, newTask])
    toast({
      title: "Task Created",
      description: `Task "${newTask.title}" has been created successfully.`,
    })
  }

  const handleEditTask = (task: Task) => {
    toast({
      title: "Edit Task",
      description: `Editing ${task.title}`,
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast({
      title: "Task Deleted",
      description: "Task has been successfully deleted.",
    })
  }

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'assigned-to-me':
        return tasks.filter(t => t.assignedTo === 'john.doe@company.com')
      case 'assigned-by-me':
        return tasks.filter(t => t.assignedBy === 'john.doe@company.com')
      default:
        return tasks
    }
  }

  const getPageTitle = () => {
    switch (activeFilter) {
      case 'assigned-to-me':
        return 'Tasks Assigned to Me'
      case 'assigned-by-me':
        return 'Tasks Assigned by Me'
      default:
        return 'Dashboard'
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={taskCounts}
        />
        
        <main className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-foreground">Ritvik Task Management</h2>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {activeFilter === 'dashboard' ? (
              <Dashboard 
                taskCounts={taskCounts}
                onFilterChange={setActiveFilter}
                onCreateTask={handleCreateTask}
              />
            ) : (
              <TaskList
                tasks={getFilteredTasks()}
                title={getPageTitle()}
                onCreateTask={handleCreateTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          {/* Create Task Modal */}
          <CreateTaskModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreateTask={handleCreateNewTask}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
