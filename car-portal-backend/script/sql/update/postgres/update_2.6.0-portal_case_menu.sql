DO $$
DECLARE
  v_portal_menu_id BIGINT;
  v_case_menu_id BIGINT;
  v_home_menu_id BIGINT;
  v_mapping_menu_id BIGINT;
  v_next_menu_id BIGINT;
BEGIN
  SELECT COALESCE(MAX(menu_id), 1000) + 1 INTO v_next_menu_id FROM sys_menu;

  SELECT menu_id
  INTO v_portal_menu_id
  FROM sys_menu
  WHERE menu_type = 'M' AND path = 'portal'
  LIMIT 1;

  IF v_portal_menu_id IS NULL THEN
    v_portal_menu_id := v_next_menu_id;
    v_next_menu_id := v_next_menu_id + 1;

    INSERT INTO sys_menu (
      menu_id, menu_name, parent_id, order_num, path, component, query_param,
      is_frame, is_cache, menu_type, visible, status, perms, icon,
      create_dept, create_by, create_time, update_by, update_time, remark
    ) VALUES (
      v_portal_menu_id, '门户管理', 1, 90, 'portal', 'Layout', NULL,
      '1', '0', 'M', '0', '0', NULL, 'monitor',
      103, 1, NOW(), NULL, NULL, '门户管理目录'
    );
  END IF;

  SELECT menu_id
  INTO v_case_menu_id
  FROM sys_menu
  WHERE menu_type = 'C' AND component = 'portal/case/index'
  LIMIT 1;

  IF v_case_menu_id IS NULL THEN
    v_case_menu_id := v_next_menu_id;
    v_next_menu_id := v_next_menu_id + 1;

    INSERT INTO sys_menu (
      menu_id, menu_name, parent_id, order_num, path, component, query_param,
      is_frame, is_cache, menu_type, visible, status, perms, icon,
      create_dept, create_by, create_time, update_by, update_time, remark
    ) VALUES (
      v_case_menu_id, '案例库管理', v_portal_menu_id, 1, 'case', 'portal/case/index', NULL,
      '1', '0', 'C', '0', '0', 'portal:case:list', 'picture-in-picture',
      103, 1, NOW(), NULL, NULL, '/portal/case'
    );
  END IF;

  SELECT menu_id
  INTO v_home_menu_id
  FROM sys_menu
  WHERE menu_type = 'C' AND component = 'portal/home/index'
  LIMIT 1;

  IF v_home_menu_id IS NULL THEN
    v_home_menu_id := v_next_menu_id;
    v_next_menu_id := v_next_menu_id + 1;

    INSERT INTO sys_menu (
      menu_id, menu_name, parent_id, order_num, path, component, query_param,
      is_frame, is_cache, menu_type, visible, status, perms, icon,
      create_dept, create_by, create_time, update_by, update_time, remark
    ) VALUES (
      v_home_menu_id, '门户首页配置', v_portal_menu_id, 2, 'home', 'portal/home/index', NULL,
      '1', '0', 'C', '0', '0', 'portal:home:edit', 'dashboard',
      103, 1, NOW(), NULL, NULL, '/portal/home'
    );
  END IF;

  SELECT menu_id
  INTO v_mapping_menu_id
  FROM sys_menu
  WHERE menu_type = 'C' AND component = 'portal/mapping/index'
  LIMIT 1;

  IF v_mapping_menu_id IS NULL THEN
    v_mapping_menu_id := v_next_menu_id;
    v_next_menu_id := v_next_menu_id + 1;

    INSERT INTO sys_menu (
      menu_id, menu_name, parent_id, order_num, path, component, query_param,
      is_frame, is_cache, menu_type, visible, status, perms, icon,
      create_dept, create_by, create_time, update_by, update_time, remark
    ) VALUES (
      v_mapping_menu_id, '门户账号映射', v_portal_menu_id, 3, 'mapping', 'portal/mapping/index', NULL,
      '1', '0', 'C', '0', '0', 'portal:mapping:query', 'user-switch',
      103, 1, NOW(), NULL, NULL, '/portal/mapping'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_case_menu_id AND perms = 'portal:case:list'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '案例查询', v_case_menu_id, 1, '#', '', '', '1', '0', 'F', '0', '0', 'portal:case:list', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_case_menu_id AND perms = 'portal:case:add'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '案例新增', v_case_menu_id, 2, '#', '', '', '1', '0', 'F', '0', '0', 'portal:case:add', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_case_menu_id AND perms = 'portal:case:edit'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '案例修改', v_case_menu_id, 3, '#', '', '', '1', '0', 'F', '0', '0', 'portal:case:edit', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_case_menu_id AND perms = 'portal:case:remove'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '案例删除', v_case_menu_id, 4, '#', '', '', '1', '0', 'F', '0', '0', 'portal:case:remove', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_home_menu_id AND perms = 'portal:home:edit'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '首页配置修改', v_home_menu_id, 1, '#', '', '', '1', '0', 'F', '0', '0', 'portal:home:edit', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_mapping_menu_id AND perms = 'portal:mapping:query'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '映射查询', v_mapping_menu_id, 1, '#', '', '', '1', '0', 'F', '0', '0', 'portal:mapping:query', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM sys_menu WHERE menu_type = 'F' AND parent_id = v_mapping_menu_id AND perms = 'portal:mapping:edit'
  ) THEN
    INSERT INTO sys_menu VALUES (v_next_menu_id, '映射修改', v_mapping_menu_id, 2, '#', '', '', '1', '0', 'F', '0', '0', 'portal:mapping:edit', '#', 103, 1, NOW(), NULL, NULL, '');
    v_next_menu_id := v_next_menu_id + 1;
  END IF;

  INSERT INTO sys_role_menu (role_id, menu_id)
  SELECT 1, m.menu_id
  FROM sys_menu m
  WHERE m.menu_id IN (
    v_portal_menu_id,
    v_case_menu_id,
    v_home_menu_id,
    v_mapping_menu_id
  )
     OR (m.parent_id IN (v_case_menu_id, v_home_menu_id, v_mapping_menu_id) AND m.menu_type = 'F')
  ON CONFLICT DO NOTHING;
END $$;
