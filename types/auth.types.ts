export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    email: string;
    token: string;

  };
  error: string | null;
}