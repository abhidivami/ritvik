import { useState } from "react"
import { TaskCard, Task, TaskStatus } from "./TaskCard"
import { TaskModal } from "./TaskModal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TaskListProps {
  tasks: Task[]
  title: string
  onCreateTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
}

export function TaskList({ 
  tasks, 
  title, 
  onCreateTask, 
  onEditTask, 
  onDeleteTask, 
  onStatusChange 
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTask(null)
  }

  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex gap-2 mt-3">
            <Badge variant="pending">{statusCounts.pending} Pending</Badge>
            <Badge variant="progress">{statusCounts.progress} In Progress</Badge>
            <Badge variant="completed">{statusCounts.completed} Completed</Badge>
            {statusCounts.overdue > 0 && (
              <Badge variant="overdue">{statusCounts.overdue} Overdue</Badge>
            )}
          </div>
        </div>
        <Button variant="gradient" size="lg" onClick={onCreateTask}>
          Create New Task
        </Button>
      </div>

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-muted-foreground">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
          <Button variant="gradient" onClick={onCreateTask}>
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={handleTaskClick}
              onStatusChange={onStatusChange}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        open={modalOpen}
        onClose={handleCloseModal}
        onStatusChange={onStatusChange}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
      />
    </div>
  )
}