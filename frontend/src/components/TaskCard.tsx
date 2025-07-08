import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type TaskStatus = 'pending' | 'progress' | 'completed' | 'overdue'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignedTo: string
  assignedBy: string
  dueDate: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onDelete?: (taskId: string) => void
  onClick?: (task: Task) => void
}

const statusOptions: { status: TaskStatus; label: string; variant: any }[] = [
  { status: 'pending', label: 'Pending', variant: 'pending' },
  { status: 'progress', label: 'In Progress', variant: 'progress' },
  { status: 'completed', label: 'Completed', variant: 'completed' },
  { status: 'overdue', label: 'Overdue', variant: 'overdue' },
]

const priorityColors = {
  low: 'text-success',
  medium: 'text-warning', 
  high: 'text-destructive'
}

export function TaskCard({ task, onEdit, onStatusChange, onDelete, onClick }: TaskCardProps) {
  const currentStatus = statusOptions.find(s => s.status === task.status)
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange?.(task.id, newStatus)
  }

  return (
    <Card 
      className="cursor-pointer group" 
      onClick={() => onClick?.(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant={isOverdue ? 'overdue' : currentStatus?.variant || 'pending'}
              className="text-xs"
            >
              {isOverdue ? 'Overdue' : currentStatus?.label}
            </Badge>
            <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="space-y-1">
            <div>Assigned to: <span className="font-medium text-foreground">{task.assignedTo}</span></div>
            <div>By: <span className="font-medium text-foreground">{task.assignedBy}</span></div>
          </div>
          <div className="text-right space-y-1">
            <div>Due: <span className="font-medium text-foreground">{new Date(task.dueDate).toLocaleDateString()}</span></div>
            <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
          {statusOptions.map((option) => (
            <Button
              key={option.status}
              variant={task.status === option.status ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange(option.status)}
              className="text-xs h-7"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}