import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Access control state - properly initialized
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  // Data Models
  public type Semester = {
    id : Nat;
    name : Text;
  };

  public type Course = {
    id : Nat;
    semesterId : Nat;
    name : Text;
    plannedHoursPerWeek : Nat;
  };

  public type ScheduleItem = {
    id : Nat;
    courseId : Nat;
    dayOfWeek : Text;
    startTime : Text;
    endTime : Text;
  };

  public type AbsenceRecord = {
    id : Nat;
    courseId : Nat;
    note : ?Text;
  };

  // ID Counter Variables
  var semesterIdCounter = 1;
  var courseIdCounter = 1;
  var scheduleIdCounter = 1;
  var absenceIdCounter = 1;

  // User-scoped data stores
  let userProfiles = Map.empty<Principal, UserProfile>();
  let semesters = Map.empty<Principal, Map.Map<Nat, Semester>>();
  let courses = Map.empty<Principal, Map.Map<Nat, Course>>();
  let scheduleItems = Map.empty<Principal, Map.Map<Nat, ScheduleItem>>();
  let absences = Map.empty<Principal, Map.Map<Nat, AbsenceRecord>>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper Functions
  func getUserData<T>(
    userMap : Map.Map<Principal, Map.Map<Nat, T>>,
    caller : Principal,
  ) : Map.Map<Nat, T> {
    switch (userMap.get(caller)) {
      case (null) { Map.empty<Nat, T>() };
      case (?data) { data };
    };
  };

  func updateUserData<T>(
    userMap : Map.Map<Principal, Map.Map<Nat, T>>,
    data : Map.Map<Nat, T>,
    caller : Principal,
  ) {
    userMap.add(caller, data);
  };

  // CRUD Operations - Semesters
  public shared ({ caller }) func createSemester(semester : Semester) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create semesters");
    };
    let id = semesterIdCounter;
    semesterIdCounter += 1;
    let newSemester = { semester with id };
    let userSemesters = getUserData(semesters, caller);
    userSemesters.add(id, newSemester);
    updateUserData(semesters, userSemesters, caller);
    id;
  };

  public query ({ caller }) func getSemesters() : async [Semester] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view semesters");
    };
    let userSemesters = getUserData(semesters, caller);
    userSemesters.values().toArray();
  };

  public shared ({ caller }) func updateSemester(id : Nat, semester : Semester) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update semesters");
    };
    let userSemesters = getUserData(semesters, caller);
    switch (userSemesters.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedSemester = { semester with id };
        userSemesters.add(id, updatedSemester);
        updateUserData(semesters, userSemesters, caller);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSemester(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete semesters");
    };
    let userSemesters = getUserData(semesters, caller);
    switch (userSemesters.get(id)) {
      case (null) { false };
      case (?_) {
        userSemesters.remove(id);
        updateUserData(semesters, userSemesters, caller);
        true;
      };
    };
  };

  // CRUD Operations - Courses
  public shared ({ caller }) func createCourse(course : Course) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create courses");
    };
    let id = courseIdCounter;
    courseIdCounter += 1;
    let newCourse = { course with id };
    let userCourses = getUserData(courses, caller);
    userCourses.add(id, newCourse);
    updateUserData(courses, userCourses, caller);
    id;
  };

  public query ({ caller }) func getCourses() : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    let userCourses = getUserData(courses, caller);
    userCourses.values().toArray();
  };

  public shared ({ caller }) func updateCourse(id : Nat, course : Course) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update courses");
    };
    let userCourses = getUserData(courses, caller);
    switch (userCourses.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedCourse = { course with id };
        userCourses.add(id, updatedCourse);
        updateUserData(courses, userCourses, caller);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteCourse(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete courses");
    };
    let userCourses = getUserData(courses, caller);
    switch (userCourses.get(id)) {
      case (null) { false };
      case (?_) {
        userCourses.remove(id);
        updateUserData(courses, userCourses, caller);
        true;
      };
    };
  };

  // CRUD Operations - Schedule Items
  public shared ({ caller }) func createScheduleItem(item : ScheduleItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create schedule items");
    };
    let id = scheduleIdCounter;
    scheduleIdCounter += 1;
    let newItem = { item with id };
    let userItems = getUserData(scheduleItems, caller);
    userItems.add(id, newItem);
    updateUserData(scheduleItems, userItems, caller);
    id;
  };

  public query ({ caller }) func getScheduleItems() : async [ScheduleItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view schedule items");
    };
    let userItems = getUserData(scheduleItems, caller);
    userItems.values().toArray();
  };

  public shared ({ caller }) func updateScheduleItem(id : Nat, item : ScheduleItem) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update schedule items");
    };
    let userItems = getUserData(scheduleItems, caller);
    switch (userItems.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedItem = { item with id };
        userItems.add(id, updatedItem);
        updateUserData(scheduleItems, userItems, caller);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteScheduleItem(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete schedule items");
    };
    let userItems = getUserData(scheduleItems, caller);
    switch (userItems.get(id)) {
      case (null) { false };
      case (?_) {
        userItems.remove(id);
        updateUserData(scheduleItems, userItems, caller);
        true;
      };
    };
  };

  // CRUD Operations - Absences
  public shared ({ caller }) func addAbsence(record : AbsenceRecord) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add absences");
    };
    let id = absenceIdCounter;
    absenceIdCounter += 1;
    let newRecord = { record with id };
    let userAbsences = getUserData(absences, caller);
    userAbsences.add(id, newRecord);
    updateUserData(absences, userAbsences, caller);
    id;
  };

  public query ({ caller }) func getAbsences() : async [AbsenceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view absences");
    };
    let userAbsences = getUserData(absences, caller);
    userAbsences.values().toArray();
  };

  public shared ({ caller }) func updateAbsence(id : Nat, record : AbsenceRecord) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update absences");
    };
    let userAbsences = getUserData(absences, caller);
    switch (userAbsences.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedRecord = { record with id };
        userAbsences.add(id, updatedRecord);
        updateUserData(absences, userAbsences, caller);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteAbsence(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete absences");
    };
    let userAbsences = getUserData(absences, caller);
    switch (userAbsences.get(id)) {
      case (null) { false };
      case (?_) {
        userAbsences.remove(id);
        updateUserData(absences, userAbsences, caller);
        true;
      };
    };
  };

  // Sorting
  public query ({ caller }) func getCoursesSorted() : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };

    let userCourses = getUserData(courses, caller);
    let courseArray = userCourses.values().toArray();

    func compareByName(a : Course, b : Course) : Order.Order {
      Text.compare(a.name, b.name);
    };

    courseArray.sort(compareByName);
  };
};
