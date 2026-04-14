-- 门户模块单租户闭环修复（PostgreSQL）
-- 目标：门户相关表统一以 tenant_id=000000（数值 0）存储，避免租户插件过滤异常

-- 1) 为缺失 tenant_id 的表补齐字段
ALTER TABLE IF EXISTS portal_home_content
    ADD COLUMN IF NOT EXISTS tenant_id bigint;

ALTER TABLE IF EXISTS portal_user_mapping
    ADD COLUMN IF NOT EXISTS tenant_id bigint;

-- 2) 将历史数据回填到默认租户（000000 -> 0）
UPDATE portal_home_content
SET tenant_id = 0
WHERE tenant_id IS NULL;

UPDATE portal_user_mapping
SET tenant_id = 0
WHERE tenant_id IS NULL;

UPDATE portal_case
SET tenant_id = 0
WHERE tenant_id IS NULL;

-- 3) 收敛为单租户默认值
ALTER TABLE IF EXISTS portal_home_content
    ALTER COLUMN tenant_id SET DEFAULT 0;

ALTER TABLE IF EXISTS portal_home_content
    ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE IF EXISTS portal_user_mapping
    ALTER COLUMN tenant_id SET DEFAULT 0;

ALTER TABLE IF EXISTS portal_user_mapping
    ALTER COLUMN tenant_id SET NOT NULL;
