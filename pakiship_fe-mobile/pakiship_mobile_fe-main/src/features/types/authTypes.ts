export type SignupRequest = {
  role: string;
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  street: string;
  city: string;
  province: string;
  password: string;
  documents?: string[];
};

export type LoginRequest = {
  emailOrMobile: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};
