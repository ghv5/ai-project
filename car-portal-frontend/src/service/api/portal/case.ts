import { request } from '@/service/request';

/** 获取门户公开案例列表 */
export function fetchGetPortalCaseList(keyword?: string) {
  return request<Api.Portal.CaseItem[]>({
    url: '/portal/cases',
    method: 'get',
    params: { keyword }
  });
}

/** 获取后台案例列表 */
export function fetchGetPortalAdminCaseList(params?: Api.Portal.CaseSearchParams) {
  const keyword = params?.keyword?.trim();
  const queryParams = {
    keyword: keyword || undefined,
    published: params?.published || undefined
  };

  return request<Api.Portal.CaseItem[]>({
    url: '/portal/cases/admin/list',
    method: 'get',
    params: queryParams
  });
}

/** 创建案例 */
export function fetchCreatePortalCase(data: Api.Portal.CaseItem) {
  return request<number>({
    url: '/portal/cases',
    method: 'post',
    data
  });
}

/** 更新案例 */
export function fetchUpdatePortalCase(data: Api.Portal.CaseItem) {
  return request<boolean>({
    url: '/portal/cases',
    method: 'put',
    data
  });
}

/** 删除案例 */
export function fetchDeletePortalCase(caseId: CommonType.IdType) {
  return request<boolean>({
    url: `/portal/cases/${caseId}`,
    method: 'delete'
  });
}
