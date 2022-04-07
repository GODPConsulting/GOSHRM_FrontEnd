export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  // status: any;
  token: string;
}

export interface RegisterRequestDTO {
  full_Name: string,
  email_Address: string,
  password: string,
  companyId: string;
}

export interface RegisterResponseDTO {
  token: string;
}

export interface ForgotPassswordDTO {
  email_Address: string
}

export interface ResetPasswordDTO {
  old_Password: string,
  new_Password: string,
  confirm_Password: string,
}
