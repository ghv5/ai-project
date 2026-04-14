import { request } from '@/service/request';

/** 创建第三方平台 ticket */
export function fetchCreatePortalTicket(platform: Api.Portal.PlatformCode) {
  return request<Api.Portal.TicketResponse>({
    url: '/portal/sso/ticket',
    method: 'post',
    data: { platform }
  });
}

/** 统一登出 */
export function fetchPortalLogout() {
  return request<Api.Portal.LogoutResponse>({
    url: '/portal/sso/logout',
    method: 'post'
  });
}
