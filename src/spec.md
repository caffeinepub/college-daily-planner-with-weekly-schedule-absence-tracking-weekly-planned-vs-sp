# Specification

## Summary
**Goal:** Fix authenticated semester creation so signed-in users can create and view semesters, and improve Manage page error reporting with clear backend failure reasons.

**Planned changes:**
- Update backend access control to ensure authenticated principals receive the required "user" permission before calling semester CRUD methods (createSemester/getSemesters), while keeping anonymous principals blocked.
- Improve the Manage page semester creation failure handling to show an English toast that includes the underlying backend/agent error message when available, and a clear "app not ready" message when the actor is unavailable.

**User-visible outcome:** Signed-in users can successfully create a semester and immediately see it in their semester list; if creation fails, they see a clear English error explaining why (e.g., Unauthorized), without changing the existing success flow.
