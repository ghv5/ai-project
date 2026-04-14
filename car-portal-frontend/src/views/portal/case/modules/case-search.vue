<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'CaseSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, restoreValidation } = useNaiveForm();

const model = defineModel<Api.Portal.CaseSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

const publishedOptions = [
  { label: '全部', value: '' },
  { label: '已发布', value: 'true' },
  { label: '未发布', value: 'false' }
];

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  await restoreValidation();
  resetModel();
  emit('search');
}

function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="portal-case-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8" label="关键词" label-width="auto" path="keyword" class="pr-24px">
              <NInput v-model:value="model.keyword" placeholder="请输入标题/描述/标签" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="发布状态" label-width="auto" path="published" class="pr-24px">
              <NSelect v-model:value="model.published" :options="publishedOptions" placeholder="全部" clearable />
            </NFormItemGi>
            <NFormItemGi :show-feedback="false" span="24 s:24 m:10" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
