<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider, NTag } from 'naive-ui';
import {
  fetchDeletePortalCase,
  fetchGetPortalAdminCaseList
} from '@/service/api/portal';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useNaiveTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import CaseOperateDrawer from './modules/case-operate-drawer.vue';
import CaseSearch from './modules/case-search.vue';

defineOptions({
  name: 'PortalCaseList'
});

const appStore = useAppStore();
const { hasAuth } = useAuth();

const searchParams = ref<Api.Portal.CaseSearchParams>({
  keyword: null,
  published: ''
});

const { columns, columnChecks, data, getData, loading, scrollX } = useNaiveTable({
  api: () => fetchGetPortalAdminCaseList(searchParams.value),
  transform: response => {
    if (response.error) return [];
    return response.data || [];
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => index + 1
    },
    {
      key: 'title',
      title: '案例标题',
      align: 'center',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'tags',
      title: '标签',
      align: 'center',
      minWidth: 140,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'sortOrder',
      title: '排序',
      align: 'center',
      width: 90
    },
    {
      key: 'published',
      title: '发布状态',
      align: 'center',
      width: 100,
      render: row => {
        return <NTag type={row.published ? 'success' : 'warning'}>{row.published ? '已发布' : '未发布'}</NTag>;
      }
    },
    {
      key: 'pinned',
      title: '置顶',
      align: 'center',
      width: 80,
      render: row => {
        return <NTag type={row.pinned ? 'info' : 'default'}>{row.pinned ? '是' : '否'}</NTag>;
      }
    },
    {
      key: 'updateTime',
      title: '更新时间',
      align: 'center',
      minWidth: 170
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const divider = () => {
          if (!hasAuth('portal:case:edit') || !hasAuth('portal:case:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('portal:case:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.caseId!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('portal:case:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.caseId!)}
            />
          );
        };

        return (
          <div class="flex-center gap-8px">
            {editBtn()}
            {divider()}
            {deleteBtn()}
          </div>
        );
      }
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'caseId', getData);

async function handleBatchDelete() {
  for (const id of checkedRowKeys.value) {
    const { error } = await fetchDeletePortalCase(id);
    if (error) return;
  }
  onBatchDeleted();
}

async function handleDelete(caseId: CommonType.IdType) {
  const { error } = await fetchDeletePortalCase(caseId);
  if (error) return;
  onDeleted();
}

function edit(caseId: CommonType.IdType) {
  handleEdit(caseId);
}

function handleSearch() {
  checkedRowKeys.value = [];
  getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <CaseSearch v-model:model="searchParams" @search="handleSearch" />
    <NCard title="案例库管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('portal:case:add')"
          :show-delete="hasAuth('portal:case:remove')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        :row-key="row => row.caseId"
        class="sm:h-full"
      />
      <CaseOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
