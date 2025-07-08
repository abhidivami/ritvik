import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type TaskFilter = 'assigned-to-me' | 'assigned-by-me' | 'dashboard'

interface DashboardProps {
  taskCounts: {
    assignedToMe: number
    assignedByMe: number
    myPending: number
    myInProgress: number
    myCompleted: number
    delegatedPending: number
    delegatedInProgress: number
    delegatedCompleted: number
  }
  onFilterChange: (filter: TaskFilter) => void
  onCreateTask: () => void
}

export function Dashboard({ taskCounts, onFilterChange, onCreateTask }: DashboardProps) {
  const myTaskStats = [
    { label: "Pending", count: taskCounts.myPending, variant: "pending" as const, color: "bg-status-pending" },
    { label: "In Progress", count: taskCounts.myInProgress, variant: "progress" as const, color: "bg-status-progress" },
    { label: "Completed", count: taskCounts.myCompleted, variant: "completed" as const, color: "bg-status-completed" },
  ]

  const delegatedTaskStats = [
    { label: "Pending", count: taskCounts.delegatedPending, variant: "pending" as const, color: "bg-status-pending" },
    { label: "In Progress", count: taskCounts.delegatedInProgress, variant: "progress" as const, color: "bg-status-progress" },
    { label: "Completed", count: taskCounts.delegatedCompleted, variant: "completed" as const, color: "bg-status-completed" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your tasks and team assignments
          </p>
        </div>
        <Button variant="gradient" size="lg" onClick={onCreateTask}>
          Create New Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned to Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{taskCounts.assignedToMe}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFilterChange('assigned-to-me')}
              className="text-primary hover:bg-primary/10"
            >
              View All →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned by Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">{taskCounts.assignedByMe}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFilterChange('assigned-by-me')}
              className="text-accent hover:bg-accent/10"
            >
              View All →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success mb-2">
              {taskCounts.myCompleted + taskCounts.delegatedCompleted}
            </div>
            <p className="text-xs text-muted-foreground">Great progress!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning mb-2">
              {taskCounts.myInProgress + taskCounts.delegatedInProgress}
            </div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tasks Assigned to Me</CardTitle>
            <p className="text-sm text-muted-foreground">Current status breakdown</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {myTaskStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card hover:shadow-soft transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="font-medium">{stat.label}</span>
                </div>
                <Badge variant={stat.variant}>{stat.count}</Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onFilterChange('assigned-to-me')}
            >
              View All My Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Delegated Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tasks Assigned by Me</CardTitle>
            <p className="text-sm text-muted-foreground">Team progress overview</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {delegatedTaskStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card hover:shadow-soft transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="font-medium">{stat.label}</span>
                </div>
                <Badge variant={stat.variant}>{stat.count}</Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onFilterChange('assigned-by-me')}
            >
              View All Delegated Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}