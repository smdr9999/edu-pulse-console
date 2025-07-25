import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', present: 85, absent: 15 },
  { name: 'Tue', present: 88, absent: 12 },
  { name: 'Wed', present: 82, absent: 18 },
  { name: 'Thu', present: 90, absent: 10 },
  { name: 'Fri', present: 87, absent: 13 },
  { name: 'Sat', present: 75, absent: 25 },
];

export function AttendanceChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="present" stackId="a" radius={[0, 0, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="hsl(210 100% 50%)" />
              ))}
            </Bar>
            <Bar dataKey="absent" stackId="a" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="hsl(0 84% 60%)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}