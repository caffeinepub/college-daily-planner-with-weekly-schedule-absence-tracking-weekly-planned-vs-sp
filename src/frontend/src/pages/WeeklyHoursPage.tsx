import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function WeeklyHoursPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weekly Hours</h1>
        <p className="text-muted-foreground mt-1">Track planned and spent hours per course</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Feature Coming Soon</AlertTitle>
        <AlertDescription>
          Weekly hours tracking with rollover functionality requires additional backend support. This feature will
          allow you to set planned hours per course, log time spent, and automatically roll over unused hours to the
          next week.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
          <CardDescription>What you'll be able to do with weekly hours tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Set planned study hours for each course per week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Log actual time spent studying with multiple entries per week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>View weekly summaries showing planned vs. actual hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Automatically roll over unused hours to the next week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Track rollover-in and rollover-out for better planning</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
