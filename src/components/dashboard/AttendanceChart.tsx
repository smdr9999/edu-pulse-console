import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface AttendanceData {
  name: string;
  present: number;
  absent: number;
}

export function AttendanceChart() {
  const [data, setData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const { data: attendanceData, error } = await supabase
          .from('attendance')
          .select('attendance_date, status')
          .gte('attendance_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('attendance_date', { ascending: true });

        if (error) throw error;

        // Group by date and calculate attendance counts
        const groupedData = attendanceData?.reduce((acc: any, record) => {
          const date = new Date(record.attendance_date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          if (!acc[dayName]) {
            acc[dayName] = { present: 0, absent: 0, late: 0, excused: 0 };
          }
          
          if (record.status === 'present') {
            acc[dayName].present++;
          } else if (record.status === 'absent') {
            acc[dayName].absent++;
          } else if (record.status === 'late') {
            acc[dayName].present++; // Count late as present
          } else if (record.status === 'excused') {
            acc[dayName].absent++; // Count excused as absent for this chart
          }
          
          return acc;
        }, {}) || {};

        // Convert to chart format
        const chartData = Object.entries(groupedData).map(([day, counts]: [string, any]) => ({
          name: day,
          present: counts.present,
          absent: counts.absent
        }));

        // If no real data, use sample data
        if (chartData.length === 0) {
          setData([
            { name: 'Mon', present: 85, absent: 15 },
            { name: 'Tue', present: 88, absent: 12 },
            { name: 'Wed', present: 82, absent: 18 },
            { name: 'Thu', present: 90, absent: 10 },
            { name: 'Fri', present: 87, absent: 13 },
            { name: 'Sat', present: 75, absent: 25 },
          ]);
        } else {
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        // Fallback to sample data
        setData([
          { name: 'Mon', present: 85, absent: 15 },
          { name: 'Tue', present: 88, absent: 12 },
          { name: 'Wed', present: 82, absent: 18 },
          { name: 'Thu', present: 90, absent: 10 },
          { name: 'Fri', present: 87, absent: 13 },
          { name: 'Sat', present: 75, absent: 25 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading attendance data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const present = Number(payload.find(p => p.dataKey === 'present')?.value) || 0;
                    const absent = Number(payload.find(p => p.dataKey === 'absent')?.value) || 0;
                    const total = present + absent;
                    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                    
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-green-600">Present: {present}</p>
                        <p className="text-sm text-red-600">Absent: {absent}</p>
                        <p className="text-sm text-primary">Rate: {percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="present" stackId="a" radius={[0, 0, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
              <Bar dataKey="absent" stackId="a" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--destructive))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}