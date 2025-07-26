import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserPlus, 
  GraduationCap, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  User
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  icon: any;
  title: string;
  description: string;
  time: string;
  status: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const formattedActivities = data?.map((activity) => ({
          id: activity.id,
          type: activity.activity_type,
          icon: getIconForType(activity.activity_type),
          title: getTitleForType(activity.activity_type),
          description: activity.description,
          time: formatTimeAgo(activity.created_at),
          status: getStatusForType(activity.activity_type)
        })) || [];

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Set fallback activities if fetch fails
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'enrollment': return UserPlus;
      case 'attendance_marked': return Calendar;
      case 'course_creation': return BookOpen;
      case 'teacher_added': return GraduationCap;
      case 'grade_updated': return CheckCircle;
      default: return User;
    }
  };

  const getTitleForType = (type: string) => {
    switch (type) {
      case 'enrollment': return "Student enrollment";
      case 'attendance_marked': return "Attendance marked";
      case 'course_creation': return "Course created";
      case 'teacher_added': return "Teacher added";
      case 'grade_updated': return "Grades updated";
      default: return "Activity";
    }
  };

  const getStatusForType = (type: string) => {
    switch (type) {
      case 'enrollment': return "success";
      case 'attendance_marked': return "info";
      case 'course_creation': return "success";
      case 'teacher_added': return "success";
      case 'grade_updated': return "info";
      default: return "info";
    }
  };

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
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activities</p>
        ) : (
          activities.map((activity, index) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
}