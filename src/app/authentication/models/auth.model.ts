export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
}

export interface RegisterRequestDTO {
  firstName: string,
  middleName: string,
  lastName: string,
  phoneNumber1: string,
  phoneNumber2: string,
  email: string,
  altEmail: string,
  organizationName: string,
  password: string,
  confirmPassword: string,
}

export interface ForgotPassswordDTO {
  email: string
}

export interface ResetPasswordDTO {
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
}
