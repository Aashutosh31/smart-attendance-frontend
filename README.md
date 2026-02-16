# Smart Attendance Frontend

Role-based attendance management UI for colleges. This frontend is built on React and Vite, uses Supabase for auth, and talks to a backend API for attendance workflows, reporting, and analytics.

## Architecture Overview

High-level flow:

```
Browser
	-> React Router (routes)
		-> ProtectedRoute (auth + role + face enrollment gate)
			-> Role-specific dashboard layout
				-> Feature pages (attendance, reports, analytics, settings)
	-> Supabase Auth (session + profile)
	-> Backend API (attendance + reports + analytics)
```

Key design principles:

- Route-driven architecture with role-specific areas and nested dashboards.
- Centralized auth/session state via Zustand.
- Backend API access behind `VITE_API_HOST` with bearer tokens when required.
- UI built with Tailwind CSS, custom utility styles, and component-specific layouts.

## Project Structure

Top-level layout (frontend-only):

```
src/
	App.jsx                # Routes and role-based layout entry point
	main.jsx               # App bootstrap
	supabaseClient.js      # Supabase client init
	index.css              # Tailwind + global utilities
	components/
		Admin/               # Admin dashboard + pages
		Auth/                # Login, registration, auth gates
		Coordinator/         # Coordinator dashboard + pages
		Faculty/             # Faculty dashboard + pages
		HOD/                 # HOD dashboard + pages
		Shared/              # Shared UI and settings
		Student/             # Student dashboard + pages
	store/
		AuthStore.jsx        # Session, profile, face enrollment state
		ThemeStore.jsx       # Light/dark preference (persisted)
```

Important entry points:

- App routing: [src/App.jsx](src/App.jsx)
- App bootstrap: [src/main.jsx](src/main.jsx)
- Auth state store: [src/store/AuthStore.jsx](src/store/AuthStore.jsx)
- Supabase client: [src/supabaseClient.js](src/supabaseClient.js)
- Global styles: [src/index.css](src/index.css)

## Routing Architecture

Routing is handled by React Router with nested layouts per role. The entry route `/` redirects to the correct dashboard based on the user role.

Public routes:

- `/login`
- `/register-college`
- `/unauthorized`
- `/enroll-face` (protected, used for forced face enrollment)

Role dashboards and nested routes (examples):

- Admin: `/admin` with `/admin/view-students`, `/admin/manage-hods`, `/admin/reports`, `/admin/analytics`, `/admin/settings`
- HOD: `/hod` with `/hod/overview`, `/hod/faculty`, `/hod/coordinators`, `/hod/courses`, `/hod/student-reports`, `/hod/reports`, `/hod/faculty-attendance`, `/hod/settings`
- Faculty: `/faculty` with `/faculty/overview`, `/faculty/courses`, `/faculty/analytics`, `/faculty/settings`
- Coordinator: `/coordinator` with `/coordinator/add-student`, `/coordinator/manage-courses`, `/coordinator/view-attendance`, `/coordinator/coordinator-analytics`, `/coordinator/settings`
- Student: `/student`

Routing gates:

- `ProtectedRoute` ensures a valid session and enforces role access.
- Face enrollment gate redirects to `/enroll-face` until completed.
- `RoleBasedRedirect` sends `/` to the role-specific dashboard.

See implementation details in:

- [src/components/Auth/ProtectedRoute.jsx](src/components/Auth/ProtectedRoute.jsx)
- [src/components/Auth/RoleBasedRedirect.jsx](src/components/Auth/RoleBasedRedirect.jsx)

## Auth and Session Flow

Auth is managed through Supabase and stored in a Zustand store.

Key behaviors:

- On app load, the store initializes the session and fetches the profile.
- Profile data is pulled from the `profiles` table by user id.
- Face enrollment status is fetched from the backend via `/api/auth/status`.
- `ProtectedRoute` blocks access until auth is resolved.

Entry points:

- Store logic: [src/store/AuthStore.jsx](src/store/AuthStore.jsx)
- Login page: [src/components/Auth/LoginPage.jsx](src/components/Auth/LoginPage.jsx)
- College registration: [src/components/Auth/CollegeRegistrationPage.jsx](src/components/Auth/CollegeRegistrationPage.jsx)

## Face Enrollment and Verification

Face enrollment is a dedicated flow used as a gate before accessing dashboards.

- Enrollment page: [src/components/Auth/FaceEnrollmentPage.jsx](src/components/Auth/FaceEnrollmentPage.jsx)
- API call: `POST /api/auth/enroll-face` with a captured image and a bearer token.
- Enrollment status stored in the auth store and enforced by `ProtectedRoute`.

Face verification modal exists as a shared UI component and currently simulates processing:

- [src/components/Shared/FaceRecognitionModal.jsx](src/components/Shared/FaceRecognitionModal.jsx)

## State Management

Zustand is used for lightweight global state.

- `AuthStore` manages session, user profile, loading state, and face enrollment status.
- `ThemeStore` persists light/dark preference to local storage.

Files:

- [src/store/AuthStore.jsx](src/store/AuthStore.jsx)
- [src/store/ThemeStore.jsx](src/store/ThemeStore.jsx)

## Data Access and API Integration

There are two sources of data:

1) Supabase (auth + profile data)
2) Backend API (attendance, reports, analytics, face workflows)

Supabase client:

- [src/supabaseClient.js](src/supabaseClient.js)

Environment-driven API base:

- `VITE_API_HOST` is used across pages with `fetch` requests.

Typical API pattern:

- `fetch(`${VITE_API_HOST}/api/...`, { headers: { Authorization: `Bearer <token>` } })`

## UI Layer and Styling

The app uses Tailwind CSS plus custom utility classes in the global stylesheet:

- Tailwind base, components, utilities
- Custom animation utilities and responsive helpers

Global styles:

- [src/index.css](src/index.css)

UI patterns:

- Toast notifications via React Toastify
- Iconography via Lucide
- Motion/animation via Framer Motion (in select pages)

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_HOST=https://your-backend.example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- `VITE_API_HOST` should point to the backend API used for attendance, reports, and face enrollment.
- Supabase OAuth settings (Google) are configured in the Supabase dashboard.

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Local Development

1) Install dependencies

```bash
npm install
```

2) Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Deployment

This app is Vite-based and can be deployed to any static host. If you use Vercel, configure the same environment variables in the project settings.

## Troubleshooting

- Auth loops to `/login`: verify Supabase keys and `profiles` table availability.
- Stuck on `/enroll-face`: confirm the backend `/api/auth/status` and `/api/auth/enroll-face` endpoints are reachable and returning success.
- API errors: verify `VITE_API_HOST` and CORS settings on the backend.

## Notes on Supabase Folder

The `supabase/` directory contains local configuration and edge function scaffolding for the broader project. It is not part of the frontend runtime bundle.
