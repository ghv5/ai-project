<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { fetchCreatePortalCase, fetchUpdatePortalCase } from '@/service/api/portal';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'CaseOperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.Portal.CaseItem | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增案例',
    edit: '编辑案例'
  };
  return titles[props.operateType];
});

type Model = Api.Portal.CaseItem;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    caseId: undefined,
    title: '',
    description: '',
    coverUrl: '',
    videoUrl: '',
    tags: '',
    industry: '',
    scenario: '',
    sortOrder: 999,
    pinned: false,
    published: true
  };
}

type RuleKey = Extract<keyof Model, 'title' | 'description' | 'videoUrl'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  title: createRequiredRule('案例标题不能为空'),
  description: createRequiredRule('案例描述不能为空'),
  videoUrl: createRequiredRule('视频地址不能为空')
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (props.operateType === 'add') {
    const { error } = await fetchCreatePortalCase(model.value);
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdatePortalCase(model.value);
    if (error) return;
    window.$message?.success($t('common.updateSuccess'));
  }

  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="860" class="max-w-96%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="96">
        <NGrid :cols="24" :x-gap="16">
          <NFormItemGi :span="12" label="案例标题" path="title">
            <NInput v-model:value="model.title" maxlength="120" show-count placeholder="请输入案例标题" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="标签" path="tags">
            <NInput v-model:value="model.tags" maxlength="120" placeholder="例如：自动驾驶, 仿真" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="行业" path="industry">
            <NInput v-model:value="model.industry" maxlength="60" placeholder="例如：汽车" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="场景" path="scenario">
            <NInput v-model:value="model.scenario" maxlength="60" placeholder="例如：智能网联" />
          </NFormItemGi>
          <NFormItemGi :span="24" label="案例描述" path="description">
            <NInput
              v-model:value="model.description"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              placeholder="请输入案例描述"
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="视频地址" path="videoUrl">
            <NInput
              v-model:value="model.videoUrl"
              placeholder="请输入 http 视频地址，例如：http://127.0.0.1:8080/portal/media/video1.mp4"
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="封面地址" path="coverUrl">
            <NInput v-model:value="model.coverUrl" placeholder="可选，留空将由前端按默认样式展示" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="排序" path="sortOrder">
            <NInputNumber v-model:value="model.sortOrder" :min="0" :max="9999" class="w-full" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="是否发布" path="published">
            <NSwitch v-model:value="model.published" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="是否置顶" path="pinned">
            <NSwitch v-model:value="model.pinned" />
          </NFormItemGi>
        </NGrid>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
