import { request } from '@/service/request';

/** 获取门户首页内容 */
export function fetchGetPortalHomeContent() {
  return request<Api.Portal.HomeContent>({
    url: '/portal/home',
    method: 'get'
  });
}

/** 更新门户首页内容 */
export function fetchUpdatePortalHomeContent(data: Api.Portal.HomeContent) {
  return request<boolean>({
    url: '/portal/home',
    method: 'put',
    data
  });
}
