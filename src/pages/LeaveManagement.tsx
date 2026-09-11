import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui";
import { CalendarDays, CheckCircle, Clock3, UserCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leaveService } from "@/services";
import type { LeaveRequest } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button, StatCard } from "@/components/ui";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar, FilterSelect } from "@/components/shared/FilterBar";

export default function LeaveManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [onLeaveCount, setOnLeaveCount] = useState(0);

  function load() {
    setLoading(true);
    setError("");

    Promise.all([
      leaveService.list().catch(() => []),
      leaveService.pendingCount().catch(() => 0),
      leaveService.onLeaveCount().catch(() => 0),
    ])
      .then(([rawList, pending, onLeave]) => {
        const list = Array.isArray(rawList) ? rawList : [];

        // Strict Role Isolation: Employee only sees their own leaves
        const userSpecificLeaves = isAdmin
          ? list
          : list.filter((l: any) => {
              if (user?.employeeId && l.employeeId) {
                return String(l.employeeId) === String(user.employeeId);
              }
              if (user?.email && l.email) {
                return l.email.toLowerCase() === user.email.toLowerCase();
              }
              return true;
            });

        setLeaves(userSpecificLeaves);
        setPendingCount(typeof pending === "number" ? pending : 0);
        setOnLeaveCount(typeof onLeave === "number" ? onLeave : 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load leave records");
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, [user]);

  const approvedCount = useMemo(() => {
    return leaves.filter((l) => l.status === "Approved").length;
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchSearch =
        !search ||
        (leave.employeeName?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchStatus = !statusFilter || leave.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [leaves, search, statusFilter]);

  if (loading) {
    return <LoadingState label="Loading Leave Management..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load leaves"
        description={error}
        onRetry={load}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "Leave Management" : "My Leave Requests"}
        description={
          isAdmin
            ? "Review, approve, or reject employee leave applications."
            : "Apply for leaves and track your approval status."
        }
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => navigate("/leaves/new")}>
            Apply Leave
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          index={0}
          icon={<CalendarDays size={22} />}
          label="Total Requests"
          value={leaves.length}
          supportingText={isAdmin ? "All Staff Requests" : "Your Applications"}
          accentColor="#00BFA6"
        />

        <StatCard
          index={1}
          icon={<Clock3 size={22} />}
          label="Pending"
          value={isAdmin ? pendingCount : leaves.filter((l) => l.status === "Pending").length}
          supportingText="Awaiting Approval"
          accentColor="#FFB020"
        />

        <StatCard
          index={2}
          icon={<CheckCircle size={22} />}
          label="Approved"
          value={approvedCount}
          supportingText="Granted Leaves"
          accentColor="#12B76A"
        />

        <StatCard
          index={3}
          icon={<UserCheck size={22} />}
          label="On Leave"
          value={onLeaveCount}
          supportingText="Currently Away"
          accentColor="#0F2A2A"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {isAdmin && (
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Employee..."
          />
        )}

        <FilterBar
          activeCount={statusFilter ? 1 : 0}
          onClear={() => setStatusFilter("")}
        >
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ]}
          />
        </FilterBar>
      </div>

      {filteredLeaves.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title="No Leave Requests"
          description={
            isAdmin
              ? "No leave requests found matching your filters."
              : "You haven't submitted any leave requests yet."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] surface shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Employee</th>
                <th className="px-5 py-4 text-left font-semibold">From</th>
                <th className="px-5 py-4 text-left font-semibold">To</th>
                <th className="px-5 py-4 text-left font-semibold">Reason</th>
                <th className="px-5 py-4 text-left font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">
                  {isAdmin ? "Action" : "Approval State"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-default)]">
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  <td className="px-5 py-4 font-medium text-[var(--text-primary)]">
                    {leave.employeeName || "Employee"}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-secondary)]">
                    {leave.fromDate}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-secondary)]">
                    {leave.toDate}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-secondary)] max-w-xs truncate">
                    {leave.reason || "Personal"}
                  </td>

                  <td className="px-5 py-4">
                    {leave.status === "Approved" && (
                      <Badge tone="success">Approved</Badge>
                    )}
                    {leave.status === "Pending" && (
                      <Badge tone="warning">Pending</Badge>
                    )}
                    {leave.status === "Rejected" && (
                      <Badge tone="error">Rejected</Badge>
                    )}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {isAdmin ? (
                      // ADMIN VIEW: Can Approve or Reject
                      <div className="flex justify-center gap-2">
                        {leave.status === "Pending" ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                leaveService
                                  .approve(leave.id)
                                  .then(() => {
                                    toast.success("Leave Approved");
                                    load();
                                  })
                                  .catch(() => toast.error("Action failed"));
                              }}
                            >
                              Approve
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                leaveService
                                  .reject(leave.id)
                                  .then(() => {
                                    toast.success("Leave Rejected");
                                    load();
                                  })
                                  .catch(() => toast.error("Action failed"));
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                    ) : (
                      // EMPLOYEE VIEW: Cannot Approve/Reject, only tracks status
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {leave.status === "Pending" ? "Under Review" : "Decided"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}