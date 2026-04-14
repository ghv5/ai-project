import { request } from '@/service/request';

/** 获取用户第三方账号映射 */
export function fetchGetPortalUserMapping(userId: CommonType.IdType) {
  return request<Api.Portal.UserMapping>({
    url: `/portal/user-mapping/${userId}`,
    method: 'get'
  });
}

/** 更新用户第三方账号映射 */
export function fetchUpdatePortalUserMapping(userId: CommonType.IdType, data: Api.Portal.UserMapping) {
  return request<boolean>({
    url: `/portal/user-mapping/${userId}`,
    method: 'put',
    data
  });
}
