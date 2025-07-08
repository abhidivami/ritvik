import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Task, TaskStatus } from "./TaskCard"

interface TaskModalProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
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

export function TaskModal({ task, open, onClose, onStatusChange, onEdit, onDelete }: TaskModalProps) {
  if (!task) return null

  const currentStatus = statusOptions.find(s => s.status === task.status)
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange?.(task.id, newStatus)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold text-foreground pr-4">
              {task.title}
            </DialogTitle>
            <div className="flex gap-2 flex-shrink-0">
              <Badge 
                variant={isOverdue ? 'overdue' : currentStatus?.variant || 'pending'}
              >
                {isOverdue ? 'Overdue' : currentStatus?.label}
              </Badge>
              <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Description</h4>
            <p className="text-foreground whitespace-pre-wrap">{task.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Assigned To</h4>
                <p className="text-foreground">{task.assignedTo}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Assigned By</h4>
                <p className="text-foreground">{task.assignedBy}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Due Date</h4>
                <p className="text-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Created</h4>
                <p className="text-foreground">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.status}
                  variant={task.status === option.status ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(option.status)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={() => onEdit?.(task)}>
            Edit Task
          </Button>
          <Button variant="destructive" onClick={() => onDelete?.(task.id)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}