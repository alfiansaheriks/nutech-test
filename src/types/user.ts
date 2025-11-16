export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserUpdatePayload {
  first_name: string;
  last_name: string;
}

export interface UserUpdateImagePayload {
  profile_image: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface ProfileResponse {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}
