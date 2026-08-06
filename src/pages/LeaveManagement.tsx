import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui";

import { CalendarDays, CheckCircle, Clock3, UserCheck, Plus,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { leaveService } from "@/services";
import type { LeaveRequest } from "@/types";

import {
  Button,
  StatCard,
} from "@/components/ui";

import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import {
  FilterBar,
  FilterSelect,
} from "@/components/shared/FilterBar";

export default function LeaveManagement() {
  const navigate = useNavigate();

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
      leaveService.list(),
      leaveService.pendingCount(),
      leaveService.onLeaveCount(),
    ])
      .then(([list, pending, onLeave]) => {

        setLeaves(list);

        setPendingCount(pending);

        setOnLeaveCount(onLeave);

        setLoading(false);

      })

      .catch((err) => {

        setError(err.message);

        setLoading(false);

      });

  }

  useEffect(() => {

    load();

  }, []);

  const approvedCount = useMemo(() => {

    return leaves.filter(
      (l) => l.status === "Approved"
    ).length;

  }, [leaves]);

  const filteredLeaves = useMemo(() => {

    return leaves.filter((leave) => {

      const matchSearch =
        leave.employeeName
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        !statusFilter ||
        leave.status === statusFilter;

      return matchSearch && matchStatus;

    });

  }, [leaves, search, statusFilter]);

  if (loading) {

    return (
      <LoadingState
        label="Loading Leave Management..."
      />
    );

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
        title="Leave Management"
        description="Manage employee leave requests and approvals."

        actions={
          <Button
  leftIcon={<Plus size={16} />}
  onClick={() => navigate("/leaves/new")}
>
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
          supportingText="All Leave Requests"
          accentColor="#00BFA6"
        />

        <StatCard
          index={1}
          icon={<Clock3 size={22} />}
          label="Pending"
          value={pendingCount}
          supportingText="Waiting Approval"
          accentColor="#FFB020"
        />

        <StatCard
          index={2}
          icon={<CheckCircle size={22} />}
          label="Approved"
          value={approvedCount}
          supportingText="Approved Leaves"
          accentColor="#12B76A"
        />

        <StatCard
          index={3}
          icon={<UserCheck size={22} />}
          label="On Leave"
          value={onLeaveCount}
          supportingText="Employees Away"
          accentColor="#0F2A2A"
        />

      </div>

      <div className="flex flex-col lg:flex-row gap-3">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Employee..."
        />

        <FilterBar
          activeCount={
            statusFilter ? 1 : 0
          }
          onClear={() => setStatusFilter("")}
        >

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              {
                label: "Pending",
                value: "Pending",
              },
              {
                label: "Approved",
                value: "Approved",
              },
              {
                label: "Rejected",
                value: "Rejected",
              },
            ]}
          />

        </FilterBar>

      </div>

      {
  filteredLeaves.length === 0 && (
    <EmptyState
      icon={<CalendarDays size={28} />}
      title="No Leave Requests"
      description="No leave request found."
    />
  )
}

{
  filteredLeaves.length > 0 && (

<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

<table className="w-full">

<thead className="bg-gray-50">

<tr>

<th className="px-5 py-4 text-left">Employee</th>

<th className="px-5 py-4 text-left">From</th>

<th className="px-5 py-4 text-left">To</th>

<th className="px-5 py-4 text-left">Reason</th>

<th className="px-5 py-4 text-left">Status</th>

<th className="px-5 py-4 text-center">Action</th>

</tr>

</thead>

<tbody>

{filteredLeaves.map((leave)=>(

<tr
key={leave.id}
className="border-t hover:bg-gray-50 transition-all"
>

<td className="px-5 py-4 font-medium">

{leave.employeeName}

</td>

<td className="px-5 py-4">

{leave.fromDate}

</td>

<td className="px-5 py-4">

{leave.toDate}

</td>

<td className="px-5 py-4">

{leave.reason}

</td>

<td className="px-5 py-4">

{leave.status==="Approved" && (

<Badge tone="success">

Approved

</Badge>

)}

{leave.status==="Pending" && (

<Badge tone="warning">

Pending

</Badge>

)}

{leave.status==="Rejected" && (

<Badge tone="error">

Rejected

</Badge>

)}

</td>

<td className="px-5 py-4">

<div className="flex justify-center gap-2">

{leave.status==="Pending" ? (

<>

<Button

size="sm"

onClick={()=>{

leaveService

.approve(leave.id)

.then(()=>{

toast.success("Leave Approved")

load()

})

}}

>

Approve

</Button>

<Button

variant="outline"

size="sm"

onClick={()=>{

leaveService

.reject(leave.id)

.then(()=>{

toast.success("Leave Rejected")

load()

})

}}

>

Reject

</Button>

</>

):(

<Button

variant="outline"

size="sm"

>

View

</Button>

)}

</div>

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