export interface PasswordChangeRequest {
  token: string;
  username: string;
  password: string;
  passwordRepeat: string;
}
