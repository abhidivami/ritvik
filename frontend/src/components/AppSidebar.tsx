import { useState } from "react"
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

type TaskFilter = 'assigned-to-me' | 'assigned-by-me' | 'dashboard'

interface AppSidebarProps {
  activeFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
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
}

export function AppSidebar({ activeFilter, onFilterChange, taskCounts }: AppSidebarProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const menuItems = [
    { 
      id: 'dashboard' as TaskFilter, 
      title: 'Dashboard', 
      count: taskCounts.assignedToMe + taskCounts.assignedByMe 
    },
    { 
      id: 'assigned-to-me' as TaskFilter, 
      title: 'Tasks Assigned to Me', 
      count: taskCounts.assignedToMe 
    },
    { 
      id: 'assigned-by-me' as TaskFilter, 
      title: 'Tasks Assigned by Me', 
      count: taskCounts.assignedByMe 
    },
  ]

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-background to-muted/20">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Ritvik
                </h1>
                <p className="text-xs text-muted-foreground">Task Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4 py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onFilterChange(item.id)}
                    className={`${getNavCls(activeFilter === item.id)} transition-all duration-200 h-11`}
                  >
                    <div className="flex items-center justify-between w-full">
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium">{item.title}</span>
                          <Badge 
                            variant={activeFilter === item.id ? "default" : "secondary"} 
                            className="ml-2 text-xs"
                          >
                            {item.count}
                          </Badge>
                        </>
                      )}
                      {collapsed && (
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold">{item.count}</span>
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}