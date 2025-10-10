import { ChangePasswordProps, ChangePasswordResult } from '@pages/user/account/ChangePassword';
import { LoginFormProps, LoginResult } from '@pages/user/account/Login';
import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';

// Login
export function postLogin(params: LoginFormProps) {
    return CustomAxios.post<Answer<LoginResult>>('/api/account/login', params);
}

export function putChangePassword(params: ChangePasswordProps) {
    return CustomAxios.put<Answer<ChangePasswordResult>>('/api/account/change-password', params);
}