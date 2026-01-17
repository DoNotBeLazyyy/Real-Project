export interface LoginReqDto {
    // Username
    username: string;

    // Password
    password: string;
}

export interface ChangePasswordReqDto {
    // Username
    username: string;

    // Password
    newPassword: string;
}