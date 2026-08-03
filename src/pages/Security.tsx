import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  KeyRound,
  Smartphone,
  Monitor,
  Tablet,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Eye,
  EyeOff,
  Fingerprint,
  XCircle,
  History,
  Globe,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, Button, Badge, Avatar } from '@/components/ui';
import { Toggle } from '@/components/ui/Toggle';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { cn, relativeTime, formatDate } from '@/utils';

interface Session {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface LoginEvent {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  ip: string;
  status: 'success' | 'failed';
}

const initialSessions: Session[] = [
  { id: 's1', device: 'desktop', browser: 'Chrome 126', os: 'macOS 14', location: 'San Francisco, CA', ip: '192.168.1.42', lastActive: new Date().toISOString(), current: true },
  { id: 's2', device: 'mobile', browser: 'Safari Mobile', os: 'iOS 17', location: 'San Francisco, CA', ip: '10.0.0.18', lastActive: new Date(Date.now() - 3600000 * 5).toISOString(), current: false },
  { id: 's3', device: 'desktop', browser: 'Firefox 127', os: 'Windows 11', location: 'Remote - VPN', ip: '172.16.0.5', lastActive: new Date(Date.now() - 3600000 * 28).toISOString(), current: false },
];

const loginHistory: LoginEvent[] = [
  { id: 'l1', timestamp: new Date().toISOString(), device: 'Chrome 126 · macOS', location: 'San Francisco, CA', ip: '192.168.1.42', status: 'success' },
  { id: 'l2', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), device: 'Safari · iOS', location: 'San Francisco, CA', ip: '10.0.0.18', status: 'success' },
  { id: 'l3', timestamp: new Date(Date.now() - 3600000 * 26).toISOString(), device: 'Firefox · Windows', location: 'Remote - VPN', ip: '172.16.0.5', status: 'success' },
  { id: 'l4', timestamp: new Date(Date.now() - 3600000 * 50).toISOString(), device: 'Unknown · Linux', location: 'Unknown', ip: '45.227.19.2', status: 'failed' },
  { id: 'l5', timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), device: 'Chrome 126 · macOS', location: 'San Francisco, CA', ip: '192.168.1.42', status: 'success' },
];

const deviceIcon = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

export default function Security() {
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [revokeTarget, setRevokeTarget] = useState<Session | null>(null);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  // Password form state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  function handlePasswordChange() {
    setPwdError('');
    setPwdSuccess(false);
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError('All fields are required.');
      return;
    }
    if (newPwd.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }
    setPwdSuccess(true);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setTimeout(() => setPwdSuccess(false), 4000);
  }

  function revokeSession() {
    if (!revokeTarget) return;
    setSessions((prev) => prev.filter((s) => s.id !== revokeTarget.id));
    setRevokeTarget(null);
  }

  function revokeAllOther() {
    setSessions((prev) => prev.filter((s) => s.current));
    setRevokeAllOpen(false);
  }

  const otherSessions = sessions.filter((s) => !s.current);
  const passwordStrength = getStrength(newPwd);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Security"
        description="Manage your password, two-factor authentication, and active sessions"
      />

      {/* Security overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SecurityCard
          icon={<Shield size={20} />}
          title="Account protection"
          status={twoFA ? '2FA Enabled' : '2FA Disabled'}
          tone={twoFA ? 'success' : 'warning'}
          description={twoFA ? 'Your account has an extra layer of security.' : 'Enable 2FA for stronger protection.'}
        />
        <SecurityCard
          icon={<Monitor size={20} />}
          title="Active sessions"
          status={`${sessions.length} device${sessions.length === 1 ? '' : 's'}`}
          tone="info"
          description={`${otherSessions.length} other session${otherSessions.length === 1 ? '' : 's'} active`}
        />
        <SecurityCard
          icon={<KeyRound size={20} />}
          title="Password"
          status={pwdSuccess ? 'Just changed' : 'Last changed 3 months ago'}
          tone={pwdSuccess ? 'success' : 'neutral'}
          description="We recommend updating your password regularly."
        />
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <Lock size={17} className="text-brand-accent" />
              Change Password
            </span>
          }
          subtitle="Update your account password"
        />
        <div className="mt-5 max-w-lg space-y-4">
          <PasswordField
            label="Current password"
            value={currentPwd}
            onChange={setCurrentPwd}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
          />
          <PasswordField
            label="New password"
            value={newPwd}
            onChange={setNewPwd}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
          {newPwd.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i < passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-[var(--border-default)]',
                    )}
                  />
                ))}
              </div>
              <p className={cn('text-xs font-medium', passwordStrength.textColor)}>
                {passwordStrength.label}
              </p>
            </div>
          )}
          <PasswordField
            label="Confirm new password"
            value={confirmPwd}
            onChange={setConfirmPwd}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />

          {pwdError && (
            <div className="flex items-center gap-2 rounded-xl bg-error-50 px-3 py-2.5 text-sm text-error-700 dark:bg-error-500/15 dark:text-error-100">
              <AlertTriangle size={16} className="shrink-0" />
              {pwdError}
            </div>
          )}
          {pwdSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2.5 text-sm text-success-700 dark:bg-success-500/15 dark:text-success-100">
              <CheckCircle2 size={16} className="shrink-0" />
              Password updated successfully.
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handlePasswordChange} leftIcon={<KeyRound size={15} />}>
              Update password
            </Button>
          </div>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <Fingerprint size={17} className="text-brand-accent" />
              Two-Factor Authentication
            </span>
          }
          subtitle="Add an extra layer of security to your account"
          action={<Toggle checked={twoFA} onChange={setTwoFA} aria-label="Toggle 2FA" />}
        />
        <div className="mt-4">
          {twoFA ? (
            <div className="flex items-start gap-3 rounded-xl bg-success-50 p-4 dark:bg-success-500/10">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success-600 dark:text-success-100" />
              <div>
                <p className="text-sm font-medium text-success-700 dark:text-success-100">2FA is enabled</p>
                <p className="mt-0.5 text-xs text-success-600/80 dark:text-success-100/70">
                  You'll be asked for a verification code from your authenticator app when signing in.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-warning-50 p-4 dark:bg-warning-500/10">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-warning-600 dark:text-warning-100" />
              <div>
                <p className="text-sm font-medium text-warning-700 dark:text-warning-100">2FA is disabled</p>
                <p className="mt-0.5 text-xs text-warning-600/80 dark:text-warning-100/70">
                  Enable two-factor authentication to protect your account from unauthorized access.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <Monitor size={17} className="text-brand-accent" />
              Active Sessions
            </span>
          }
          subtitle="Devices currently signed in to your account"
          action={
            otherSessions.length > 0 ? (
              <Button variant="outline" size="sm" leftIcon={<LogOut size={14} />} onClick={() => setRevokeAllOpen(true)}>
                Revoke all others
              </Button>
            ) : undefined
          }
        />
        <div className="mt-4 space-y-2">
          {sessions.map((session, i) => {
            const Icon = deviceIcon[session.device];
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex flex-col gap-3 rounded-xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {session.browser} · {session.os}
                      </p>
                      {session.current && <Badge tone="success" dot>This device</Badge>}
                    </div>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <MapPin size={11} /> {session.location}
                      <span className="text-[var(--border-strong)]">·</span>
                      <Clock size={11} /> {relativeTime(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<LogOut size={14} />}
                    onClick={() => setRevokeTarget(session)}
                    className="text-error-600 hover:bg-error-50 dark:text-error-100 dark:hover:bg-error-500/10"
                  >
                    Revoke
                  </Button>
                )}
              </motion.div>
            );
          })}
          {sessions.length === 0 && (
            <div className="py-8 text-center">
              <Monitor size={28} className="mx-auto text-[var(--text-muted)]" />
              <p className="mt-3 text-sm text-[var(--text-secondary)]">No active sessions</p>
            </div>
          )}
        </div>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <History size={17} className="text-brand-accent" />
              Login Activity
            </span>
          }
          subtitle="Recent sign-in attempts and security events"
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Device</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">IP Address</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((event) => (
                <tr key={event.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(event.timestamp)}, {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{event.device}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Globe size={12} className="text-[var(--text-muted)]" />
                      {event.location}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-[var(--text-muted)]">{event.ip}</td>
                  <td className="py-3">
                    {event.status === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-100">
                        <CheckCircle2 size={14} /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-error-600 dark:text-error-100">
                        <XCircle size={14} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation dialogs */}
      <ConfirmationDialog
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={revokeSession}
        title="Revoke session?"
        description={
          revokeTarget
            ? `This will sign out the ${revokeTarget.browser} session on ${revokeTarget.os}. The user will need to sign in again.`
            : ''
        }
        confirmLabel="Revoke session"
        destructive
      />

      <ConfirmationDialog
        open={revokeAllOpen}
        onClose={() => setRevokeAllOpen(false)}
        onConfirm={revokeAllOther}
        title="Revoke all other sessions?"
        description={`This will sign out ${otherSessions.length} other device${otherSessions.length === 1 ? '' : 's'}. You'll stay signed in on this device.`}
        confirmLabel="Revoke all"
        destructive
      />
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  status,
  tone,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  tone: 'success' | 'warning' | 'info' | 'neutral';
  description: string;
}) {
  const toneStyles = {
    success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-100',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-100',
    info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-100',
    neutral: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
  };
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', toneStyles[tone])}>
          {icon}
        </span>
        <Badge tone={tone === 'neutral' ? 'neutral' : tone}>{status}</Badge>
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
    </Card>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className="apsara-input pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-ring rounded-lg"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

function getStrength(pwd: string): { score: number; label: string; color: string; textColor: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { label: 'Very weak', color: 'bg-error-500', textColor: 'text-error-600 dark:text-error-100' },
    { label: 'Weak', color: 'bg-warning-500', textColor: 'text-warning-600 dark:text-warning-100' },
    { label: 'Fair', color: 'bg-sky-500', textColor: 'text-sky-600 dark:text-sky-100' },
    { label: 'Good', color: 'bg-brand-accent', textColor: 'text-brand-accent' },
    { label: 'Strong', color: 'bg-success-500', textColor: 'text-success-600 dark:text-success-100' },
  ];
  return { score, ...levels[score] };
}
