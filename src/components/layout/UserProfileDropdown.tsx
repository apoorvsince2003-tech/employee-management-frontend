import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Shield, Briefcase } from 'lucide-react';
import { Dropdown, DropdownSeparator } from '@/components/ui/Dropdown';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleViewProfile = () => {
    if (user?.role === 'ADMIN') {
      navigate('/profile');
    } else {
      navigate(user?.employeeId ? `/employees/${user.employeeId}` : '/profile');
    }
  };

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const roleName = user?.role === 'ADMIN' ? 'Administrator' : 'Staff Employee';

  return (
    <Dropdown
      width={240}
      trigger={
        <button
          className="flex items-center gap-2.5 rounded-xl border border-[var(--border-default)] p-1.5 transition-all hover:bg-[var(--bg-subtle)] focus-ring"
          aria-label="User profile"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-semibold text-teal-400">
            {initial}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-[var(--text-primary)] leading-none max-w-[130px] truncate">
              {user?.email || 'User'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{roleName}</p>
          </div>
        </button>
      }
    >
      <div className="px-3 py-2.5">
        <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.email}</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-400">
          {user?.role === 'ADMIN' ? <Shield size={10} /> : <Briefcase size={10} />}
          {user?.role}
        </span>
      </div>

      <DropdownSeparator />

      <button
        onClick={handleViewProfile}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors text-left"
      >
        <UserIcon size={14} className="text-[var(--text-secondary)]" />
        My Profile
      </button>

      <DropdownSeparator />

      <button
        onClick={handleSignOut}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
      >
        <LogOut size={14} />
        Sign out
      </button>
    </Dropdown>
  );
}