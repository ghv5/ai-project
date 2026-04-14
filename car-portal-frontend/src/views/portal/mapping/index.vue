<script setup lang="ts">
import { ref } from 'vue';
import { fetchGetPortalUserMapping, fetchUpdatePortalUserMapping } from '@/service/api/portal';

defineOptions({
  name: 'PortalUserMappingList'
});

const loading = ref(false);
const saving = ref(false);

const queryUserId = ref<number | null>(null);

const form = ref<Api.Portal.UserMapping>({
  userId: undefined,
  annotateAccount: '',
  simulateAccount: ''
});

async function handleQuery() {
  if (!queryUserId.value) {
    window.$message?.warning('请输入用户ID');
    return;
  }

  loading.value = true;
  const { data, error } = await fetchGetPortalUserMapping(queryUserId.value);
  loading.value = false;

  if (error || !data) {
    form.value = {
      userId: queryUserId.value,
      annotateAccount: '',
      simulateAccount: ''
    };
    window.$message?.warning('未查询到映射，已进入新建模式，可直接填写并保存');
    return;
  }

  form.value = {
    userId: data.userId,
    annotateAccount: data.annotateAccount || '',
    simulateAccount: data.simulateAccount || ''
  };
}

async function handleSave() {
  if (!form.value.userId) {
    window.$message?.warning('请先查询用户映射');
    return;
  }

  saving.value = true;
  const { error } = await fetchUpdatePortalUserMapping(form.value.userId, form.value);
  saving.value = false;
  if (error) return;

  window.$message?.success('用户映射保存成功');
  await handleQuery();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="用户映射管理" :bordered="false" size="small" class="card-wrapper" :loading="loading">
      <NForm label-placement="left" :label-width="120">
        <NGrid :cols="24" :x-gap="16">
          <NFormItemGi :span="8" label="用户ID">
            <NInputNumber v-model:value="queryUserId" :min="1" class="w-full" placeholder="请输入用户ID" />
          </NFormItemGi>
          <NFormItemGi :span="16" :show-feedback="false">
            <NSpace>
              <NButton type="primary" @click="handleQuery">查询映射</NButton>
            </NSpace>
          </NFormItemGi>
        </NGrid>

        <NDivider />

        <NFormItem label="标注系统账号">
          <NInput v-model:value="form.annotateAccount" placeholder="请输入标注系统账号" />
        </NFormItem>
        <NFormItem label="仿真系统账号">
          <NInput v-model:value="form.simulateAccount" placeholder="请输入仿真系统账号" />
        </NFormItem>
      </NForm>

      <div class="mt-16px flex justify-end">
        <NButton type="primary" :loading="saving" @click="handleSave">保存</NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
