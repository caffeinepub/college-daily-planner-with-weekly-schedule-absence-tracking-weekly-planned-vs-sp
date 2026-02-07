import { useState, useEffect } from 'react';
import { useCreateScheduleItem } from '../../hooks/useSchedule';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ScheduleItem, Course } from '../../backend';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ScheduleItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ScheduleItem | null;
  courses: Course[];
}

export default function ScheduleItemDialog({ open, onOpenChange, editingItem, courses }: ScheduleItemDialogProps) {
  const createScheduleItem = useCreateScheduleItem();
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setDayOfWeek(editingItem.dayOfWeek);
      setStartTime(editingItem.startTime);
      setEndTime(editingItem.endTime);
      setCourseId(String(editingItem.courseId));
    } else {
      setDayOfWeek('Monday');
      setStartTime('09:00');
      setEndTime('10:00');
      setCourseId('');
    }
  }, [editingItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast.error('Please select a course');
      return;
    }
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await createScheduleItem.mutateAsync({
        id: 0n,
        dayOfWeek,
        startTime,
        endTime,
        courseId: BigInt(courseId),
      });
      toast.success(editingItem ? 'Schedule item updated' : 'Schedule item created');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save schedule item');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update the schedule item details' : 'Add a new item to your weekly schedule'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit} id="schedule-form">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger id="course" className="touch-manipulation">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={Number(course.id)} value={String(course.id)}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week *</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger id="day" className="touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="touch-manipulation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    className="touch-manipulation"
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="flex-row gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none touch-manipulation"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="schedule-form"
            disabled={createScheduleItem.isPending}
            className="flex-1 sm:flex-none touch-manipulation"
          >
            {createScheduleItem.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              editingItem ? 'Update' : 'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
