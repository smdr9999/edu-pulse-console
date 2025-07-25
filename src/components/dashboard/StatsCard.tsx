import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description: string;
  gradient?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  description,
  gradient = false 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      gradient && "bg-gradient-primary text-white border-0"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium",
              gradient ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold",
              gradient ? "text-white" : "text-foreground"
            )}>
              {value}
            </p>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "text-sm font-medium px-2 py-1 rounded-full",
                changeType === "positive" && !gradient && "text-success bg-success/10",
                changeType === "negative" && !gradient && "text-destructive bg-destructive/10",
                changeType === "neutral" && !gradient && "text-muted-foreground bg-muted",
                gradient && "text-white/90 bg-white/20"
              )}>
                {change}
              </span>
              <span className={cn(
                "text-xs",
                gradient ? "text-white/70" : "text-muted-foreground"
              )}>
                {description}
              </span>
            </div>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            gradient ? "bg-white/20" : "bg-muted/50"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              gradient ? "text-white" : "text-primary"
            )} />
          </div>
        </div>
        
        {/* Decorative element */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-20 h-20 rounded-full opacity-10",
          gradient ? "bg-white" : "bg-primary"
        )} />
      </CardContent>
    </Card>
  );
}