# Milestone and Project View Components Documentation

This document provides an overview of the milestone and project view components recently added to the Raise3 Frontend project.

## Table of Contents

1. [Components Overview](#components-overview)
2. [CreateMilestone Component](#createmilestone-component)
3. [ProjectView Component](#projectview-component)
4. [Project Page](#project-page)
5. [Data Structures](#data-structures)
6. [Integration Guide](#integration-guide)

---

## Components Overview

We've added the following components to enhance project management functionality:

- **CreateMilestone**: A modal component for creating new project milestones
- **ProjectView**: An enhanced component to display project details, now with a milestone accordion
- **Project Page**: A new page that displays project details and milestone information

These components work together to provide a complete workflow for creating, viewing, and managing project milestones.

---

## CreateMilestone Component

**File path**: `/src/components/milestone/CreateMilestone.tsx`

### Description

The CreateMilestone component is a modal form that allows users to create multiple milestones for a project. Each milestone includes a title, description, target date, status, deliverables, and optional budget information.

### Key Features

- Multi-milestone support with add/remove functionality
- Multiple deliverables per milestone with add/remove functionality
- Form validation
- Status selection (pending, in-progress, completed)
- Budget tracking with currency selection
- Success/error messaging

### Usage Example

```tsx
import { useState } from 'react';
import CreateMilestone from '@/components/milestone/CreateMilestone';

// In your component:
const [showMilestoneForm, setShowMilestoneForm] = useState(false);

// In your JSX:
{showMilestoneForm && (
  <CreateMilestone
    onClose={() => setShowMilestoneForm(false)}
    onSubmit={(data) => {
      // Handle the milestone data
      console.log(data);
      // API call, state update, etc.
    }}
    projectId="your-project-id" // Optional
  />
)}

// Button to open the modal
<button onClick={() => setShowMilestoneForm(true)}>
  Add Milestone
</button>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Function to call when the modal is closed |
| `onSubmit` | `(data: MilestoneFormData) => void` | Function to handle form submission |
| `projectId` | `string` (optional) | ID of the project to add milestones to |

---

## ProjectView Component

**File path**: `/src/components/project/ProjectView.tsx`

### Description

The ProjectView component displays comprehensive project information in a structured and visually appealing layout. It's been enhanced with a milestone accordion section that displays all project milestones in an expandable/collapsible interface.

### Key Features

- Complete project information display (general info, social media, project stage, contact info, team)
- Interactive milestone accordion
- Visual status indicators for milestones
- Expandable milestone details with deliverables
- Font Awesome icons throughout
- Responsive design

### Usage Example

```tsx
import ProjectView from '@/components/project/ProjectView';

// In your JSX:
<ProjectView project={projectData} />
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `project` | `ProjectViewProps['project']` | Project data object |

---

## Project Page

**File path**: `/src/app/project/page.tsx`

### Description

This is a Next.js page component that displays a complete project view with milestones and provides functionality to add new milestones. It handles loading, error, and empty states.

### Key Features

- Integration of ProjectView and CreateMilestone components
- Project data fetching (currently using mock data)
- Loading, error, and not found states
- "Add Milestone" functionality
- Navigation back to dashboard

### URL Structure

The page is accessible at `/project?id={projectId}` where `projectId` is the unique identifier for the project.

---

## Data Structures

### Milestone

```typescript
interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  budget?: string;
  budgetCurrency?: string;
}
```

### Project

The project object extends the existing project structure with a new milestones array:

```typescript
interface Project {
  // Existing project fields...
  
  // New field for milestones
  milestones?: Milestone[];
}
```

---

## Integration Guide

### Adding to Existing Projects

To integrate these components into existing projects:

1. **Add milestone creation**:
   ```tsx
   // Import the component
   import CreateMilestone from '@/components/milestone/CreateMilestone';
   
   // Add state to control visibility
   const [showMilestoneForm, setShowMilestoneForm] = useState(false);
   
   // Add the component to your JSX
   {showMilestoneForm && (
     <CreateMilestone
       onClose={() => setShowMilestoneForm(false)}
       onSubmit={handleMilestoneSubmit}
       projectId={projectId}
     />
   )}
   
   // Add a button to open the modal
   <button onClick={() => setShowMilestoneForm(true)}>
     Add Milestone
   </button>
   ```

2. **View project with milestones**:
   ```tsx
   import ProjectView from '@/components/project/ProjectView';
   
   // In your JSX:
   <ProjectView project={projectData} />
   ```

3. **Navigate to project page**:
   ```tsx
   import Link from 'next/link';
   
   // In your JSX:
   <Link href={`/project?id=${project.id}`}>
     View Project
   </Link>
   ```

### API Integration

The current implementation uses mock data. To integrate with your API:

1. Update the `useEffect` in the project page to fetch real data:
   ```tsx
   useEffect(() => {
     const fetchProject = async () => {
       try {
         setLoading(true);
         const response = await fetch(`/api/projects/${projectId}`);
         if (!response.ok) throw new Error('Failed to fetch project');
         const data = await response.json();
         setProject(data);
         setError(null);
       } catch (err) {
         console.error('Error fetching project:', err);
         setError('Failed to load project data. Please try again later.');
       } finally {
         setLoading(false);
       }
     };
     
     if (projectId) {
       fetchProject();
     } else {
       setLoading(false);
       setError('Project ID is required');
     }
   }, [projectId]);
   ```

2. Update the milestone submission handler to send data to your API:
   ```tsx
   const handleMilestoneSubmit = async (data) => {
     try {
       const response = await fetch(`/api/projects/${projectId}/milestones`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       });
       
       if (!response.ok) throw new Error('Failed to create milestone');
       
       // Refresh project data
       fetchProject();
       setShowMilestoneForm(false);
     } catch (error) {
       console.error('Error creating milestone:', error);
       // Handle error
     }
   };
   ```

---

## Styling Notes

All components use the app's existing color scheme and styling patterns, including:

- Gradient backgrounds (from-gray-900 to-black)
- Red accent colors (#FF7171, #FF5C87)
- Consistent border colors (border-gray-800)
- Font Awesome icons with consistent sizing

No additional CSS files were added - all styling is done with Tailwind classes for consistency.

---

## Future Enhancements

Potential improvements for future iterations:

1. Milestone editing functionality
2. Milestone deletion
3. Milestone completion tracking
4. Timeline view of milestones
5. Filtering and sorting options for milestones

---

## Dependencies

These components use:

- Font Awesome for icons:
  - @fortawesome/react-fontawesome
  - @fortawesome/fontawesome-svg-core
  - @fortawesome/free-solid-svg-icons
  - @fortawesome/free-brands-svg-icons
- Next.js for the project page
- React state management (useState, useEffect)
- Tailwind CSS for styling
