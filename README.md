# HelioTask

An Interactive Task Management App.
Features:

- Drag and Drop Tasks to change status
- Create and view your tasks. Filter and Sort tasks with status, priority and Due Date.

## Backend

### Authentication Routes

- `POST /auth/google`: Handles Google Sign-In and user registration.
- `POST /auth/logout`: Logs out the current user.

### User Routes (Authentication Cookie Required)

- `GET /user`: Fetches user information based on the user ID.
- `POST /user/create-task`: Creates a new task for the user.
- `GET /user/tasks`: Fetches tasks based on their status.
- `POST /user/change-task-status`: Updates the status of a task.
- `POST /user/tasks`: Fetches tasks with filtering and sorting options.
- `PUT /user/update-task`: Updates an existing task.
- `DELETE /user/delete-task`: Deletes a task.
