import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { NotificationDemo } from "@/components/dashboard/NotificationDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Download,
  Smartphone
} from "lucide-react";

const Index = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeTeachers: 0,
    totalCourses: 0,
    attendanceRate: "0%"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsResult, teachersResult, coursesResult, attendanceResult] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact' }),
          supabase.from('teachers').select('*', { count: 'exact' }),
          supabase.from('courses').select('*', { count: 'exact' }),
          supabase.from('attendance').select('*')
        ]);

        const totalStudents = studentsResult.count || 0;
        const activeTeachers = teachersResult.count || 0;
        const totalCourses = coursesResult.count || 0;
        
        // Calculate attendance rate
        const attendanceData = attendanceResult.data || [];
        const presentCount = attendanceData.filter(a => a.status === 'present').length;
        const attendanceRate = attendanceData.length > 0 
          ? `${((presentCount / attendanceData.length) * 100).toFixed(1)}%`
          : "0%";

        setStats({
          totalStudents,
          activeTeachers,
          totalCourses,
          attendanceRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Check if app is already installed
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallPromotion();
    });

    const showInstallPromotion = () => {
      toast({
        title: "Install EduPulse",
        description: "Add this app to your home screen for a better experience!",
        action: (
          <Button 
            size="sm" 
            onClick={() => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult: any) => {
                  if (choiceResult.outcome === 'accepted') {
                    toast({ title: "App installed successfully!" });
                  }
                  deferredPrompt = null;
                });
              }
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
        ),
      });
    };
  }, []);

  const statsCards = [
    {
      title: "Total Students",
      value: loading ? "..." : stats.totalStudents.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "active students",
      gradient: true
    },
    {
      title: "Active Teachers",
      value: loading ? "..." : stats.activeTeachers.toString(),
      change: "+3",
      changeType: "positive" as const,
      icon: GraduationCap,
      description: "teaching staff"
    },
    {
      title: "Courses",
      value: loading ? "..." : stats.totalCourses.toString(),
      change: "0",
      changeType: "neutral" as const,
      icon: BookOpen,
      description: "all active"
    },
    {
      title: "Attendance Rate",
      value: loading ? "..." : stats.attendanceRate,
      change: "+2.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "this week"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div 
              key={stat.title}
              className="animate-bounce-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <AttendanceChart />
          <RecentActivity />
        </div>

        {/* Additional Features */}
        <div className="grid gap-4 md:grid-cols-2">
          <NotificationDemo />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>PWA Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This app is built as a Progressive Web App (PWA) with:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Offline functionality</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Installable on mobile & desktop</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Push notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>App-like experience</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Add Student
              </Button>
              <Button variant="outline" className="justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Create Course
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;