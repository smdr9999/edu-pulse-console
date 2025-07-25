import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  UserPlus, 
  GraduationCap, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "enrollment",
    icon: UserPlus,
    title: "New student enrolled",
    description: "Sarah Johnson joined Class 10-A",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: 2,
    type: "teacher",
    icon: GraduationCap,
    title: "Teacher assignment updated",
    description: "Mr. Smith assigned to Mathematics",
    time: "15 minutes ago",
    status: "info"
  },
  {
    id: 3,
    type: "attendance",
    icon: Calendar,
    title: "Attendance marked",
    description: "Class 9-B morning attendance completed",
    time: "1 hour ago",
    status: "success"
  },
  {
    id: 4,
    type: "alert",
    icon: AlertCircle,
    title: "Low attendance alert",
    description: "Class 8-C has 70% attendance this week",
    time: "2 hours ago",
    status: "warning"
  },
  {
    id: 5,
    type: "system",
    icon: CheckCircle,
    title: "System backup completed",
    description: "Daily backup completed successfully",
    time: "3 hours ago",
    status: "success"
  }
];

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-3 animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className={getStatusColor(activity.status)}>
                <activity.icon className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.title}</p>
                <Badge variant="outline" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}