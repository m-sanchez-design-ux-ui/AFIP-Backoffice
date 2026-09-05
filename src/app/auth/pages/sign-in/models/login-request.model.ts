export interface LoginRequest {
  username: string;
  password: string;
  gRecaptchaResponse: string | null;
}
