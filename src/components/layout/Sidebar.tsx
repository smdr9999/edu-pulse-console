import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Bell,
  Settings,
  X,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Students", badge: "234" },
  { icon: GraduationCap, label: "Teachers", badge: "45" },
  { icon: BookOpen, label: "Courses", badge: "12" },
  { icon: Calendar, label: "Attendance" },
  { icon: Bell, label: "Notifications", badge: "3" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">EduPulse</h1>
                <p className="text-xs text-sidebar-foreground/70">Admin Console</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={item.label}
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 text-left transition-all duration-200",
                    item.active 
                      ? "bg-gradient-primary text-white shadow-lg" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    "animate-slide-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {hoveredItem === item.label && !item.active && (
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  )}
                </Button>
              ))}
            </nav>
          </ScrollArea>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">admin@edupulse.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}