import { apiClient } from "./base";

export interface Profile {
  id?: number;

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

export const profileService = {

  getProfile: () =>
    apiClient.get<Profile>("/profile/1"),

  createProfile: (body: Profile) =>
    apiClient.post<Profile>("/profile", body),

  updateProfile: (body: Profile) =>
    apiClient.put<Profile>("/profile/1", body),

};