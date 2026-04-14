<script setup lang="ts">
import { ref } from 'vue';
import { fetchGetPortalHomeContent, fetchUpdatePortalHomeContent } from '@/service/api/portal';

defineOptions({
  name: 'PortalHomeConfig'
});

const loading = ref(false);
const saving = ref(false);

const model = ref<Api.Portal.HomeContent>({
  heroTitle: '',
  heroSubtitle: '',
  stats: [],
  flowSteps: [],
  services: [],
  news: []
});

const form = ref({
  heroTitle: '',
  heroSubtitle: '',
  statsJson: '[]',
  flowStepsJson: '[]',
  servicesJson: '[]',
  newsJson: '[]'
});

function toPrettyJson(value: unknown) {
  return JSON.stringify(value ?? [], null, 2);
}

async function getData() {
  loading.value = true;
  const { data, error } = await fetchGetPortalHomeContent();
  loading.value = false;
  if (error || !data) return;

  model.value = data;
  form.value.heroTitle = data.heroTitle || '';
  form.value.heroSubtitle = data.heroSubtitle || '';
  form.value.statsJson = toPrettyJson(data.stats);
  form.value.flowStepsJson = toPrettyJson(data.flowSteps);
  form.value.servicesJson = toPrettyJson(data.services);
  form.value.newsJson = toPrettyJson(data.news);
}

function parseJsonField<T>(label: string, raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${label} 不是合法 JSON`);
  }
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStats(stats: unknown): Api.Portal.StatItem[] {
  if (!Array.isArray(stats)) {
    throw new Error('统计数据必须是数组');
  }
  stats.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`统计数据第 ${index + 1} 项必须是对象`);
    }
    if (!isNonEmptyString((item as Api.Portal.StatItem).label)) {
      throw new Error(`统计数据第 ${index + 1} 项缺少 label`);
    }
    if (!isNonEmptyString((item as Api.Portal.StatItem).value)) {
      throw new Error(`统计数据第 ${index + 1} 项缺少 value`);
    }
  });
  return stats as Api.Portal.StatItem[];
}

function validateFlowSteps(flowSteps: unknown): string[] {
  if (!Array.isArray(flowSteps)) {
    throw new Error('流程步骤必须是数组');
  }
  flowSteps.forEach((step, index) => {
    if (!isNonEmptyString(step)) {
      throw new Error(`流程步骤第 ${index + 1} 项必须是非空字符串`);
    }
  });
  return flowSteps as string[];
}

function validateServices(services: unknown): Api.Portal.ServiceCenterItem[] {
  if (!Array.isArray(services)) {
    throw new Error('服务矩阵必须是数组');
  }
  services.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`服务矩阵第 ${index + 1} 项必须是对象`);
    }
    const service = item as Api.Portal.ServiceCenterItem;
    if (!isNonEmptyString(service.category)) {
      throw new Error(`服务矩阵第 ${index + 1} 项缺少 category`);
    }
    if (!isNonEmptyString(service.title)) {
      throw new Error(`服务矩阵第 ${index + 1} 项缺少 title`);
    }
    if (!isNonEmptyString(service.description)) {
      throw new Error(`服务矩阵第 ${index + 1} 项缺少 description`);
    }
    if (!Array.isArray(service.partnerNames)) {
      throw new Error(`服务矩阵第 ${index + 1} 项 partnerNames 必须是数组`);
    }
    service.partnerNames.forEach((name, partnerIndex) => {
      if (!isNonEmptyString(name)) {
        throw new Error(`服务矩阵第 ${index + 1} 项 partnerNames 第 ${partnerIndex + 1} 项必须是非空字符串`);
      }
    });
  });
  return services as Api.Portal.ServiceCenterItem[];
}

function validateNews(news: unknown): Api.Portal.NewsItem[] {
  if (!Array.isArray(news)) {
    throw new Error('新闻动态必须是数组');
  }
  news.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`新闻动态第 ${index + 1} 项必须是对象`);
    }
    const newsItem = item as Api.Portal.NewsItem;
    if (typeof newsItem.id !== 'number' || Number.isNaN(newsItem.id)) {
      throw new Error(`新闻动态第 ${index + 1} 项缺少有效 id`);
    }
    if (!isNonEmptyString(newsItem.title)) {
      throw new Error(`新闻动态第 ${index + 1} 项缺少 title`);
    }
    if (!isNonEmptyString(newsItem.summary)) {
      throw new Error(`新闻动态第 ${index + 1} 项缺少 summary`);
    }
    if (newsItem.publishDate != null && !isNonEmptyString(newsItem.publishDate)) {
      throw new Error(`新闻动态第 ${index + 1} 项 publishDate 格式不正确`);
    }
    if (newsItem.highlight !== undefined && typeof newsItem.highlight !== 'boolean') {
      throw new Error(`新闻动态第 ${index + 1} 项 highlight 必须是布尔值`);
    }
  });
  return news as Api.Portal.NewsItem[];
}

async function handleSave() {
  try {
    const payload: Api.Portal.HomeContent = {
      heroTitle: form.value.heroTitle.trim(),
      heroSubtitle: form.value.heroSubtitle.trim(),
      stats: validateStats(parseJsonField<unknown>('统计数据', form.value.statsJson)),
      flowSteps: validateFlowSteps(parseJsonField<unknown>('流程步骤', form.value.flowStepsJson)),
      services: validateServices(parseJsonField<unknown>('服务矩阵', form.value.servicesJson)),
      news: validateNews(parseJsonField<unknown>('新闻动态', form.value.newsJson))
    };

    if (!payload.heroTitle) {
      throw new Error('主标题不能为空');
    }
    if (!payload.heroSubtitle) {
      throw new Error('副标题不能为空');
    }

    saving.value = true;
    const { error } = await fetchUpdatePortalHomeContent(payload);
    saving.value = false;
    if (error) return;

    window.$message?.success('首页配置保存成功');
    await getData();
  } catch (e: any) {
    window.$message?.error(e?.message || '保存失败');
  }
}

getData();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="首页配置" :bordered="false" size="small" class="card-wrapper" :loading="loading">
      <NAlert type="info" class="mb-16px" :show-icon="false">
        为了兼顾灵活性与上线速度，此页面使用 JSON 字段编辑复杂区块（统计、流程、服务、新闻）。
      </NAlert>
      <NForm label-placement="left" :label-width="110">
        <NFormItem label="主标题">
          <NInput v-model:value="form.heroTitle" placeholder="请输入首页主标题" />
        </NFormItem>
        <NFormItem label="副标题">
          <NInput v-model:value="form.heroSubtitle" placeholder="请输入首页副标题" />
        </NFormItem>
        <NFormItem label="统计数据 JSON">
          <NInput
            v-model:value="form.statsJson"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10 }"
            placeholder='例如: [{"label":"合作客户","value":"200+"}]'
          />
        </NFormItem>
        <NFormItem label="流程步骤 JSON">
          <NInput
            v-model:value="form.flowStepsJson"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10 }"
            placeholder='例如: ["数据采集", "数据清洗", "模型训练"]'
          />
        </NFormItem>
        <NFormItem label="服务矩阵 JSON">
          <NInput
            v-model:value="form.servicesJson"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12 }"
            placeholder='例如: [{"category":"仿真","title":"场景仿真","description":"...","partnerNames":["A","B"]}]'
          />
        </NFormItem>
        <NFormItem label="新闻动态 JSON">
          <NInput
            v-model:value="form.newsJson"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12 }"
            placeholder='例如: [{"id":1,"title":"...","summary":"...","publishDate":"2026-04-14"}]'
          />
        </NFormItem>
      </NForm>
      <div class="mt-16px flex justify-end">
        <NButton type="primary" :loading="saving" @click="handleSave">保存</NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
