import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ChevronDown, LifeBuoy, Shield } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel, Avatar } from '@/components/ui';

export function UserProfileDropdown() {
  const navigate = useNavigate();
  const name = 'Alex Morgan';
  const role = 'HR Administrator';

  return (
    <Dropdown
      width={256}
      trigger={
        <button className="flex items-center gap-2.5 rounded-xl border border-[var(--border-default)] py-1.5 pl-1.5 pr-2.5 transition-all hover:border-brand-accent/40 hover:bg-[var(--bg-subtle)] focus-ring">
          <Avatar name={name} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-[var(--text-primary)]">
              {name}
            </span>
            <span className="block text-xs leading-tight text-[var(--text-muted)]">{role}</span>
          </span>
          <ChevronDown size={16} className="hidden text-[var(--text-muted)] sm:block" />
        </button>
      }
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <Avatar name={name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{name}</p>
          <p className="truncate text-xs text-[var(--text-muted)]">{role}</p>
        </div>
      </div>
      <DropdownSeparator />
      <DropdownLabel>Account</DropdownLabel>
      <DropdownItem icon={<User size={16} />} onClick={() => navigate('/profile')}>
        My Profile
      </DropdownItem>
      <DropdownItem icon={<Settings size={16} />} onClick={() => navigate('/settings')}>
        Settings
      </DropdownItem>
      <DropdownItem icon={<Shield size={16} />} onClick={() => navigate('/security')}>
        Security
      </DropdownItem>
      <DropdownItem icon={<LifeBuoy size={16} />} onClick={() => navigate('/help')}>
        Help & Support
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={<LogOut size={16} />} danger onClick={() => navigate('/dashboard')}>
        Sign out
      </DropdownItem>
    </Dropdown>
  );
}
