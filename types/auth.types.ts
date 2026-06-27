export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    email: string;
  };
  error: string | null;
}