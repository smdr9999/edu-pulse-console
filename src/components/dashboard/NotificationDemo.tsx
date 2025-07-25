import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function NotificationDemo() {
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "This browser does not support notifications",
        variant: "destructive"
      });
      return;
    }

    if (Notification.permission === "granted") {
      sendNotification();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        sendNotification();
      }
    } else {
      toast({
        title: "Permission denied",
        description: "Please enable notifications in your browser settings",
        variant: "destructive"
      });
    }
  };

  const sendNotification = () => {
    const notification = new Notification("EduPulse Admin", {
      body: "New student enrollment requires your attention!",
      icon: "/favicon.ico",
      tag: "edupulse-demo",
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      toast({
        title: "Notification clicked!",
        description: "This would normally navigate to the relevant section.",
      });
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    toast({
      title: "Notification sent!",
      description: "Check your system notifications.",
    });
  };

  const getPermissionStatus = () => {
    if (!("Notification" in window)) return "not-supported";
    return Notification.permission;
  };

  const getPermissionBadge = () => {
    const status = getPermissionStatus();
    switch (status) {
      case "granted":
        return <Badge className="bg-success text-success-foreground">Enabled</Badge>;
      case "denied":
        return <Badge variant="destructive">Denied</Badge>;
      case "default":
        return <Badge variant="secondary">Not Set</Badge>;
      default:
        return <Badge variant="outline">Not Supported</Badge>;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Push Notifications</span>
          </div>
          {getPermissionBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Test the PWA push notification functionality. This demo sends a notification 
            when you click the button below.
          </p>
          
          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-xs">
              Works best when app is installed as PWA
            </span>
          </div>
        </div>

        <Button 
          onClick={requestNotificationPermission}
          className="w-full bg-gradient-primary hover:opacity-90"
          disabled={getPermissionStatus() === "not-supported"}
        >
          <Send className="w-4 h-4 mr-2" />
          Send Demo Notification
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• First click will request permission</p>
          <p>• Subsequent clicks will send notifications</p>
          <p>• Notifications appear in system tray</p>
        </div>
      </CardContent>
    </Card>
  );
}