import { useState } from 'react';
import { useGetAbsences, useAddAbsence } from '../hooks/useAbsences';
import { useGetCourses } from '../hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, UserX, Loader2 } from 'lucide-react';
import { AsyncState } from '@/components/AsyncState';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AbsencesPage() {
  const { data: absences = [], isLoading, isError, error } = useGetAbsences();
  const { data: courses = [] } = useGetCourses();
  const addAbsence = useAddAbsence();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [note, setNote] = useState('');

  const getCourseNameById = (courseId: bigint) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  const absencesByCourse = courses.map((course) => ({
    course,
    count: absences.filter((a) => a.courseId === course.id).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }

    try {
      await addAbsence.mutateAsync({
        id: 0n,
        courseId: BigInt(selectedCourseId),
        note: note.trim() || undefined,
      });
      toast.success('Absence recorded');
      setDialogOpen(false);
      setSelectedCourseId('');
      setNote('');
    } catch (error) {
      toast.error('Failed to record absence');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Absences</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Track your course absences</p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)} 
          size="lg" 
          disabled={courses.length === 0}
          className="w-full sm:w-auto touch-manipulation"
        >
          <Plus className="mr-2 h-5 w-5" />
          Record Absence
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base px-4">
              No courses available. Add courses in the Manage section to start tracking absences.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {absencesByCourse.map(({ course, count }) => (
              <Card key={Number(course.id)}>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg truncate">{course.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Semester absences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {count === 1 ? 'absence' : 'absences'} recorded
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Absence List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">All Absences</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Complete list of recorded absences</CardDescription>
            </CardHeader>
            <CardContent>
              <AsyncState
                isLoading={isLoading}
                isError={isError}
                error={error}
                isEmpty={absences.length === 0}
                emptyMessage="No absences recorded yet"
              >
                <div className="mobile-scroll-container -mx-2 sm:mx-0">
                  <div className="min-w-[500px] px-2 sm:px-0 sm:min-w-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Course</TableHead>
                          <TableHead className="w-[60%]">Note</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {absences.map((absence) => (
                          <TableRow key={Number(absence.id)}>
                            <TableCell className="font-medium">{getCourseNameById(absence.courseId)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {absence.note || 'No note provided'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </AsyncState>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Absence Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Record Absence</DialogTitle>
            <DialogDescription>Add a new absence record for a course</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <form onSubmit={handleSubmit} id="absence-form">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
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
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add any details about this absence..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="touch-manipulation resize-none"
                  />
                </div>
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="flex-1 sm:flex-none touch-manipulation"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="absence-form"
              disabled={addAbsence.isPending}
              className="flex-1 sm:flex-none touch-manipulation"
            >
              {addAbsence.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Absence'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
