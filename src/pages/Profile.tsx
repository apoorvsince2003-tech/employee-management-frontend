import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Users,
  Globe,
  Linkedin,
  Github,
  Pencil,
  Camera,
  Download,
  Cake,
  Flag,
  Home,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { ProfileHeader, MetaItem } from '@/components/shared/ProfileHeader';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, Button, Badge, Avatar } from '@/components/ui';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate } from '@/utils';
import { profileService } from "@/services";

type TabId = 'personal' | 'work' | 'contact';

const tabItems = [
  { id: 'personal' as TabId, label: 'Personal', icon: <User size={15} /> },
  { id: 'work' as TabId, label: 'Work', icon: <Briefcase size={15} /> },
  { id: 'contact' as TabId, label: 'Contact', icon: <Phone size={15} /> },
];

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  employeeCode: string;
  employmentType: string;
  status: string;
  joinDate: string;
  location: string;
  manager: string;
  reports: number;
  bio: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  address: string;
  emergencyContact: string;
  emergencyName: string;
  linkedin: string;
  github: string;
  website: string;
}

const initialProfile: ProfileData = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@apsara.systems',
  phone: '+1 (415) 555-0182',
  designation: 'HR Administrator',
  department: 'Human Resources',
  employeeCode: 'APS-001',
  employmentType: 'Full-time',
  status: 'Active',
  joinDate: '2021-03-15',
  location: 'San Francisco, CA',
  manager: 'Sarah Chen',
  reports: 12,
  bio: 'HR professional with 8+ years of experience in talent management, employee engagement, and organizational development. Passionate about building inclusive workplaces.',
  dateOfBirth: '1990-07-22',
  gender: 'Female',
  nationality: 'American',
  address: '1234 Market Street, Apt 5B, San Francisco, CA 94103',
  emergencyContact: '+1 (415) 555-0199',
  emergencyName: 'Jordan Morgan',
  linkedin: 'linkedin.com/in/alexmorgan',
  github: 'github.com/alexmorgan',
  website: 'alexmorgan.io',
};

export default function Profile() {
  const [tab, setTab] = useState<TabId>('personal');
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<ProfileData>(initialProfile);
  const [avatarKey, setAvatarKey] = useState(0);
  useEffect(() => {
  profileService
    .getProfile()
    .then((data) => {
      if (data) {
        setProfile(data);
        setEditDraft(data);
      } else {
        console.log("No profile found, using default profile");
        setProfile(initialProfile);
        setEditDraft(initialProfile);
      }
    })
    .catch((error) => {
      console.log("Profile API failed, using default profile", error);
      setProfile(initialProfile);
      setEditDraft(initialProfile);
    });
}, []);

  function openEdit() {
    setEditDraft(profile);
    setEditOpen(true);
  }

  async function saveEdit() {
    console.log("Save button clicked");
  try {
    await profileService.updateProfile(editDraft);

    setProfile(editDraft);

    setEditOpen(false);

  } catch {

    try {

      await profileService.createProfile(editDraft);

      setProfile(editDraft);

      setEditOpen(false);

    } catch {

      alert("Failed to save profile");

    }

  }
  console.log(editDraft);
  localStorage.setItem(
  "profileName",
  `${editDraft.firstName} ${editDraft.lastName}`
);
console.log(localStorage.getItem("profileName"));
}

  function handleAvatarChange() {
    setAvatarKey((k) => k + 1);
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={fullName}
        subtitle={profile.designation}
        backLink="/settings"
        backLabel="Back to settings"
        badges={
          <>
            <Badge tone="success" dot>{profile.status}</Badge>
            <Badge tone="neutral">{profile.employmentType}</Badge>
            <Badge tone="primary">{profile.employeeCode}</Badge>
          </>
        }
        meta={
          <>
            <MetaItem icon={<Building2 size={14} />} label={profile.department} />
            <MetaItem icon={<MapPin size={14} />} label={profile.location} />
            <MetaItem icon={<Calendar size={14} />} label={`Joined ${formatDate(profile.joinDate)}`} />
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download size={15} />}>Export</Button>
            <Button size="sm" leftIcon={<Pencil size={15} />} onClick={openEdit}>Edit Profile</Button>
          </>
        }
      />

      <Tabs items={tabItems} value={tab} onChange={(v) => setTab(v as TabId)} />

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {tab === 'personal' && <PersonalTab profile={profile} />}
        {tab === 'work' && <WorkTab profile={profile} />}
        {tab === 'contact' && <ContactTab profile={profile} />}
      </motion.div>

      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        draft={editDraft}
        onChange={setEditDraft}
        onSave={saveEdit}
        avatarKey={avatarKey}
        onAvatarChange={handleAvatarChange}
        fullName={fullName}
      />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-1 py-1.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

function PersonalTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="About" subtitle="Personal background and bio" />
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{profile.bio}</p>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InfoRow icon={<Cake size={15} />} label="Date of birth" value={formatDate(profile.dateOfBirth)} />
          <InfoRow icon={<User size={15} />} label="Gender" value={profile.gender} />
          <InfoRow icon={<Flag size={15} />} label="Nationality" value={profile.nationality} />
          <InfoRow icon={<Calendar size={15} />} label="Join date" value={formatDate(profile.joinDate, 'long')} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Quick facts" />
        <div className="mt-4 space-y-3">
          <FactLine icon={<Briefcase size={15} />} label="Role" value={profile.designation} />
          <FactLine icon={<Building2 size={15} />} label="Department" value={profile.department} />
          <FactLine icon={<Users size={15} />} label="Direct reports" value={String(profile.reports)} />
          <FactLine icon={<MapPin size={15} />} label="Location" value={profile.location} />
        </div>
      </Card>
    </div>
  );
}

function WorkTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Employment details" subtitle="Role and organizational information" />
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InfoRow icon={<Briefcase size={15} />} label="Designation" value={profile.designation} />
          <InfoRow icon={<Building2 size={15} />} label="Department" value={profile.department} />
          <InfoRow icon={<User size={15} />} label="Employee code" value={profile.employeeCode} />
          <InfoRow icon={<Calendar size={15} />} label="Join date" value={formatDate(profile.joinDate)} />
          <InfoRow icon={<CheckCircle2 size={15} />} label="Employment type" value={profile.employmentType} />
          <InfoRow icon={<User size={15} />} label="Reports to" value={profile.manager} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Team" />
        <div className="mt-4 space-y-3">
          <FactLine icon={<Users size={15} />} label="Direct reports" value={String(profile.reports)} />
          <FactLine icon={<Building2 size={15} />} label="Department" value={profile.department} />
          <FactLine icon={<User size={15} />} label="Manager" value={profile.manager} />
        </div>
      </Card>
    </div>
  );
}

function ContactTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Contact details" subtitle="Primary and emergency contacts" />
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InfoRow icon={<Mail size={15} />} label="Email" value={profile.email} />
          <InfoRow icon={<Phone size={15} />} label="Phone" value={profile.phone} />
          <InfoRow icon={<Home size={15} />} label="Address" value={profile.address} />
          <InfoRow icon={<Smartphone size={15} />} label="Emergency contact" value={profile.emergencyContact} />
          <InfoRow icon={<User size={15} />} label="Emergency name" value={profile.emergencyName} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Social" subtitle="Professional links" />
        <div className="mt-4 space-y-3">
          <SocialLink icon={<Linkedin size={15} />} label="LinkedIn" value={profile.linkedin} />
          <SocialLink icon={<Github size={15} />} label="GitHub" value={profile.github} />
          <SocialLink icon={<Globe size={15} />} label="Website" value={profile.website} />
        </div>
      </Card>
    </div>
  );
}

function FactLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="text-[var(--text-muted)]">{icon}</span>
        {label}
      </span>
      <Badge tone="neutral">{value}</Badge>
    </div>
  );
}

function SocialLink({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <a
      href={`https://${value}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] p-3 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{value}</p>
      </div>
    </a>
  );
}

function ProfileEditModal({
  open,
  onClose,
  draft,
  onChange,
  onSave,
  avatarKey,
  onAvatarChange,
  fullName,
}: {
  open: boolean;
  onClose: () => void;
  draft: ProfileData;
  onChange: (d: ProfileData) => void;
  onSave: () => void;
  avatarKey: number;
  onAvatarChange: () => void;
  fullName: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      description="Update your personal information. Changes are saved to your profile."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </>
      }
    >
      {/* Avatar update UI */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          <Avatar name={fullName + (avatarKey > 0 ? ` ${avatarKey}` : '')} size="lg" ring />
          <button
            onClick={onAvatarChange}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-white shadow-sm transition-all hover:bg-mint-700 focus-ring"
            aria-label="Update avatar"
          >
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Profile photo</p>
          <p className="text-xs text-[var(--text-muted)]">Click the camera icon to cycle through avatar styles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input className="apsara-input" value={draft.firstName} onChange={(e) => onChange({ ...draft, firstName: e.target.value })} />
        </Field>
        <Field label="Last name">
          <input className="apsara-input" value={draft.lastName} onChange={(e) => onChange({ ...draft, lastName: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className="apsara-input" value={draft.email} onChange={(e) => onChange({ ...draft, email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className="apsara-input" value={draft.phone} onChange={(e) => onChange({ ...draft, phone: e.target.value })} />
        </Field>
        <Field label="Designation">
          <input className="apsara-input" value={draft.designation} onChange={(e) => onChange({ ...draft, designation: e.target.value })} />
        </Field>
        <Field label="Department">
          <input className="apsara-input" value={draft.department} onChange={(e) => onChange({ ...draft, department: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className="apsara-input" value={draft.location} onChange={(e) => onChange({ ...draft, location: e.target.value })} />
        </Field>
        <Field label="Bio">
          <textarea className="apsara-input min-h-[80px] resize-none" value={draft.bio} onChange={(e) => onChange({ ...draft, bio: e.target.value })} />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      {children}
    </label>
  );
}
