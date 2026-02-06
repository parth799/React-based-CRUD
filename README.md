# User Management CRUD Application

A modern, extensible user management application built with Next.js, Material-UI, Formik, and TypeScript.

## Live Demo

[View Live Application](https://your-vercel-url.vercel.app)

## Features

- Create, Read, Update, Delete (CRUD) operations for users
- Configuration-driven form architecture for easy extensibility
- Form validation using Formik and Yup
- Modern UI with Material-UI components
- LocalStorage persistence (no backend required)
- TypeScript for type safety
- Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI)
- **Form Handling**: Formik + Yup
- **Language**: TypeScript
- **Storage**: LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/user-crud-app.git
cd user-crud-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Adding New Fields

The application uses a configuration-driven approach for form fields. To add a new field (e.g., "Date of Birth"):

### Step 1: Update Form Configuration

Edit `src/config/formConfig.ts`:

```typescript
export const formFields: FormField[] = [
  // ... existing fields
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    required: false,
    validation: 'date',
    placeholder: 'Select date of birth'
  }
];
```

### Step 2: Update User Type

Edit `src/types/user.ts`:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth?: string;  // Add new field
  createdAt: string;
  updatedAt: string;
  [key: string]: string | undefined;
}
```

That's it! The form, table, and API will automatically handle the new field.

## Project Structure

```
src/
├── app/
│   ├── api/users/          # API routes for CRUD
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── providers.tsx       # Theme provider
├── components/
│   ├── UserForm.tsx        # Dynamic form component
│   ├── UserTable.tsx       # Users list table
│   ├── UserDialog.tsx      # Create/Edit modal
│   └── DeleteConfirmDialog.tsx
├── config/
│   └── formConfig.ts       # Field configuration
├── hooks/
│   └── useUsers.ts         # CRUD operations hook
├── theme/
│   └── theme.ts            # MUI theme
├── types/
│   └── user.ts             # TypeScript interfaces
└── utils/
    └── storage.ts          # LocalStorage utilities
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| POST | /api/users | Create new user |
| GET | /api/users/[id] | Get user by ID |
| PUT | /api/users/[id] | Update user |
| DELETE | /api/users/[id] | Delete user |

## Design Decisions

1. **Configuration-Driven Forms**: Form fields are defined in a central configuration file, enabling easy addition of new fields without modifying multiple components.

2. **LocalStorage for Persistence**: Chosen for easy deployment on Vercel without requiring a separate database service.

3. **Dynamic Validation Schema**: Yup validation schemas are generated from the form configuration, ensuring consistency between field definitions and validation rules.

4. **Custom Hook Pattern**: CRUD operations are encapsulated in a custom hook (`useUsers`) with built-in loading and error states.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy

The application will be automatically deployed and available at your Vercel URL.

## License

MIT
