import { useState } from 'react';
import { useGetScheduleItems, useCreateScheduleItem } from '../hooks/useSchedule';
import { useGetCourses } from '../hooks/useCourses';
import { useWeekSelection } from '../state/selection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AsyncState } from '@/components/AsyncState';
import ScheduleItemDialog from '../components/schedule/ScheduleItemDialog';
import type { ScheduleItem } from '../backend';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklySchedulePage() {
  const { weekStart, weekEnd, goToPreviousWeek, goToNextWeek, formatWeekRange } = useWeekSelection();
  const { data: scheduleItems = [], isLoading, isError, error } = useGetScheduleItems();
  const { data: courses = [] } = useGetCourses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const groupedByDay = DAYS_OF_WEEK.reduce(
    (acc, day) => {
      acc[day] = scheduleItems.filter((item) => item.dayOfWeek === day);
      return acc;
    },
    {} as Record<string, ScheduleItem[]>
  );

  const getCourseNameById = (courseId: bigint) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Weekly Schedule</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Plan your week and stay organized</p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="w-full sm:w-auto touch-manipulation">
          <Plus className="mr-2 h-5 w-5" />
          Add Schedule Item
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousWeek}
            className="h-10 w-10 touch-manipulation flex-shrink-0"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 min-w-0">
            <p className="font-semibold text-base sm:text-lg truncate">{formatWeekRange()}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Week View</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextWeek}
            className="h-10 w-10 touch-manipulation flex-shrink-0"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={scheduleItems.length === 0}
        emptyMessage="No schedule items yet. Add your first class or activity!"
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {DAYS_OF_WEEK.map((day) => (
            <Card key={day} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-base sm:text-lg">{day}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{groupedByDay[day].length} items</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {groupedByDay[day].length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No items</p>
                ) : (
                  <div className="space-y-3">
                    {groupedByDay[day]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((item) => (
                        <div
                          key={Number(item.id)}
                          className="p-3 rounded-lg border bg-card hover:bg-accent/50 active:bg-accent/70 transition-colors cursor-pointer touch-manipulation"
                          onClick={() => handleEdit(item)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{getCourseNameById(item.courseId)}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.startTime} - {item.endTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncState>

      {/* Dialog */}
      <ScheduleItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingItem={editingItem}
        courses={courses}
      />
    </div>
  );
}
