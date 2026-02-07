import { useGetCourses } from '../hooks/useCourses';
import { useGetAbsences } from '../hooks/useAbsences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3, Info } from 'lucide-react';
import { AsyncState } from '@/components/AsyncState';

export default function ReportsPage() {
  const { data: courses = [], isLoading: coursesLoading } = useGetCourses();
  const { data: absences = [], isLoading: absencesLoading } = useGetAbsences();

  const isLoading = coursesLoading || absencesLoading;

  const absencesByCourse = courses.map((course) => ({
    course,
    count: absences.filter((a) => a.courseId === course.id).length,
  }));

  const totalAbsences = absences.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Semester Reports</h1>
        <p className="text-muted-foreground mt-1">View detailed analytics and summaries</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Limited Reporting Available</AlertTitle>
        <AlertDescription>
          Full semester reports with weekly hour breakdowns and rollover tracking require additional backend support.
          Currently showing available absence data.
        </AlertDescription>
      </Alert>

      <AsyncState isLoading={isLoading} isEmpty={courses.length === 0} emptyMessage="No data to report yet">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalAbsences}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg. Absences/Course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {courses.length > 0 ? (totalAbsences / courses.length).toFixed(1) : '0'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Most Absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.max(...absencesByCourse.map((a) => a.count), 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Per-Course Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Absences by Course</CardTitle>
            <CardDescription>Breakdown of absences for each course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {absencesByCourse.map(({ course, count }) => (
                <div key={Number(course.id)} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{course.name}</p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${totalAbsences > 0 ? (count / totalAbsences) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">absences</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State for Future Features */}
        {courses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <img
                src="/assets/generated/empty-state-study.dim_1200x800.png"
                alt="No data"
                className="w-64 h-auto mx-auto mb-6 opacity-75"
              />
              <h3 className="text-lg font-semibold mb-2">No Report Data Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by adding semesters and courses in the Manage section, then track your schedule, hours, and
                absences to see detailed reports here.
              </p>
            </CardContent>
          </Card>
        )}
      </AsyncState>
    </div>
  );
}
