import { ApiResponse, BaseResponse } from '@/types/apiResponse';
import { User } from '@/types/user';
import request from '../request';

export interface UpdateUserMeParams {
  email: string;
  username: string;
}

export interface UpdatePasswordMeParams {
  currentPassword: string;
  newPassword: string;
}

export function updateUserMe(
  data: UpdateUserMeParams
): Promise<ApiResponse<User>> {
  return request({
    url: '/api/v1/user/me',
    method: 'PUT',
    data,
  });
}

export function updatePasswordMe(
  data: UpdatePasswordMeParams
): Promise<BaseResponse> {
  return request({
    url: '/api/v1/user/me/password',
    method: 'PUT',
    data,
  });
}
