# EmployWise User Management

This is a React + Vite-based application for managing users, integrating with the Reqres API. The app features login authentication, user listing, editing, and deletion functionalities.

## Features

### Level 1: Authentication
- Login screen using email (`eve.holt@reqres.in`) and password (`cityslicka`).
- Stores the authentication token in localStorage.
- Redirects users to the user list page upon successful login.

### Level 2: List Users
- Fetches paginated user data from the API.
- Displays users in card format with their name, email, and avatar.
- Pagination buttons for navigating between pages.

### Level 3: Edit, Delete, and Update Users
- **Edit**: 
  - Opens a form pre-filled with the user's data.
  - Updates user details via API.
- **Delete**: 
  - Removes a user from the list via API.
- Shows success or error messages based on the operation outcome.

### Bonus Features
- **Client-Side Search and Filtering**: Easily find users by name or email.
- **React Router**: Enables seamless navigation between login, user list, and edit user pages.
- **Responsive Design**: Works well on both desktop and mobile devices.

---

## Tech Stack

- **React**: Frontend framework.
- **Vite**: Fast build tool for React.
- **Shadcn**: UI components for styling.
- **Tailwind CSS**: Utility-first CSS framework.
- **Fetch API**: For making HTTP requests.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/employwise-user-management.git
   cd employwise-user-management
