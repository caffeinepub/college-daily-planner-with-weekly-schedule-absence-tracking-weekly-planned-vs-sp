import { useState } from 'react';
import { useGetSemesters, useCreateSemester } from '../hooks/useSemesters';
import { useGetCourses, useCreateCourse } from '../hooks/useCourses';
import { useActor } from '../hooks/useActor';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Loader2, BookOpen, Calendar } from 'lucide-react';
import { AsyncState } from '@/components/AsyncState';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function ManagePage() {
  const { actor } = useActor();
  const { data: semesters = [], isLoading: semestersLoading, isError: semestersError } = useGetSemesters();
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useGetCourses();
  const createSemester = useCreateSemester();
  const createCourse = useCreateCourse();

  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [plannedHours, setPlannedHours] = useState('');

  const handleCreateSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim()) {
      toast.error('Please enter a semester name');
      return;
    }

    // Check if actor is available before attempting mutation
    if (!actor) {
      toast.error('The app is not ready yet. Please wait a moment and try again.');
      return;
    }

    try {
      await createSemester.mutateAsync({
        id: 0n,
        name: semesterName.trim(),
      });
      toast.success('Semester created successfully');
      setSemesterDialogOpen(false);
      setSemesterName('');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to create semester: ${errorMessage}`);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      toast.error('Please enter a course name');
      return;
    }
    if (!selectedSemesterId) {
      toast.error('Please select a semester');
      return;
    }
    const hours = parseInt(plannedHours) || 0;
    if (hours < 0) {
      toast.error('Planned hours must be a positive number');
      return;
    }

    // Check if actor is available before attempting mutation
    if (!actor) {
      toast.error('The app is not ready yet. Please wait a moment and try again.');
      return;
    }

    try {
      await createCourse.mutateAsync({
        id: 0n,
        name: courseName.trim(),
        semesterId: BigInt(selectedSemesterId),
        plannedHoursPerWeek: BigInt(hours),
      });
      toast.success('Course created successfully');
      setCourseDialogOpen(false);
      setCourseName('');
      setSelectedSemesterId('');
      setPlannedHours('');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to create course: ${errorMessage}`);
    }
  };

  const getSemesterNameById = (semesterId: bigint) => {
    const semester = semesters.find((s) => s.id === semesterId);
    return semester?.name || 'Unknown Semester';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Manage</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Organize your semesters and courses</p>
      </div>

      <Tabs defaultValue="semesters" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="semesters" className="touch-manipulation">Semesters</TabsTrigger>
          <TabsTrigger value="courses" className="touch-manipulation">Courses</TabsTrigger>
        </TabsList>

        {/* Semesters Tab */}
        <TabsContent value="semesters" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Semesters</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage your academic semesters</p>
            </div>
            <Button 
              onClick={() => setSemesterDialogOpen(true)}
              className="w-full sm:w-auto touch-manipulation"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Semester
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <AsyncState
                isLoading={semestersLoading}
                isError={semestersError}
                isEmpty={semesters.length === 0}
                emptyMessage="No semesters yet. Create your first semester to get started!"
                emptyIcon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              >
                <div className="mobile-scroll-container -mx-2 sm:mx-0">
                  <div className="min-w-[400px] px-2 sm:px-0 sm:min-w-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Semester Name</TableHead>
                          <TableHead className="text-right">Courses</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semesters.map((semester) => (
                          <TableRow key={Number(semester.id)}>
                            <TableCell className="font-medium">{semester.name}</TableCell>
                            <TableCell className="text-right">
                              {courses.filter((c) => c.semesterId === semester.id).length}
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
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Courses</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage your courses</p>
            </div>
            <Button 
              onClick={() => setCourseDialogOpen(true)} 
              disabled={semesters.length === 0}
              className="w-full sm:w-auto touch-manipulation"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>

          {semesters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base px-4">Create a semester first before adding courses.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <AsyncState
                  isLoading={coursesLoading}
                  isError={coursesError}
                  isEmpty={courses.length === 0}
                  emptyMessage="No courses yet. Add your first course to start planning!"
                  emptyIcon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
                >
                  <div className="mobile-scroll-container -mx-2 sm:mx-0">
                    <div className="min-w-[500px] px-2 sm:px-0 sm:min-w-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">Course Name</TableHead>
                            <TableHead className="w-[35%]">Semester</TableHead>
                            <TableHead className="text-right w-[25%]">Planned Hours/Week</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course) => (
                            <TableRow key={Number(course.id)}>
                              <TableCell className="font-medium">{course.name}</TableCell>
                              <TableCell className="text-sm">{getSemesterNameById(course.semesterId)}</TableCell>
                              <TableCell className="text-right">{Number(course.plannedHoursPerWeek)}h</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AsyncState>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Semester Dialog */}
      <Dialog open={semesterDialogOpen} onOpenChange={setSemesterDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <form onSubmit={handleCreateSemester}>
            <DialogHeader>
              <DialogTitle>Add Semester</DialogTitle>
              <DialogDescription>Create a new semester to organize your courses</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="semester-name">Semester Name *</Label>
                <Input
                  id="semester-name"
                  placeholder="e.g., Fall 2024"
                  value={semesterName}
                  onChange={(e) => setSemesterName(e.target.value)}
                  autoFocus
                  className="touch-manipulation"
                />
              </div>
            </div>
            <DialogFooter className="flex-row gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSemesterDialogOpen(false)}
                className="flex-1 sm:flex-none touch-manipulation"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSemester.isPending}
                className="flex-1 sm:flex-none touch-manipulation"
              >
                {createSemester.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Semester'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>Create a new course for a semester</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <form onSubmit={handleCreateCourse} id="course-form">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name">Course Name *</Label>
                  <Input
                    id="course-name"
                    placeholder="e.g., Computer Science 101"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    autoFocus
                    className="touch-manipulation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                    <SelectTrigger id="semester" className="touch-manipulation">
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={Number(semester.id)} value={String(semester.id)}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planned-hours">Planned Hours per Week</Label>
                  <Input
                    id="planned-hours"
                    type="number"
                    min="0"
                    placeholder="e.g., 3"
                    value={plannedHours}
                    onChange={(e) => setPlannedHours(e.target.value)}
                    className="touch-manipulation"
                  />
                </div>
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCourseDialogOpen(false)}
              className="flex-1 sm:flex-none touch-manipulation"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="course-form"
              disabled={createCourse.isPending}
              className="flex-1 sm:flex-none touch-manipulation"
            >
              {createCourse.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Course'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
