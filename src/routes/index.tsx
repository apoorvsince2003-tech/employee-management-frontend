import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { LoadingState } from '@/components/ui';
import {
  Users,
  Building2,
  UsersRound,
  FolderKanban,
  Wallet,
  TrendingUp,
  CalendarCheck,
  CalendarDays,
  PartyPopper,
  Megaphone,
  BarChart3,
  LifeBuoy,
} from 'lucide-react';

const TeamForm = lazy(() => import('@/pages/TeamForm'));
const EditTeam = lazy(() => import('@/pages/EditTeam'));
const ProjectForm = lazy(() => import('@/pages/ProjectForm'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Employees = lazy(() => import('@/pages/Employees'));
const EmployeeDetail = lazy(() => import('@/pages/EmployeeDetail'));
const EmployeeForm = lazy(() => import('@/pages/EmployeeForm'));
const Departments = lazy(() => import('@/pages/Departments'));
const DepartmentDetail = lazy(() => import('@/pages/DepartmentDetail'));
const Teams = lazy(() => import('@/pages/Teams'));
const TeamDetail = lazy(() => import('@/pages/TeamDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const SalaryManagement = lazy(() => import('@/pages/SalaryManagement'));
const Promotions = lazy(() => import('@/pages/Promotions'));
const EditAttendance = lazy(() => import("@/pages/EditAttendance"));
const LeaveManagement = lazy(() => import('@/pages/LeaveManagement'));
const Holidays = lazy(() => import('@/pages/Holidays'));
const EditHoliday = lazy(() => import('@/pages/EditHoliday'));
const HolidayForm = lazy(() => import("@/pages/HolidayForm"));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Security = lazy(() => import('@/pages/Security'));
const HelpSupport = lazy(() => import("@/pages/HelpSupport"));
const DepartmentForm = lazy(() => import('@/pages/DepartmentForm'));
const LeaveForm = lazy(() => import('@/pages/LeaveForm'));

function withSuspense(node: React.ReactNode, label = 'Loading…') {
  return <Suspense fallback={<LoadingState label={label} />}>{node}</Suspense>;
}

const Attendance = lazy(() => import("@/pages/Attendance"));
const AttendanceForm = lazy(() => import('@/pages/AttendanceForm'));

const NoticeBoard = lazy(() => import('@/pages/NoticeBoard'));
const NoticeForm = lazy(() => import('@/pages/NoticeForm'));
const EditNotice = lazy(() => import('@/pages/EditNotice'));
const Reports = lazy(() => import("@/pages/Reports"));

  

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(<Dashboard />, 'Loading dashboard…') },

      { path: 'employees', element: withSuspense(<Employees />, 'Loading employees…') },
      { path: 'employees/new', element: withSuspense(<EmployeeForm />, 'Loading employee form…') },
      { path: 'employees/:id', element: withSuspense(<EmployeeDetail />, 'Loading profile…') },

      { path: 'teams/new', element: withSuspense(<TeamForm />, 'Loading...') },
      { path: 'teams/edit/:id', element: withSuspense(<EditTeam />, 'Loading team...') },
      { path: 'projects/new', element: withSuspense(<ProjectForm />, 'Loading...') },

      { path: 'departments', element: withSuspense(<Departments />, 'Loading departments…') },
      { path: 'departments/new', element: withSuspense(<DepartmentForm />, 'Loading department form...') },
      { path: 'departments/:id/edit', element: withSuspense(<DepartmentForm />, 'Loading department form...') },
      { path: 'departments/:id', element: withSuspense(<DepartmentDetail />, 'Loading department…') },

      { path: 'teams', element: withSuspense(<Teams />, 'Loading teams…') },
      { path: 'teams/:id', element: withSuspense(<TeamDetail />, 'Loading team…') },

      { path: 'projects', element: withSuspense(<Projects />, 'Loading projects…') },
      { path: 'projects/:id', element: withSuspense(<ProjectDetail />, 'Loading project…') },

      { path: 'salary', element: withSuspense(<SalaryManagement />, 'Loading salary…') },
      { path: 'promotions', element: withSuspense(<Promotions />, 'Loading promotions…') },

      { path: 'attendance', element: withSuspense(<Attendance />, 'Loading...') },
      { path: 'attendance/new', element: withSuspense(<AttendanceForm />, 'Loading attendance form...') },
      { path: "attendance/:id/edit", element: withSuspense(<EditAttendance />, "Loading Attendance..." ),},

      { path: 'leaves', element: withSuspense(<LeaveManagement />, 'Loading leaves...') },
      { path: 'leaves/new', element: withSuspense(<LeaveForm />, 'Loading leave form...') },
     
      { path: 'holidays', element: withSuspense(<Holidays />, 'Loading holidays...') },
      { path: 'holidays/new', element: withSuspense( <HolidayForm />, 'Loading Holiday Form...' ),},
      { path: 'holidays/edit/:id', element: withSuspense( <EditHoliday />, 'Loading Holiday...' ) },

      { path: 'notices', element: withSuspense(<NoticeBoard />, 'Loading notices...') },
      { path: 'notices/new', element: withSuspense(<NoticeForm />, 'Loading notice form...') },
      { path: 'notices/edit/:id', element: withSuspense(<EditNotice />, 'Loading notice...') },

      { path: "reports", element: withSuspense(<Reports />, "Loading reports..."),},
      { path: 'settings', element: withSuspense(<Settings />, 'Loading settings…') },
      { path: 'profile', element: withSuspense(<Profile />, 'Loading profile…') },
      { path: 'security', element: withSuspense(<Security />, 'Loading security…') },
      { path: "help", element: withSuspense(<HelpSupport />, "Loading Help...") },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
];
