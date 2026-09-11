import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Shield,
  Briefcase,
  User,
  ArrowLeft,
  Clock,
  Award,
  Users,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import {
  employeeService,
  departmentService,
  teamService,
  projectService,
  leaveService,
  attendanceService,
  salaryService,
  promotionService,
} from '@/services';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<any>(null);
  const [department, setDepartment] = useState<any>(null);
  const [employeeTeams, setEmployeeTeams] = useState<any[]>([]);
  const [employeeProjects, setEmployeeProjects] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [manager, setManager] = useState<any>(null);

  const [leaves, setLeaves] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    employeeService
      .getById(id)
      .then(async (emp: any) => {
        if (!active || !emp) return;
        setEmployee(emp);

        const teamIds = Array.isArray(emp.teamIds) ? emp.teamIds : [];
        const [rawTeams, rawProjects, dept, rawReports] = await Promise.all([
          teamService.list().catch(() => []),
          projectService.list().catch(() => []),
          emp.departmentId ? departmentService.getById(emp.departmentId).catch(() => null) : Promise.resolve(null),
          typeof (employeeService as any)?.reports === 'function'
            ? (employeeService as any).reports(emp.id).catch(() => [])
            : Promise.resolve([]),
        ]);

        if (!active) return;

        const allTeams = Array.isArray(rawTeams) ? rawTeams : [];
        const allProjects = Array.isArray(rawProjects) ? rawProjects : [];
        const reportsList = Array.isArray(rawReports) ? rawReports : [];

        const teams = allTeams.filter((t: any) => teamIds.includes(t.id));
        setEmployeeTeams(teams);
        setEmployeeProjects(allProjects.filter((p: any) => teams.some((t: any) => t.id === p.teamId)));
        setDepartment(dept);
        setReports(reportsList);

        if (emp.managerId) {
          employeeService
            .getById(emp.managerId)
            .then((m: any) => active && setManager(m))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load employee.');
        setLoading(false);
      });

    // Independent collections with safe fallbacks
    if (typeof (leaveService as any)?.byEmployee === 'function') {
      (leaveService as any).byEmployee(id).then((r: any) => active && setLeaves(Array.isArray(r) ? r : [])).catch(() => {});
    }

    if (typeof (attendanceService as any)?.byEmployee === 'function') {
      (attendanceService as any)
        .byEmployee(id)
        .then((r: any) => {
          if (active) setAttendance(Array.isArray(r) ? r : []);
        })
        .catch(() => {});
    }

    if (typeof (salaryService as any)?.historyByEmployee === 'function') {
      (salaryService as any).historyByEmployee(id).then((r: any) => active && setSalaryHistory(Array.isArray(r) ? r : [])).catch(() => {});
    } else {
      setSalaryHistory([]);
    }

    if (typeof (salaryService as any)?.revisionsByEmployee === 'function') {
      (salaryService as any).revisionsByEmployee(id).then((r: any) => active && setRevisions(Array.isArray(r) ? r : [])).catch(() => {});
    } else {
      setRevisions([]);
    }

    if (typeof (promotionService as any)?.byEmployee === 'function') {
      (promotionService as any).byEmployee(id).then((r: any) => active && setPromotions(Array.isArray(r) ? r : [])).catch(() => {});
    } else {
      setPromotions([]);
    }

    return () => {
      active = false;
    };
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <LoadingState label="Loading profile…" />;

  if (error || !employee) {
    return (
      <ErrorState
        title="Employee not found"
        description={error ?? "This employee profile doesn't exist or has been removed."}
        onRetry={load}
        action={
          <Link to="/employees">
            <Button variant="subtle" size="sm">
              Back to directory
            </Button>
          </Link>
        }
      />
    );
  }

  const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employee Profile';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to directory
        </Link>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {employee.status || 'ACTIVE'}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl font-bold border border-teal-500/30 shadow-lg">
            {employee.firstName ? employee.firstName.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {name}
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {employee.employeeCode || `ID #${employee.id}`}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Briefcase size={14} className="text-teal-400" />
              {employee.designation || 'Staff Member'}
              <span>•</span>
              <Building size={14} className="text-teal-400" />
              {department?.name || employee.departmentName || 'General Dept'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-xs text-slate-500">Employment Type</p>
            <p className="text-sm font-semibold text-white mt-0.5">{employee.employmentType || 'Full-time'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Joined</p>
            <p className="text-sm font-semibold text-white mt-0.5">{employee.joinDate || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm font-semibold text-white mt-0.5">{employee.location || 'Remote / Office'}</p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Contact & Info */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400">
              Contact Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="font-medium text-white break-all">{employee.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="font-medium text-white">{employee.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Salary</p>
                  <p className="font-medium text-white">
                    {employee.salary ? `₹${employee.salary.toLocaleString()}` : 'Confidential / Not Set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Teams & Reporting */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400">
              Organization Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Users size={15} /> Reporting Manager
                </span>
                <span className="font-medium text-white">
                  {manager ? `${manager.firstName} ${manager.lastName}` : employee.managerName || 'Direct to HR / Head'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <FolderKanban size={15} /> Assigned Teams
                </span>
                <span className="font-medium text-white">
                  {employeeTeams.length > 0 ? employeeTeams.map((t) => t.name).join(', ') : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Leaves, Attendance & Salary History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leaves History Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock size={16} className="text-teal-400" />
                Leave Applications
              </h3>
              <span className="text-xs text-slate-400">{leaves.length} records</span>
            </div>

            {leaves.length > 0 ? (
              <div className="space-y-2">
                {leaves.map((leave: any, idx: number) => {
                  const leaveType = leave.type || leave.leaveType || 'General';
                  const startDate = leave.startDate || leave.fromDate || 'N/A';
                  const endDate = leave.endDate || leave.toDate || 'N/A';
                  const daysCount = leave.days ?? leave.duration ?? 1;
                  const applied = leave.appliedDate || leave.createdAt || 'Recent';

                  return (
                    <div
                      key={leave.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">{leaveType} Leave</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {startDate} to {endDate} ({daysCount} {daysCount === 1 ? 'day' : 'days'})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {leave.status || 'Approved'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1">Applied: {applied}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-800/30">
                No leave requests filed yet.
              </div>
            )}
          </div>

          {/* Attendance History Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-400" />
                Recent Attendance
              </h3>
              <span className="text-xs text-slate-400">{attendance.length} entries</span>
            </div>

            {attendance.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attendance.slice(0, 6).map((att: any, idx: number) => (
                  <div
                    key={att.id || idx}
                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{att.date || 'Today'}</p>
                      <p className="text-slate-400 mt-0.5">
                        In: {att.checkIn || '09:30 AM'} • Out: {att.checkOut || '06:30 PM'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/10 text-teal-400">
                      {att.status || 'Present'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-800/30">
                No attendance logs found for this cycle.
              </div>
            )}
          </div>

          {/* Promotions & Progression */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Award size={16} className="text-teal-400" />
                Career Growth & Promotions
              </h3>
            </div>

            {promotions.length > 0 ? (
              <div className="space-y-2">
                {promotions.map((p: any, idx: number) => (
                  <div
                    key={p.id || idx}
                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{p.toRole || p.designation || 'New Role'}</p>
                      <p className="text-slate-400 mt-0.5">Effective: {p.effectiveDate || 'N/A'}</p>
                    </div>
                    <span className="text-emerald-400 font-medium">Promoted</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-800/30">
                No promotions recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}