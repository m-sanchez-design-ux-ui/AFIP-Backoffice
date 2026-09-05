export interface IResetPasswordRequest {
  token: string;
  userName: string;
  password: string;
  passwordRepeat: string;
  gRecaptchaResponse: string;
}
