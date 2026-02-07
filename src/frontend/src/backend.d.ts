import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Semester {
    id: bigint;
    name: string;
}
export interface ScheduleItem {
    id: bigint;
    startTime: string;
    endTime: string;
    dayOfWeek: string;
    courseId: bigint;
}
export interface AbsenceRecord {
    id: bigint;
    note?: string;
    courseId: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface Course {
    id: bigint;
    name: string;
    plannedHoursPerWeek: bigint;
    semesterId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAbsence(record: AbsenceRecord): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCourse(course: Course): Promise<bigint>;
    createScheduleItem(item: ScheduleItem): Promise<bigint>;
    createSemester(semester: Semester): Promise<bigint>;
    deleteAbsence(id: bigint): Promise<boolean>;
    deleteCourse(id: bigint): Promise<boolean>;
    deleteScheduleItem(id: bigint): Promise<boolean>;
    deleteSemester(id: bigint): Promise<boolean>;
    getAbsences(): Promise<Array<AbsenceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourses(): Promise<Array<Course>>;
    getCoursesSorted(): Promise<Array<Course>>;
    getScheduleItems(): Promise<Array<ScheduleItem>>;
    getSemesters(): Promise<Array<Semester>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAbsence(id: bigint, record: AbsenceRecord): Promise<boolean>;
    updateCourse(id: bigint, course: Course): Promise<boolean>;
    updateScheduleItem(id: bigint, item: ScheduleItem): Promise<boolean>;
    updateSemester(id: bigint, semester: Semester): Promise<boolean>;
}
