import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ChevronDown, LifeBuoy, Shield } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel, Avatar } from '@/components/ui';
import { useEffect, useState } from 'react';
import { profileService } from '@/services';

export function UserProfileDropdown() {
  const navigate = useNavigate();

  const [name, setName] = useState('Alex Morgan');
  const [role, setRole] = useState('HR Administrator');

  useEffect(() => {
    const loadProfile = async () => {
      // First try the locally saved profile
      const savedProfile = localStorage.getItem('apsara_profile');

      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);

          if (profile?.firstName || profile?.lastName) {
            setName(
              `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
            );
          }

          if (profile?.designation) {
            setRole(profile.designation);
          }
        } catch (error) {
          console.error('Failed to read saved profile:', error);
        }
      }

      // Then try backend so the latest server profile is also loaded
      try {
        const profile = await profileService.getProfile();

        if (profile) {
          setName(
            `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
          );

          if (profile.designation) {
            setRole(profile.designation);
          }

          // Keep local storage synchronized
          localStorage.setItem(
            'apsara_profile',
            JSON.stringify(profile)
          );
        }
      } catch (error) {
        console.log('Could not load profile from backend.');
      }
    };

    loadProfile();

    // Listen for profile changes made from the Profile page
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;

      const profile = customEvent.detail;

      if (!profile) return;

      if (profile.firstName || profile.lastName) {
        setName(
          `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
        );
      }

      if (profile.designation) {
        setRole(profile.designation);
      }
    };

    window.addEventListener(
      'apsara-profile-updated',
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        'apsara-profile-updated',
        handleProfileUpdate
      );
    };
  }, []);

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

            <span className="block text-xs leading-tight text-[var(--text-muted)]">
              {role}
            </span>
          </span>

          <ChevronDown
            size={16}
            className="hidden text-[var(--text-muted)] sm:block"
          />
        </button>
      }
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <Avatar name={name} size="md" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {name}
          </p>

          <p className="truncate text-xs text-[var(--text-muted)]">
            {role}
          </p>
        </div>
      </div>

      <DropdownSeparator />

      <DropdownLabel>Account</DropdownLabel>

      <DropdownItem
        icon={<User size={16} />}
        onClick={() => navigate('/profile')}
      >
        My Profile
      </DropdownItem>

      <DropdownItem
        icon={<Settings size={16} />}
        onClick={() => navigate('/settings')}
      >
        Settings
      </DropdownItem>

      <DropdownItem
        icon={<Shield size={16} />}
        onClick={() => navigate('/security')}
      >
        Security
      </DropdownItem>

      <DropdownItem
        icon={<LifeBuoy size={16} />}
        onClick={() => navigate('/help')}
      >
        Help & Support
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem
        icon={<LogOut size={16} />}
        danger
        onClick={() => navigate('/dashboard')}
      >
        Sign out
      </DropdownItem>
    </Dropdown>
  );
}