import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import {
  Palette,
  Bell,
  Globe,
  User as UserIcon,
  Sun,
  Moon,
  Monitor,
  Check,
  Shield,
  ChevronRight,
  Languages,
  LayoutDashboard,
  Mail,
  MessageSquare,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, type Theme } from '@/constants';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, Badge, Button } from '@/components/ui';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/utils';

const themeOptions: { value: Theme; label: string; description: string; icon: typeof Sun }[] = [
  { value: THEMES.LIGHT, label: 'Light', description: 'Bright and clean', icon: Sun },
  { value: THEMES.DARK, label: 'Dark', description: 'Easy on the eyes', icon: Moon },
  { value: THEMES.SYSTEM, label: 'System', description: 'Match your device', icon: Monitor },
];

const languages = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'ja', label: '日本語', flag: 'JA' },
  { code: 'zh', label: '中文', flag: 'ZH' },
];

interface NotifPref {
  emailNotifications: boolean;
  pushNotifications: boolean;
  leaveUpdates: boolean;
  promotionAlerts: boolean;
  weeklyDigest: boolean;
  mentionAlerts: boolean;
}

interface ProfilePref {
  compactMode: boolean;
  showOnlineStatus: boolean;
  autoSaveDrafts: boolean;
  keyboardShortcuts: boolean;
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [notif, setNotif] = useState<NotifPref>({
    emailNotifications: true,
    pushNotifications: true,
    leaveUpdates: true,
    promotionAlerts: false,
    weeklyDigest: true,
    mentionAlerts: true,
  });
  const [profilePref, setProfilePref] = useState<ProfilePref>({
    compactMode: false,
    showOnlineStatus: true,
    autoSaveDrafts: true,
    keyboardShortcuts: true,
  });

  function updateNotif(key: keyof NotifPref, value: boolean) {
    setNotif((prev) => ({ ...prev, [key]: value }));
  }

  function updateProfilePref(key: keyof ProfilePref, value: boolean) {
    setProfilePref((prev) => ({ ...prev, [key]: value }));
  }

  const saveSettings = () => {
  toast.success("Settings updated successfully 🎉");
  };
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Manage your appearance, notifications, language, and profile preferences"
      />

      <div className="rounded-2xl border border-[var(--border-default)] bg-gradient-to-r from-teal-700 to-emerald-600 p-6 text-white shadow-lg">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-4">

      <div className="h-20 w-20 rounded-full bg-white text-teal-700 flex items-center justify-center text-3xl font-bold">
        AY
        <div className="mt-5 grid grid-cols-3 gap-4">

<div>
  <div>
   <h2>Apoorv Yadav</h2>
   ...
</div>
<p className="text-sm opacity-70">
Projects
</p>

<h3 className="text-2xl font-bold">
12
</h3>
</div>

<div>
<p className="text-sm opacity-70">
Employees
</p>

<h3 className="text-2xl font-bold">
245
</h3>
</div>

<div>
<p className="text-sm opacity-70">
Experience
</p>

<h3 className="text-2xl font-bold">
5 Years
</h3>
</div>

</div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          Apoorv Yadav
        </h2>

        <p className="opacity-90">
          HR Administrator
        </p>

        <p className="text-sm opacity-75">
          Employee Management System
        </p>
      </div>

    </div>

    <Badge className="rounded-full bg-white text-teal-700 px-4 py-1 text-sm font-semibold">
      Active
    </Badge>

  </div>

</div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          icon={<UserIcon size={18} />}
          title="My Profile"
          description="View and edit your personal profile"
          to="/profile"
        />
        <QuickLink
          icon={<Shield size={18} />}
          title="Security"
          description="Password, 2FA, and active sessions"
          to="/security"
        />
        <QuickLink
          icon={<LayoutDashboard size={18} />}
          title="Dashboard"
          description="Back to your main workspace"
          to="/dashboard"
        />
      </div>

      {/* Appearance & Theme */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <Palette size={17} className="text-brand-accent" />
              Appearance
            </span>
          }
          subtitle="Choose how APSARA looks to you"
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  'group relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all focus-ring',
                  active
                    ? 'border-brand-accent bg-brand-secondary/40 dark:bg-mint-600/10'
                    : 'border-[var(--border-default)] hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                    active ? 'bg-brand-accent text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
                  )}
                >
                  <opt.icon size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{opt.description}</p>
                </div>
                {active && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Notification Preferences */}
        <Card>
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Bell size={17} className="text-brand-accent" />
                Notification Preferences
              </span>
            }
            subtitle="Control how and when you receive alerts"
          />
          <div className="mt-5 space-y-1">
            <PrefRow
              icon={<Mail size={16} />}
              label="Email notifications"
              description="Receive updates via email"
              checked={notif.emailNotifications}
              onChange={(v) => updateNotif('emailNotifications', v)}
            />
            <PrefRow
              icon={<Bell size={16} />}
              label="Push notifications"
              description="Get real-time browser alerts"
              checked={notif.pushNotifications}
              onChange={(v) => updateNotif('pushNotifications', v)}
            />
            <PrefRow
              icon={<CalendarDays size={16} />}
              label="Leave updates"
              description="Approvals, rejections, and reminders"
              checked={notif.leaveUpdates}
              onChange={(v) => updateNotif('leaveUpdates', v)}
            />
            <PrefRow
              icon={<TrendingUp size={16} />}
              label="Promotion alerts"
              description="Notifications about promotion activity"
              checked={notif.promotionAlerts}
              onChange={(v) => updateNotif('promotionAlerts', v)}
            />
            <PrefRow
              icon={<LayoutDashboard size={16} />}
              label="Weekly digest"
              description="Summary of activity every Monday"
              checked={notif.weeklyDigest}
              onChange={(v) => updateNotif('weeklyDigest', v)}
            />
            <PrefRow
              icon={<MessageSquare size={16} />}
              label="Mention alerts"
              description="When someone mentions you"
              checked={notif.mentionAlerts}
              onChange={(v) => updateNotif('mentionAlerts', v)}
            />
          </div>
        </Card>

        {/* Language Preferences */}
        <Card>
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Globe size={17} className="text-brand-accent" />
                Language Preferences
              </span>
            }
            subtitle="Select your preferred display language"
          />
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {languages.map((lang) => {
              const active = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border p-3 transition-all focus-ring',
                    active
                      ? 'border-brand-accent bg-brand-secondary/40 dark:bg-mint-600/10'
                      : 'border-[var(--border-default)] hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                      active ? 'bg-brand-accent text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
                    )}
                  >
                    {lang.flag}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{lang.label}</span>
                  </span>
                  {active && <Check size={14} className="ml-auto shrink-0 text-brand-accent" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--bg-subtle)] p-3">
            <Languages size={16} className="text-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-secondary)]">
              Language changes apply to the interface text. Some system-generated content may remain in English.
            </p>
          </div>
        </Card>
      </div>

      {/* Profile Preferences */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <UserIcon size={17} className="text-brand-accent" />
              Profile Preferences
            </span>
          }
          subtitle="Customize your workspace experience"
        />
        <div className="mt-5 grid grid-cols-1 gap-1 sm:grid-cols-2">
          <PrefRow
            icon={<LayoutDashboard size={16} />}
            label="Compact mode"
            description="Reduce spacing for denser layouts"
            checked={profilePref.compactMode}
            onChange={(v) => updateProfilePref('compactMode', v)}
          />
          <PrefRow
            icon={<UserIcon size={16} />}
            label="Show online status"
            description="Let others see when you're active"
            checked={profilePref.showOnlineStatus}
            onChange={(v) => updateProfilePref('showOnlineStatus', v)}
          />
          <PrefRow
            icon={<Check size={16} />}
            label="Auto-save drafts"
            description="Automatically save form drafts"
            checked={profilePref.autoSaveDrafts}
            onChange={(v) => updateProfilePref('autoSaveDrafts', v)}
          />
          <PrefRow
            icon={<Monitor size={16} />}
            label="Keyboard shortcuts"
            description="Enable power-user keyboard navigation"
            checked={profilePref.keyboardShortcuts}
            onChange={(v) => updateProfilePref('keyboardShortcuts', v)}
          />
        </div>
      </Card>

      <div className="rounded-2xl border border-[var(--border-default)] p-6">

<div className="flex items-center justify-between">

<div>

<h2 className="text-xl font-bold">
Ready to Save?
<div className="mt-5 grid grid-cols-3 gap-4">

<div className="rounded-xl bg-[var(--bg-subtle)] p-4">

<h3 className="font-semibold">
Theme
</h3>

<p className="text-sm text-[var(--text-secondary)]">
{theme}
</p>

</div>

<div className="rounded-xl bg-[var(--bg-subtle)] p-4">

<h3 className="font-semibold">
Language
</h3>

<p className="text-sm text-[var(--text-secondary)]">
{language.toUpperCase()}
</p>

</div>

<div className="rounded-xl bg-[var(--bg-subtle)] p-4">

<h3 className="font-semibold">
Notifications
</h3>

<p className="text-sm text-[var(--text-secondary)]">
{Object.values(notif).filter(Boolean).length} Enabled
</p>

</div>

</div>
</h2>


<p className="text-[var(--text-secondary)] mt-1">
Your preferences will be applied immediately across APSARA.
</p>

</div>

<div className="flex gap-3">

<Button
variant="secondary"
onClick={() => window.location.reload()}
>
Reset
</Button>

<Button
onClick={saveSettings}
>
Save Settings
</Button>

</div>

</div>

</div>
    </div>
  );
}

function PrefRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-[var(--bg-subtle)]">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)]">{icon}</span>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} aria-label={label} />
    </div>
  );
}

function QuickLink({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--card-bg)] p-5 shadow hover:shadow-xl hover:scale-[1.02] transition-all"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/60 text-brand-accent dark:bg-mint-600/15">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-brand-accent">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-[var(--text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-brand-accent" />
    </button>
  );
}
