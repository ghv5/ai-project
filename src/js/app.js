const App = {
    currentPage: '',

    init() {
        Router.init();
        this.registerRoutes();
    },

    registerRoutes() {
        Router.register('/data-sources', () => this.renderDataSources());
        Router.register('/warehouses/:id', (params) => this.renderWarehouseDetail(params.id));
        Router.register('/warehouses', () => this.renderWarehouseList());
        Router.register('/phases', () => this.renderPhaseTemplateList());
        Router.register('/rules', () => this.renderPhaseRuleList());
        Router.register('/departments', () => this.renderDepartmentList());
        Router.register('/departments/:id/config', (params) => this.renderDepartmentConfig(params.id));
        Router.register('/evaluations/new', (_params, query) => this.renderCreateEvaluation(query));
        Router.register('/evaluations/:id', (params) => this.renderEvaluationDetail(params.id));
        Router.register('/evaluations', () => this.renderEvaluationList());
        Router.register('/reports/generate', () => this.renderGenerateReport());
        Router.register('/reports/:id', (params) => this.renderReportDetail(params.id));
        Router.register('/reports', () => this.renderReportList());
        Router.register('/dashboard', () => this.renderDashboard());
        Router.register('/', () => this.renderWarehouseList());
    },

    renderWithLayout(content, activeMenu) {
        this.currentPage = activeMenu;
        document.getElementById('app').innerHTML = `
            <div class="app-layout">
                <div class="sidebar">
                    <div class="sidebar-logo">数据仓库评估</div>
                    <div class="sidebar-menu">
                        <div class="menu-item ${activeMenu === 'data-engineering' ? 'active' : ''}" onclick="Router.navigate('/warehouses')">
                            <i class="menu-item-icon fa-solid fa-warehouse" aria-hidden="true"></i>
                            <span>数据工程</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'dept-list' ? 'active' : ''}" onclick="Router.navigate('/departments')">
                            <i class="menu-item-icon fa-solid fa-building-columns" aria-hidden="true"></i>
                            <span>部门列表</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'phase-list' ? 'active' : ''}" onclick="Router.navigate('/phases')">
                            <i class="menu-item-icon fa-solid fa-layer-group" aria-hidden="true"></i>
                            <span>阶段列表</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'rule-list' ? 'active' : ''}" onclick="Router.navigate('/rules')">
                            <i class="menu-item-icon fa-solid fa-scale-balanced" aria-hidden="true"></i>
                            <span>规则列表</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'eval-list' ? 'active' : ''}" onclick="Router.navigate('/evaluations')">
                            <i class="menu-item-icon fa-solid fa-clipboard-check" aria-hidden="true"></i>
                            <span>评估列表</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'dashboard' ? 'active' : ''}" onclick="Router.navigate('/dashboard')">
                            <i class="menu-item-icon fa-solid fa-chart-line" aria-hidden="true"></i>
                            <span>综合大屏</span>
                        </div>
                        <div class="menu-item ${activeMenu === 'warehouse-list' ? 'active' : ''}" onclick="Router.navigate('/data-sources')">
                            <i class="menu-item-icon fa-solid fa-database" aria-hidden="true"></i>
                            <span>数仓列表</span>
                        </div>
                    </div>
                </div>
                <div class="main-content">
                    ${content}
                </div>
            </div>
        `;
    },

    renderPageHero({ title, subtitle, image, tags = [] }) {
        return `
            <section class="page-hero" style="background-image: linear-gradient(102deg, rgba(15, 23, 42, 0.78), rgba(30, 64, 175, 0.52)), url('${image}');">
                <div class="page-hero-content">
                    <div class="page-hero-title">${title}</div>
                    <div class="page-hero-subtitle">${subtitle}</div>
                    <div class="page-hero-tags">
                        ${tags.map((tag) => `<span class="page-hero-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    renderDataSources() {
        const managedWarehouses = API.managedWarehouses || [];
        const departments = API.departments || [];
        const sourceTypes = API.sourceTypes || [];
        const keyword = this.dataSourceSearch.keyword.trim().toLowerCase();
        const status = this.dataSourceSearch.status;
        const filteredWarehouses = managedWarehouses.filter(item => {
            const matchesKeyword = !keyword
                || item.name.toLowerCase().includes(keyword)
                || item.sourceConfig.name.toLowerCase().includes(keyword)
                || (item.deptName || '').toLowerCase().includes(keyword);
            const matchesStatus = !status || item.onboardingStatus === status;
            return matchesKeyword && matchesStatus;
        });
        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '数仓列表',
                    subtitle: '统一管理建仓接入、连通测试与部门关联，支持一键创建并纳入评估。',
                    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
                    tags: ['接入测试', '逻辑建仓', '部门绑定'],
                })}
                <div class="page-header">
                    <h1 class="page-title">数仓列表</h1>
                    <button class="btn btn-primary" onclick="App.openCreateWarehousePanel()">
                        <i class="fa-solid fa-circle-plus" aria-hidden="true"></i>
                        <span>新建数仓</span>
                    </button>
                </div>

                <div class="filter-bar">
                    <div class="filter-item">
                        <label>搜索</label>
                        <input id="dataSourceKeyword" class="input" value="${this.dataSourceSearch.keyword}" placeholder="数仓名称 / 数据源名称 / 部门">
                    </div>
                    <div class="filter-item">
                        <label>接入状态</label>
                        <select id="dataSourceStatus">
                            <option value="">全部</option>
                            <option value="ready" ${this.dataSourceSearch.status === 'ready' ? 'selected' : ''}>可评估</option>
                            <option value="bind_pending" ${this.dataSourceSearch.status === 'bind_pending' ? 'selected' : ''}>待关联部门</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="App.applyDataSourceSearch()">查询</button>
                    <button class="btn btn-default" onclick="App.resetDataSourceSearch()">重置</button>
                </div>

                <div class="card">
                    <div class="data-source-panel-header">
                        <div>
                            <h2 class="section-title" style="margin-bottom: 8px;">数仓列表</h2>
                            <p class="data-source-subtitle">默认展示已创建数仓，建仓与部门关联通过右侧抽屉完成。</p>
                        </div>
                    </div>

                    <div class="rule-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>数仓名称</th>
                                    <th>连通状态</th>
                                    <th>接入状态</th>
                                    <th>所属部门</th>
                                    <th>数据源</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredWarehouses.length ? filteredWarehouses.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${API.getConnectivityBadge(item.connectivityStatus)}</td>
                                        <td>${API.getOnboardingBadge(item.onboardingStatus)}</td>
                                        <td>${item.deptName || '<span style="color:#94a3b8;">待关联</span>'}</td>
                                        <td>${item.sourceConfig.name}</td>
                                        <td>
                                            <div class="data-source-table-actions">
                                                <button class="btn btn-sm btn-default" onclick="Router.navigate('/warehouses/${item.id}')">查看详情</button>
                                                ${item.onboardingStatus === 'ready' ? `<button class="btn btn-sm btn-primary" onclick="App.startWarehouseEvaluation('${item.id}')">立即评估</button>` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="6" class="table-empty-cell">暂无匹配的数仓</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                ${this.dataSourcePanelMode ? `
                    <div class="data-source-drawer-backdrop" onclick="App.closeDataSourcePanel()"></div>
                    <div class="data-source-drawer">
                        <div class="data-source-drawer-header">
                            <div>
                                <h2 class="section-title" style="margin-bottom: 6px;">新建数仓</h2>
                                <p class="data-source-subtitle">
                                    通过数据源配置完成测试后创建逻辑数仓，并在同一流程中完成部门关联。
                                </p>
                            </div>
                            <button class="btn btn-default btn-sm" onclick="App.closeDataSourcePanel()">关闭</button>
                        </div>

                        ${this.renderCreateWarehousePanel(sourceTypes, departments)}
                    </div>
                ` : ''}
            </div>
        `, 'data-engineering');
    },

    renderDashboardWithLayout(content) {
        this.renderWithLayout(content, 'dashboard');
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    getStatusBadge(status) {
        const map = {
            completed: { class: 'status-success', text: '已完成' },
            in_progress: { class: 'status-info', text: '进行中' },
            failed: { class: 'status-error', text: '失败' },
        };
        const s = map[status] || { class: '', text: status };
        return `<span class="status-badge ${s.class}">${s.text}</span>`;
    },

    getGradeClass(grade) {
        return `grade-${grade?.toLowerCase() || ''}`;
    },

    getScoreColor(score) {
        const n = Number(score);
        if (Number.isNaN(n)) return '#8c8c8c';
        if (n >= 90) return '#52c41a';
        if (n >= 80) return '#1677ff';
        if (n >= 60) return '#faad14';
        return '#ff4d4f';
    },

    warehouseCityObserver: null,

    getGradeStyle(grade) {
        const map = {
            A: { color: '#52c41a', bg: 'rgba(82,196,26,0.14)' },
            B: { color: '#1677ff', bg: 'rgba(22,119,255,0.1)' },
            C: { color: '#faad14', bg: 'rgba(250,173,20,0.16)' },
            D: { color: '#ff4d4f', bg: 'rgba(255,77,79,0.14)' },
        };
        return map[grade] || { color: '#8c8c8c', bg: 'rgba(140,140,140,0.15)' };
    },

    expandWarehouseMocks(warehouses = []) {
        const suffixes = ['一期', '二期', '专题', '画像', '共享'];
        const expanded = [];
        warehouses.forEach((wh, idx) => {
            expanded.push({ ...wh });
            suffixes.forEach((suffix, sIdx) => {
                const isUnassessed = (idx + sIdx) % 4 === 0;
                const score = isUnassessed ? null : Math.max(60, Math.min(98, (wh.lastScore || 80) + (sIdx % 2 ? 2 : -3)));
                const grade = isUnassessed ? null : (score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 60 ? 'C' : 'D');
                expanded.push({
                    ...wh,
                    id: `${wh.id}_mock_${sIdx}`,
                    name: `${wh.name}${suffix}`,
                    lastScore: score,
                    grade,
                    dbCount: (wh.dbCount || 8) + sIdx + 1,
                    tableCount: (wh.tableCount || 120) + (sIdx + 1) * 18,
                });
            });
        });
        return expanded;
    },

    getProvinceDepartments() {
        const depts = (API.departments || []).map(item => ({ ...item, warehouses: [] }));
        const whByDept = new Map();
        API.getFlatWarehouses().forEach(wh => {
            const mappedDeptId = (API.departments || []).some(d => d.id === wh.deptId)
                ? wh.deptId
                : API.resolveDepartmentIdByName(wh.deptName);
            if (!mappedDeptId) return;
            if (!whByDept.has(mappedDeptId)) whByDept.set(mappedDeptId, []);
            whByDept.get(mappedDeptId).push({ ...wh });
        });
        depts.forEach(dep => {
            const list = whByDept.get(dep.id) || [];
            dep.warehouses = list.flatMap(item => item.sourceManaged ? [item] : this.expandWarehouseMocks([item]));
        });
        return depts;
    },

    renderWarehouseList() {
        const departments = this.getProvinceDepartments();
        this.provinceDepartments = departments;
        this.selectedDeptId = this.selectedDeptId && departments.some(d => d.id === this.selectedDeptId)
            ? this.selectedDeptId
            : departments[0]?.id;
        const activeDept = departments.find(d => d.id === this.selectedDeptId) || departments[0];
        const activePlan = activeDept ? API.getDepartmentPhasePlan(activeDept.id) : null;
        const templates = API.phaseTemplates || [];
        const planPhases = (activePlan?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const orderedStages = planPhases.map(item => {
            const tpl = templates.find(t => t.id === item.phaseId);
            return {
                phaseId: item.phaseId,
                name: tpl?.name || item.phaseId,
                description: tpl?.description || '-',
            };
        });
        const latestCompletedEval = (API.evaluations || [])
            .filter(e => e.status === 'completed' && e.departmentId === activeDept?.id)
            .slice()
            .sort((a, b) => new Date(b.endTime || b.startTime || 0).getTime() - new Date(a.endTime || a.startTime || 0).getTime())[0];
        const phaseScoreMap = new Map((latestCompletedEval?.phaseScores || []).map(item => [item.phaseId, item.score]));
        const columns = Math.max(3, Math.min(4, orderedStages.length || 3));
        const stageLayout = orderedStages.map((stage, idx) => {
            const row = Math.floor(idx / columns) + 1;
            const inRow = idx % columns;
            const col = (row % 2 === 1) ? (inRow + 1) : (columns - inRow);
            return { ...stage, idx, row, col };
        });
        const stageDirs = stageLayout.map((stage, idx) => {
            const next = stageLayout[idx + 1];
            if (!next) return null;
            if (next.row === stage.row) return next.col > stage.col ? 'right' : 'left';
            return 'down';
        });

        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '数据工程资产视图',
                    subtitle: '以部门为锚点管理数仓资产，并联动评估阶段与规则配置。',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
                    tags: ['部门管理', '阶段模板', '评估入口'],
                })}
                <div class="page-header">
                    <h1 class="page-title">数据工程</h1>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="btn btn-default" onclick="Router.navigate('/departments')">
                            <i class="fa-solid fa-sitemap" aria-hidden="true"></i>
                            <span>部门管理</span>
                        </button>
                        <button class="btn btn-default" onclick="Router.navigate('/phases')">
                            <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
                            <span>评估阶段</span>
                        </button>
                    </div>
                </div>
                <div class="warehouse-section">
                    <h2 class="section-title">部门</h2>
                    <div class="department-grid">
	                        ${departments.map(dep => {
	                            const assessedCount = dep.warehouses.filter(wh => wh.lastScore !== null && wh.lastScore !== undefined).length;
	                            const unassessedCount = dep.warehouses.length - assessedCount;
                                const plan = API.getDepartmentPhasePlan(dep.id);
                                const canEval = (plan?.phases || []).length > 0;
	                            return `
	                                <div class="department-tile ${dep.id === this.selectedDeptId ? 'active' : ''}" onclick="App.selectDepartment('${dep.id}')">
	                                    <div class="department-tile-name">${dep.name}</div>
	                                    <div class="department-tile-stats">
	                                        <div class="department-tile-stat is-assessed" title="已评估数仓">
	                                            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
	                                            <span>${assessedCount}</span>
	                                        </div>
	                                        <div class="department-tile-stat is-unassessed" title="未评估数仓">
	                                            <i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>
	                                            <span>${unassessedCount}</span>
	                                        </div>
	                                    </div>
                                        <div class="tile-hover-actions">
                                            <button class="btn btn-sm btn-primary" ${canEval ? `onclick="event.stopPropagation(); App.startDepartmentEvaluation('${dep.id}')"` : 'disabled'}>立即评估</button>
                                        </div>
	                                </div>
	                            `;
	                        }).join('')}
                    </div>
                </div>

                <div class="warehouse-section">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; margin-bottom: 12px;">
                        <h2 class="section-title" style="margin-bottom: 0;">阶段流程</h2>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <span class="status-badge ${latestCompletedEval ? 'status-info' : 'status-warning'}">
                                ${latestCompletedEval ? `最近评估：${this.formatDate(latestCompletedEval.endTime || latestCompletedEval.startTime)}` : '暂无已完成评估'}
                            </span>
                            ${activeDept ? `<button class="btn btn-sm btn-default" onclick="Router.navigate('/departments/${activeDept.id}/config')">配置该部门阶段</button>` : ''}
                        </div>
                    </div>
                    ${stageLayout.length ? `
                        <div class="phase-flow">
                            <div class="phase-flow-grid" style="--phase-cols:${columns};">
	                                ${stageLayout.map((stage, idx) => {
	                                    const dir = stageDirs[idx];
	                                    const score = phaseScoreMap.has(stage.phaseId) ? phaseScoreMap.get(stage.phaseId) : null;
	                                    const scoreText = (score === null || score === undefined) ? '-' : String(score);
	                                    const arrow = dir === 'right'
                                        ? `<div class="phase-card-arrow is-right"><i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></div>`
                                        : dir === 'left'
                                            ? `<div class="phase-card-arrow is-left"><i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i></div>`
                                            : dir === 'down'
                                                ? `<div class="phase-card-arrow is-down"><i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i></div>`
                                                : '';
	                                    return `
	                                        <div class="phase-card-wrap" style="grid-row:${stage.row}; grid-column:${stage.col};">
	                                            <div class="phase-card">
	                                                <div class="phase-card-top">
	                                                    <div class="phase-card-title">${stage.name}</div>
	                                                    <div class="phase-card-score">${scoreText}</div>
	                                                </div>
	                                                <div class="phase-card-desc">${stage.description}</div>
                                                    <div class="tile-hover-actions is-in-card">
                                                        <button class="btn btn-sm btn-primary" onclick="App.startPhaseEvaluation('${activeDept?.id || ''}', '${stage.phaseId}')">立即评估</button>
                                                    </div>
	                                            </div>
	                                            ${arrow}
	                                        </div>
	                                    `;
	                                }).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="card" style="padding: 18px 20px;">
                            <div style="color:#334155; line-height:1.7;">
                                当前部门尚未配置评估阶段，无法开始评估。
                                ${activeDept ? ` <button class="btn btn-sm btn-default" style="margin-left: 10px;" onclick="Router.navigate('/departments/${activeDept.id}/config')">去配置阶段</button>` : ''}
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `, 'data-engineering');
    },

    startWarehouseEvaluation(warehouseId) {
        const scopedList = (this.provinceDepartments || []).flatMap(dep => dep.warehouses || []);
        const wh = scopedList.find(item => item.id === warehouseId) || API.getFlatWarehouses().find(item => item.id === warehouseId);
        this.selectedWarehouseId = wh?.id || warehouseId;
        this.selectedWarehouseName = wh ? (wh.fullName || wh.name) : '未选择数仓';
        Router.navigate('/evaluations/new');
    },

    dataSourceForm: {
        name: '财政共享库',
        type: 'mysql',
        host: '10.10.8.12',
        port: '3306',
        database: 'finance_dw',
        username: 'finance_reader',
        password: '',
    },
    dataWarehouseForm: {
        name: '',
        owner: '',
        dbCount: '',
        tableCount: '',
    },
    dataSourceTestResult: null,
    dataSourceLastTestFingerprint: '',
    dataSourcePanelMode: '',
    pendingWarehouseDraft: null,
    dataSourceSearch: {
        keyword: '',
        status: '',
    },

    phasePanelMode: '',
    phaseEditingId: '',
    phaseDraft: { name: '', description: '', scoringMode: 'manual' },
    phaseFieldDrafts: [],

    departmentPanelMode: '',
    departmentEditingId: '',
    departmentDraft: { name: '', description: '', code: '', owner: '' },
    departmentPlanDraft: null,

    renderCreateWarehousePanel(sourceTypes, departments) {
        const sourceTypeOptions = sourceTypes.map(item => `
            <option value="${item.value}" ${this.dataSourceForm.type === item.value ? 'selected' : ''}>${item.label}</option>
        `).join('');
        return `
            <div class="data-source-panel-content">
                <div class="data-source-step">
                    <div class="data-source-step-title">步骤 1：配置数据源</div>
                    ${this.dataSourceTestResult ? `<div style="margin-bottom: 14px;"> <span class="status-badge ${this.dataSourceTestResult.success ? 'status-success' : 'status-error'}">${this.dataSourceTestResult.message}</span></div>` : ''}
                    <div class="data-source-form-grid">
                        <div class="form-group">
                            <label class="form-label required">数仓名称</label>
                            <input id="ds_name" class="input" value="${this.dataSourceForm.name}">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">数据源类型</label>
                            <select id="ds_type">${sourceTypeOptions}</select>
                        </div>
                        <div class="form-group">
                            <label class="form-label required">主机</label>
                            <input id="ds_host" class="input" value="${this.dataSourceForm.host}" placeholder="例如：10.10.8.12">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">端口</label>
                            <input id="ds_port" class="input" value="${this.dataSourceForm.port}" placeholder="例如：3306">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">数据库名</label>
                            <input id="ds_database" class="input" value="${this.dataSourceForm.database}" placeholder="例如：finance_dw">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">用户名</label>
                            <input id="ds_username" class="input" value="${this.dataSourceForm.username}" placeholder="例如：finance_reader">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">密码</label>
                            <input id="ds_password" type="password" class="input" value="${this.dataSourceForm.password}" placeholder="请输入密码">
                        </div>
                    </div>
                    <div class="data-source-action-row">
                        <button class="btn btn-default" onclick="App.resetDataSourceForm()">重置</button>
                        <button class="btn btn-primary" onclick="App.testDataSourceConnectivity()">测试连通性</button>
                    </div>
                </div>

                <div class="data-source-divider"></div>

                <div class="data-source-step">
                    <div class="data-source-step-title">步骤 2：创建逻辑数仓</div>
                    <div class="data-source-form-grid">
                        <div class="form-group">
                            <label class="form-label required">数仓名称</label>
                            <input id="wh_name" class="input" value="${this.dataWarehouseForm.name}" placeholder="例如：省级财政共享数仓">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">负责人</label>
                            <input id="wh_owner" class="input" value="${this.dataWarehouseForm.owner}" placeholder="例如：张三">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">库数量</label>
                            <input id="wh_db_count" type="number" min="1" class="input" value="${this.dataWarehouseForm.dbCount}" placeholder="例如：8">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">表数量</label>
                            <input id="wh_table_count" type="number" min="1" class="input" value="${this.dataWarehouseForm.tableCount}" placeholder="例如：120">
                        </div>
                    </div>
                    <div class="data-source-action-row">
                        <button class="btn btn-primary" ${this.dataSourceTestResult?.success ? '' : 'disabled'} onclick="App.saveWarehouseDraft()">确认逻辑数仓信息</button>
                    </div>
                </div>

                <div class="data-source-divider"></div>

                <div class="data-source-step">
                    <div class="data-source-step-title">步骤 3：关联部门</div>
                    ${this.pendingWarehouseDraft ? `
                        <div class="data-source-bind-card">
                            <div><span>数仓名称</span><strong>${this.pendingWarehouseDraft.name}</strong></div>
                            <div><span>连通状态</span><strong>${this.pendingWarehouseDraft.connectivityStatus === 'connected' ? '连通正常' : '待测试'}</strong></div>
                            <div><span>数据源名称</span><strong>${this.pendingWarehouseDraft.sourceConfig.name}</strong></div>
                        </div>
                        <div class="form-group" style="margin-top: 16px;">
                            <label class="form-label required">所属部门</label>
                            <select id="bind_pending_department">
                                <option value="">选择部门</option>
                                ${departments.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="data-source-action-row">
                            <button class="btn btn-primary" onclick="App.finalizeCreateWarehouse()">完成并创建数仓</button>
                        </div>
                    ` : `
                        <div class="data-source-empty">请先完成前两步，确认逻辑数仓信息后再关联部门。</div>
                    `}
                </div>
            </div>
        `;
    },

    readDataSourceForm() {
        return {
            name: document.getElementById('ds_name')?.value.trim() || '',
            type: document.getElementById('ds_type')?.value || '',
            host: document.getElementById('ds_host')?.value.trim() || '',
            port: document.getElementById('ds_port')?.value.trim() || '',
            database: document.getElementById('ds_database')?.value.trim() || '',
            username: document.getElementById('ds_username')?.value.trim() || '',
            password: document.getElementById('ds_password')?.value || '',
        };
    },

    readWarehouseForm() {
        return {
            name: document.getElementById('wh_name')?.value.trim() || '',
            owner: document.getElementById('wh_owner')?.value.trim() || '',
            dbCount: document.getElementById('wh_db_count')?.value || '',
            tableCount: document.getElementById('wh_table_count')?.value || '',
        };
    },

    resetDataSourceForm() {
        this.dataSourceForm = {
            name: '',
            type: 'mysql',
            host: '',
            port: '',
            database: '',
            username: '',
            password: '',
        };
        this.dataWarehouseForm = {
            name: '',
            owner: '',
            dbCount: '',
            tableCount: '',
        };
        this.dataSourceTestResult = null;
        this.dataSourceLastTestFingerprint = '';
        this.pendingWarehouseDraft = null;
        this.renderDataSources();
    },

    getDataSourceFingerprint(form) {
        return [
            form.name,
            form.type,
            form.host,
            form.port,
            form.database,
            form.username,
            form.password,
        ].join('|');
    },

    openCreateWarehousePanel() {
        this.dataSourcePanelMode = 'create';
        this.renderDataSources();
    },

    closeDataSourcePanel() {
        this.dataSourcePanelMode = '';
        this.pendingWarehouseDraft = null;
        this.renderDataSources();
    },

    applyDataSourceSearch() {
        this.dataSourceSearch = {
            keyword: (document.getElementById('dataSourceKeyword')?.value || '').trim(),
            status: document.getElementById('dataSourceStatus')?.value || '',
        };
        this.renderDataSources();
    },

    resetDataSourceSearch() {
        this.dataSourceSearch = {
            keyword: '',
            status: '',
        };
        this.renderDataSources();
    },

    testDataSourceConnectivity() {
        this.dataSourceForm = this.readDataSourceForm();
        this.dataSourceTestResult = API.testDataSourceConnectivity(this.dataSourceForm);
        this.dataSourceLastTestFingerprint = this.dataSourceTestResult.success
            ? this.getDataSourceFingerprint(this.dataSourceForm)
            : '';
        this.renderDataSources();
    },

    saveWarehouseDraft() {
        this.dataSourceForm = this.readDataSourceForm();
        this.dataWarehouseForm = this.readWarehouseForm();
        if (!this.dataSourceTestResult?.success) {
            alert('请先完成连通性测试');
            return;
        }
        const currentFingerprint = this.getDataSourceFingerprint(this.dataSourceForm);
        if (currentFingerprint !== this.dataSourceLastTestFingerprint) {
            this.dataSourceTestResult = null;
            this.dataSourceLastTestFingerprint = '';
            alert('数据源配置已变更，请重新测试连通性');
            this.renderDataSources();
            return;
        }
        const missing = ['name', 'owner', 'dbCount', 'tableCount'].find(field => !String(this.dataWarehouseForm[field] || '').trim());
        if (missing) {
            alert('请完整填写逻辑数仓信息');
            return;
        }
        this.pendingWarehouseDraft = {
            ...this.dataWarehouseForm,
            connectivityStatus: 'connected',
            sourceConfig: { ...this.dataSourceForm },
        };
        this.dataSourceTestResult = {
            success: true,
            message: `逻辑数仓信息已确认：${this.pendingWarehouseDraft.name}，请继续关联部门`,
        };
        this.renderDataSources();
    },

    async finalizeCreateWarehouse() {
        const select = document.getElementById('bind_pending_department');
        const deptId = select?.value || '';
        if (!deptId) {
            alert('请选择所属部门');
            return;
        }
        if (!this.pendingWarehouseDraft) {
            alert('请先确认逻辑数仓信息');
            return;
        }
        const dept = (API.departments || []).find(item => item.id === deptId);
        if (!dept) {
            alert('所属部门不存在');
            return;
        }
        await API.createManagedWarehouse({
            ...this.pendingWarehouseDraft,
            deptId: dept.id,
            deptName: dept.name,
            onboardingStatus: 'ready',
        });
        this.dataSourcePanelMode = '';
        this.pendingWarehouseDraft = null;
        this.dataSourceLastTestFingerprint = '';
        this.dataWarehouseForm = {
            name: '',
            owner: '',
            dbCount: '',
            tableCount: '',
        };
        this.dataSourceTestResult = null;
        this.renderDataSources();
    },

    selectDepartment(deptId) {
        this.selectedDeptId = deptId;
        this.renderWarehouseList();
    },

    startDepartmentEvaluation(deptId) {
        Router.navigate(`/evaluations/new?target=department&deptId=${encodeURIComponent(deptId)}`);
    },

    startPhaseEvaluation(deptId, phaseId) {
        Router.navigate(`/evaluations/new?target=phase&deptId=${encodeURIComponent(deptId)}&phaseId=${encodeURIComponent(phaseId)}`);
    },

    async renderPhaseTemplateList() {
        const templates = await API.getPhaseTemplates();
        const fieldPreview = (tpl) => {
            const fields = tpl?.formSchema?.fields || [];
            const badges = fields.slice(0, 3).map(f => `<span class="status-badge" style="background: #e6f4ff; color:#1677ff;">${f.type}</span>`).join('');
            const more = fields.length > 3 ? `<span class="status-badge" style="background: rgba(15,23,42,0.08); color:#334155;">+${fields.length - 3}</span>` : '';
            return `<div style="display:flex; gap:8px; flex-wrap:wrap;">${badges}${more}</div>`;
        };
        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '评估阶段模板',
                    subtitle: '定义阶段模板与表单组件，为部门配置提供可复用的阶段蓝图。',
                    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
                    tags: ['模板管理', '动态表单', '评分模式'],
                })}
                <div class="page-header">
                    <h1 class="page-title">评估阶段</h1>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="App.openPhasePanel()">
                            <i class="fa-solid fa-circle-plus" aria-hidden="true"></i>
                            <span>新建阶段</span>
                        </button>
                    </div>
                </div>

                <div class="card" style="padding: 16px 18px;">
                    <div style="color:#475569; line-height:1.7;">
                        阶段模板只维护「基本信息 + 表单字段 + 得分模式」。规则绑定在部门配置页完成。
                    </div>
                </div>

                <div class="report-grid">
                    ${(templates || []).map(tpl => `
                        <div class="report-card">
                            <div class="report-preview">
                                <i class="fa-solid fa-layer-group" style="font-size: 52px;"></i>
                            </div>
                            <div class="report-info">
                                <div class="report-title">${tpl.name}</div>
                                <div class="report-meta">${tpl.description || '-'}</div>
                                <div class="report-meta">得分模式：${tpl.scoringMode === 'rules_avg' ? '规则均分' : '手工录入'}</div>
                                <div style="margin-top:10px;">${fieldPreview(tpl)}</div>
                                <div class="report-actions" style="margin-top: 12px;">
                                    <button class="btn btn-sm btn-default" onclick="App.openPhaseEditPanel('${tpl.id}')">编辑</button>
                                    <button class="btn btn-sm btn-danger" onclick="App.deletePhaseTemplate('${tpl.id}')">删除</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${this.phasePanelMode ? this.renderPhasePanel() : ''}
            </div>
        `, 'dept-list');
    },

    openPhasePanel() {
        this.phasePanelMode = 'create';
        this.phaseEditingId = '';
        this.phaseDraft = { name: '', description: '', scoringMode: 'manual' };
        this.phaseFieldDrafts = [
            { id: `field_${Date.now()}`, type: 'text', label: '阶段说明', required: true, optionsText: '' },
        ];
        this.renderPhaseTemplateList();
    },

    openPhaseEditPanel(phaseId) {
        const tpl = (API.phaseTemplates || []).find(t => t.id === phaseId);
        if (!tpl) {
            alert('阶段不存在');
            return;
        }
        this.phasePanelMode = 'edit';
        this.phaseEditingId = phaseId;
        this.phaseDraft = { name: tpl.name, description: tpl.description || '', scoringMode: tpl.scoringMode || 'manual' };
        this.phaseFieldDrafts = (tpl.formSchema?.fields || []).map(f => ({
            id: f.id,
            type: f.type,
            label: f.label,
            required: Boolean(f.required),
            optionsText: Array.isArray(f.options) ? f.options.map(o => o.label).join(',') : '',
        }));
        if (!this.phaseFieldDrafts.length) {
            this.phaseFieldDrafts = [{ id: `field_${Date.now()}`, type: 'text', label: '', required: false, optionsText: '' }];
        }
        this.renderPhaseTemplateList();
    },

    closePhasePanel() {
        this.phasePanelMode = '';
        this.phaseEditingId = '';
        this.renderPhaseTemplateList();
    },

    addPhaseField(type) {
        const safeType = type === 'select' ? 'select' : type === 'attachment' ? 'attachment' : 'text';
        this.phaseFieldDrafts.push({
            id: `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            type: safeType,
            label: '',
            required: false,
            optionsText: '',
        });
        this.renderPhaseTemplateList();
    },

    movePhaseField(fieldId, dir) {
        const idx = this.phaseFieldDrafts.findIndex(f => f.id === fieldId);
        if (idx < 0) return;
        const target = dir === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= this.phaseFieldDrafts.length) return;
        const tmp = this.phaseFieldDrafts[idx];
        this.phaseFieldDrafts[idx] = this.phaseFieldDrafts[target];
        this.phaseFieldDrafts[target] = tmp;
        this.renderPhaseTemplateList();
    },

    deletePhaseField(fieldId) {
        this.phaseFieldDrafts = this.phaseFieldDrafts.filter(f => f.id !== fieldId);
        if (!this.phaseFieldDrafts.length) {
            this.phaseFieldDrafts = [{ id: `field_${Date.now()}`, type: 'text', label: '', required: false, optionsText: '' }];
        }
        this.renderPhaseTemplateList();
    },

    renderPhasePanel() {
        const scoringMode = this.phaseDraft.scoringMode === 'rules_avg' ? 'rules_avg' : 'manual';
        return `
            <div class="data-source-drawer-backdrop" onclick="App.closePhasePanel()"></div>
            <div class="data-source-drawer">
                <div class="data-source-drawer-header">
                    <div>
                        <div class="data-source-drawer-title">${this.phaseEditingId ? '编辑阶段' : '新建阶段'}</div>
                        <div class="data-source-drawer-subtitle">配置阶段模板与动态表单字段</div>
                    </div>
                    <button class="btn btn-default btn-sm" onclick="App.closePhasePanel()">关闭</button>
                </div>
                <div class="data-source-panel-content">
                    <div class="data-source-step" style="padding-bottom: 0;">
                        <div class="data-source-step-title">基本信息</div>
                        <div class="data-source-form-grid">
                            <div class="form-group">
                                <label class="form-label required">阶段名称</label>
                                <input id="phase_name" class="input" value="${this.phaseDraft.name}" placeholder="例如：调研阶段">
                            </div>
                            <div class="form-group">
                                <label class="form-label">得分模式</label>
                                <select id="phase_scoring">
                                    <option value="manual" ${scoringMode === 'manual' ? 'selected' : ''}>手工录入</option>
                                    <option value="rules_avg" ${scoringMode === 'rules_avg' ? 'selected' : ''}>规则均分</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">描述</label>
                                <input id="phase_desc" class="input" value="${this.phaseDraft.description}" placeholder="简要说明阶段目标与产出">
                            </div>
                        </div>
                    </div>

                    <div class="data-source-step">
                        <div class="data-source-step-title">表单字段配置</div>
                        <div class="phase-field-toolbar">
                            <button class="btn btn-default btn-sm" onclick="App.addPhaseField('text')">添加输入框</button>
                            <button class="btn btn-default btn-sm" onclick="App.addPhaseField('select')">添加下拉框</button>
                            <button class="btn btn-default btn-sm" onclick="App.addPhaseField('attachment')">添加附件</button>
                        </div>
                        <div class="rule-table-container" style="margin-top: 12px;">
                            <table class="rule-table">
                                <thead>
                                    <tr>
                                        <th style="width: 120px;">类型</th>
                                        <th>标签</th>
                                        <th style="width: 120px;">必填</th>
                                        <th style="width: 240px;">下拉选项</th>
                                        <th style="width: 140px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.phaseFieldDrafts.map(f => `
                                        <tr>
                                            <td>
                                                <select class="phase-field-select" onchange="App.phaseFieldDrafts.find(x=>x.id==='${f.id}').type=this.value; App.renderPhaseTemplateList();">
                                                    <option value="text" ${f.type === 'text' ? 'selected' : ''}>输入框</option>
                                                    <option value="select" ${f.type === 'select' ? 'selected' : ''}>下拉框</option>
                                                    <option value="attachment" ${f.type === 'attachment' ? 'selected' : ''}>附件</option>
                                                </select>
                                            </td>
                                            <td><input class="input" value="${(f.label || '').replace(/\"/g, '&quot;')}" placeholder="字段标签" oninput="App.phaseFieldDrafts.find(x=>x.id==='${f.id}').label=this.value;"></td>
                                            <td style="text-align:center;">
                                                <input type="checkbox" ${f.required ? 'checked' : ''} onchange="App.phaseFieldDrafts.find(x=>x.id==='${f.id}').required=this.checked;">
                                            </td>
                                            <td>
                                                ${f.type === 'select' ? `<input class="input" value="${(f.optionsText || '').replace(/\"/g, '&quot;')}" placeholder="用逗号分隔，如：A,B,C" oninput="App.phaseFieldDrafts.find(x=>x.id==='${f.id}').optionsText=this.value;">` : '<span style="color:#94a3b8;">-</span>'}
                                            </td>
                                            <td>
                                                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                                    <button class="btn btn-sm btn-default" onclick="App.movePhaseField('${f.id}','up')">上移</button>
                                                    <button class="btn btn-sm btn-default" onclick="App.movePhaseField('${f.id}','down')">下移</button>
                                                    <button class="btn btn-sm btn-danger" onclick="App.deletePhaseField('${f.id}')">删除</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div style="color:#64748b; font-size: 12px; margin-top: 10px; line-height:1.6;">
                            说明：附件字段在 mock 阶段仅支持选择文件并显示文件名，不做真实上传。
                        </div>
                    </div>

                    <div class="data-source-panel-actions">
                        <button class="btn btn-default" onclick="App.closePhasePanel()">取消</button>
                        <button class="btn btn-primary" onclick="App.submitPhaseTemplate()">保存阶段</button>
                    </div>
                </div>
            </div>
        `;
    },

    async submitPhaseTemplate() {
        const name = (document.getElementById('phase_name')?.value || '').trim();
        const description = (document.getElementById('phase_desc')?.value || '').trim();
        const scoringMode = document.getElementById('phase_scoring')?.value === 'rules_avg' ? 'rules_avg' : 'manual';
        const fields = (this.phaseFieldDrafts || []).map(f => {
            const options = f.type === 'select'
                ? String(f.optionsText || '').split(',').map(s => s.trim()).filter(Boolean).map(s => ({ label: s, value: s }))
                : undefined;
            return {
                id: f.id,
                type: f.type,
                label: String(f.label || '').trim(),
                required: Boolean(f.required),
                options,
            };
        });
        const res = this.phaseEditingId
            ? await API.updatePhaseTemplate(this.phaseEditingId, { name, description, scoringMode, formSchema: { fields } })
            : await API.createPhaseTemplate({ name, description, scoringMode, formSchema: { fields } });
        if (!res?.success) {
            alert(res?.message || '保存失败');
            return;
        }
        this.phasePanelMode = '';
        this.phaseEditingId = '';
        this.renderPhaseTemplateList();
    },

    async deletePhaseTemplate(phaseId) {
        if (!confirm('确认删除该阶段模板？')) return;
        const res = await API.deletePhaseTemplate(phaseId);
        if (!res?.success) {
            alert(res?.message || '删除失败');
            return;
        }
        this.renderPhaseTemplateList();
    },

    // ── Phase Rule Management ──

    ruleFilterCategory: '',
    rulePanelMode: '',
    ruleEditingId: '',
    ruleDraft: { name: '', description: '', category: '交付质量', enabled: true },

    async renderPhaseRuleList() {
        const rules = await API.getPhaseRules();
        const categories = [...new Set((rules || []).map(r => r.category).filter(Boolean))];
        const filtered = this.ruleFilterCategory
            ? (rules || []).filter(r => r.category === this.ruleFilterCategory)
            : (rules || []);
        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '阶段规则管理',
                    subtitle: '维护阶段评估规则，在部门配置页绑定至阶段用于规则均分计算。',
                    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
                    tags: ['规则维护', '分类筛选', '绑定管理'],
                })}
                <div class="page-header">
                    <h1 class="page-title">阶段规则</h1>
                    <button class="btn btn-primary" onclick="App.openRulePanel()">
                        <i class="fa-solid fa-circle-plus" aria-hidden="true"></i>
                        <span>新建规则</span>
                    </button>
                </div>

                <div class="card" style="padding: 12px 18px; margin-bottom: 0;">
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <span class="status-badge ${!this.ruleFilterCategory ? 'status-info' : ''}" style="cursor:pointer;" onclick="App.filterRuleCategory('')">全部</span>
                        ${categories.map(c => `
                            <span class="status-badge ${this.ruleFilterCategory === c ? 'status-info' : ''}" style="cursor:pointer;" onclick="App.filterRuleCategory('${c}')">${c}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="report-grid">
                    ${filtered.map(rule => `
                        <div class="report-card">
                            <div class="report-preview">
                                <i class="fa-solid fa-scale-balanced" style="font-size: 48px;"></i>
                            </div>
                            <div class="report-info">
                                <div class="report-title">${rule.name}</div>
                                <div class="report-meta">${rule.description || '-'}</div>
                                <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                                    <span class="status-badge" style="background: #e6f4ff; color:#1677ff;">${rule.category || '-'}</span>
                                    <span class="status-badge ${rule.enabled !== false ? 'status-success' : 'status-error'}">${rule.enabled !== false ? '启用' : '禁用'}</span>
                                </div>
                                <div class="report-actions" style="margin-top: 12px;">
                                    <button class="btn btn-sm btn-default" onclick="App.openRuleEditPanel('${rule.id}')">编辑</button>
                                    <button class="btn btn-sm btn-default" onclick="App.toggleRuleEnabled('${rule.id}')">${rule.enabled !== false ? '禁用' : '启用'}</button>
                                    <button class="btn btn-sm btn-danger" onclick="App.deletePhaseRule('${rule.id}')">删除</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${this.rulePanelMode ? this.renderRulePanel() : ''}
            </div>
        `, 'rule-list');
    },

    filterRuleCategory(category) {
        this.ruleFilterCategory = category;
        this.renderPhaseRuleList();
    },

    openRulePanel() {
        this.rulePanelMode = 'create';
        this.ruleEditingId = '';
        this.ruleDraft = { name: '', description: '', category: '交付质量', enabled: true };
        this.renderPhaseRuleList();
    },

    openRuleEditPanel(ruleId) {
        const rule = (API.phaseRules || []).find(r => r.id === ruleId);
        if (!rule) { alert('规则不存在'); return; }
        this.rulePanelMode = 'edit';
        this.ruleEditingId = ruleId;
        this.ruleDraft = { name: rule.name, description: rule.description || '', category: rule.category || '交付质量', enabled: rule.enabled !== false };
        this.renderPhaseRuleList();
    },

    closeRulePanel() {
        this.rulePanelMode = '';
        this.ruleEditingId = '';
        this.renderPhaseRuleList();
    },

    renderRulePanel() {
        const rules = API.phaseRules || [];
        const defaultCategories = ['交付质量', '过程管控', '安全合规', '技术实施'];
        const allCategories = [...new Set([...defaultCategories, ...rules.map(r => r.category).filter(Boolean)])];
        const isCustom = this.ruleDraft.category && !allCategories.includes(this.ruleDraft.category);
        const categoryOptions = allCategories.map(c => `<option value="${c}" ${this.ruleDraft.category === c ? 'selected' : ''}>${c}</option>`).join('');
        return `
            <div class="data-source-drawer-backdrop" onclick="App.closeRulePanel()"></div>
            <div class="data-source-drawer">
                <div class="data-source-drawer-header">
                    <div>
                        <div class="data-source-drawer-title">${this.ruleEditingId ? '编辑规则' : '新建规则'}</div>
                        <div class="data-source-drawer-subtitle">配置阶段评估规则的基本信息</div>
                    </div>
                    <button class="btn btn-default btn-sm" onclick="App.closeRulePanel()">关闭</button>
                </div>
                <div class="data-source-panel-content">
                    <div class="data-source-step" style="padding-bottom: 0;">
                        <div class="data-source-step-title">基本信息</div>
                        <div class="data-source-form-grid">
                            <div class="form-group">
                                <label class="form-label required">规则名称</label>
                                <input id="rule_name" class="input" value="${(this.ruleDraft.name || '').replace(/\"/g, '&quot;')}" placeholder="例如：阶段交付物完整性">
                            </div>
                            <div class="form-group">
                                <label class="form-label">分类</label>
                                <select id="rule_category" onchange="if(this.value==='__custom__'){document.getElementById('rule_category_custom').style.display='block';this.style.display='none';}">
                                    ${categoryOptions}
                                    <option value="__custom__">自定义...</option>
                                </select>
                                <input id="rule_category_custom" class="input" style="display:${isCustom ? 'block' : 'none'}; margin-top:8px;" value="${isCustom ? (this.ruleDraft.category || '').replace(/\"/g, '&quot;') : ''}" placeholder="输入自定义分类">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">描述</label>
                                <input id="rule_desc" class="input" value="${(this.ruleDraft.description || '').replace(/\"/g, '&quot;')}" placeholder="规则的评估要点说明">
                            </div>
                            <div class="form-group">
                                <label class="form-label">状态</label>
                                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                    <input id="rule_enabled" type="checkbox" ${this.ruleDraft.enabled !== false ? 'checked' : ''}>
                                    <span>启用</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="data-source-panel-actions">
                        <button class="btn btn-default" onclick="App.closeRulePanel()">取消</button>
                        <button class="btn btn-primary" onclick="App.submitRule()">保存规则</button>
                    </div>
                </div>
            </div>
        `;
    },

    async submitRule() {
        const name = (document.getElementById('rule_name')?.value || '').trim();
        const description = (document.getElementById('rule_desc')?.value || '').trim();
        const customEl = document.getElementById('rule_category_custom');
        const selectEl = document.getElementById('rule_category');
        const category = (customEl?.style.display !== 'none' && customEl?.value?.trim())
            ? customEl.value.trim()
            : (selectEl?.value === '__custom__' ? '交付质量' : (selectEl?.value || '交付质量'));
        const enabled = document.getElementById('rule_enabled')?.checked !== false;
        const res = this.ruleEditingId
            ? await API.updatePhaseRule(this.ruleEditingId, { name, description, category, enabled })
            : await API.createPhaseRule({ name, description, category, enabled });
        if (!res?.success) { alert(res?.message || '保存失败'); return; }
        this.rulePanelMode = '';
        this.ruleEditingId = '';
        this.renderPhaseRuleList();
    },

    async toggleRuleEnabled(ruleId) {
        const rule = (API.phaseRules || []).find(r => r.id === ruleId);
        if (!rule) return;
        await API.updatePhaseRule(ruleId, { enabled: !rule.enabled });
        this.renderPhaseRuleList();
    },

    async deletePhaseRule(ruleId) {
        if (!confirm('确认删除该规则？')) return;
        const res = await API.deletePhaseRule(ruleId);
        if (!res?.success) { alert(res?.message || '删除失败'); return; }
        this.renderPhaseRuleList();
    },

    async renderDepartmentList() {
        const departments = await API.getDepartments();
        const templates = await API.getPhaseTemplates();
        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '部门管理中心',
                    subtitle: '维护部门基本信息，并进入阶段与规则配置，驱动评估流程。',
                    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
                    tags: ['部门清单', '阶段配置', '规则绑定'],
                })}
                <div class="page-header">
                    <h1 class="page-title">部门管理</h1>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="App.openDepartmentPanel()">
                            <i class="fa-solid fa-circle-plus" aria-hidden="true"></i>
                            <span>新建部门</span>
                        </button>
                    </div>
                </div>

                <div class="report-grid">
                    ${(departments || []).map(dep => {
                        const plan = API.getDepartmentPhasePlan(dep.id);
                        const phaseCount = (plan?.phases || []).length;
                        const hasPlan = phaseCount > 0;
                        const tplNames = (plan?.phases || [])
                            .slice()
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map(item => templates.find(t => t.id === item.phaseId)?.name)
                            .filter(Boolean);
                        return `
                            <div class="report-card">
                                <div class="report-preview">
                                    <i class="fa-solid fa-building-columns" style="font-size: 52px;"></i>
                                </div>
                                <div class="report-info">
                                    <div class="report-title">${dep.name}</div>
                                    <div class="report-meta">编码：${dep.code || '-'}</div>
                                    <div class="report-meta">负责人：${dep.owner || '-'}</div>
                                    <div class="report-meta">阶段配置：${hasPlan ? `${phaseCount} 个阶段` : '未配置'}</div>
                                    <div style="margin-top: 10px; display:flex; gap:8px; flex-wrap:wrap;">
                                        ${tplNames.slice(0, 3).map(n => `<span class="status-badge status-info">${n}</span>`).join('')}
                                        ${tplNames.length > 3 ? `<span class="status-badge">+${tplNames.length - 3}</span>` : ''}
                                    </div>
                                    <div class="report-actions" style="margin-top: 12px;">
                                        <button class="btn btn-sm btn-primary" onclick="Router.navigate('/departments/${dep.id}/config')">配置阶段</button>
                                        <button class="btn btn-sm btn-default" onclick="App.openDepartmentEditPanel('${dep.id}')">编辑</button>
                                        <button class="btn btn-sm btn-danger" onclick="App.deleteDepartment('${dep.id}')">删除</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${this.departmentPanelMode ? this.renderDepartmentPanel() : ''}
            </div>
        `, 'warehouse-list');
    },

    openDepartmentPanel() {
        this.departmentPanelMode = 'create';
        this.departmentEditingId = '';
        this.departmentDraft = { name: '', description: '', code: '', owner: '' };
        this.renderDepartmentList();
    },

    openDepartmentEditPanel(deptId) {
        const dep = (API.departments || []).find(d => d.id === deptId);
        if (!dep) {
            alert('部门不存在');
            return;
        }
        this.departmentPanelMode = 'edit';
        this.departmentEditingId = deptId;
        this.departmentDraft = {
            name: dep.name || '',
            description: dep.description || '',
            code: dep.code || '',
            owner: dep.owner || '',
        };
        this.renderDepartmentList();
    },

    closeDepartmentPanel() {
        this.departmentPanelMode = '';
        this.departmentEditingId = '';
        this.renderDepartmentList();
    },

    renderDepartmentPanel() {
        return `
            <div class="data-source-drawer-backdrop" onclick="App.closeDepartmentPanel()"></div>
            <div class="data-source-drawer">
                <div class="data-source-drawer-header">
                    <div>
                        <div class="data-source-drawer-title">新建部门</div>
                        <div class="data-source-drawer-subtitle">新增后会同步到全局部门选择</div>
                    </div>
                    <button class="btn btn-default btn-sm" onclick="App.closeDepartmentPanel()">关闭</button>
                </div>
                <div class="data-source-panel-content">
                    <div class="data-source-step" style="padding-bottom: 0;">
                        <div class="data-source-step-title">基本信息</div>
                        <div class="data-source-form-grid">
                            <div class="form-group">
                                <label class="form-label required">部门名称</label>
                                <input id="dept_name" class="input" value="${this.departmentDraft.name}" placeholder="例如：人社局">
                            </div>
                            <div class="form-group">
                                <label class="form-label required">部门编码</label>
                                <input id="dept_code" class="input" value="${this.departmentDraft.code}" placeholder="例如：RSJ">
                            </div>
                            <div class="form-group">
                                <label class="form-label required">负责人</label>
                                <input id="dept_owner" class="input" value="${this.departmentDraft.owner}" placeholder="例如：张三">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">描述</label>
                                <input id="dept_desc" class="input" value="${this.departmentDraft.description}" placeholder="部门职责与数据范围摘要">
                            </div>
                        </div>
                    </div>
                    <div class="data-source-panel-actions">
                        <button class="btn btn-default" onclick="App.closeDepartmentPanel()">取消</button>
                        <button class="btn btn-primary" onclick="App.submitDepartment()">${this.departmentEditingId ? '保存修改' : '保存部门'}</button>
                    </div>
                </div>
            </div>
        `;
    },

    async submitDepartment() {
        const name = (document.getElementById('dept_name')?.value || '').trim();
        const code = (document.getElementById('dept_code')?.value || '').trim();
        const owner = (document.getElementById('dept_owner')?.value || '').trim();
        const description = (document.getElementById('dept_desc')?.value || '').trim();
        const res = this.departmentEditingId
            ? await API.updateDepartment(this.departmentEditingId, { name, code, owner, description })
            : await API.createDepartment({ name, code, owner, description });
        if (!res?.success) {
            alert(res?.message || '保存失败');
            return;
        }
        this.departmentPanelMode = '';
        this.departmentEditingId = '';
        Router.navigate(`/departments/${res.department.id}/config`);
    },

    async deleteDepartment(deptId) {
        if (!confirm('确认删除该部门？')) return;
        const res = await API.deleteDepartment(deptId);
        if (!res?.success) {
            alert(res?.message || '删除失败');
            return;
        }
        this.renderDepartmentList();
    },

    async renderDepartmentConfig(deptId) {
        const departments = await API.getDepartments();
        const dept = (departments || []).find(d => d.id === deptId);
        const templates = await API.getPhaseTemplates();
        const rules = await API.getPhaseRules();
        if (!dept) {
            this.renderWithLayout('<div class="container"><h1>部门不存在</h1></div>', 'dept-list');
            return;
        }
        if (!this.departmentPlanDraft || this.departmentPlanDraft.departmentId !== deptId) {
            const plan = API.getDepartmentPhasePlan(deptId);
            this.departmentPlanDraft = JSON.parse(JSON.stringify(plan));
        }
        const planPhases = (this.departmentPlanDraft.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const unconfiguredHint = planPhases.length ? '' : `<span class="status-badge status-warning">未配置阶段：将无法开始评估</span>`;
        this.renderWithLayout(`
            <div class="container" style="max-width: 1100px;">
                <div class="back-link" onclick="Router.navigate('/departments')">← 返回部门管理</div>
                <div class="page-header" style="margin-bottom: 12px;">
                    <div>
                        <h1 class="page-title" style="margin-bottom: 8px;">${dept.name}</h1>
                        <div style="color:#64748b;">编码：${dept.code || '-'}，负责人：${dept.owner || '-'}</div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        ${unconfiguredHint}
                        <button class="btn btn-primary" onclick="App.saveDepartmentConfig('${deptId}')">保存配置</button>
                    </div>
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 14px;">
                        <div>
                            <h2 class="section-title" style="margin-bottom: 6px;">阶段编排</h2>
                            <div style="color:#64748b; font-size: 13px;">选择阶段模板并设置顺序；规则绑定在阶段行内配置。</div>
                        </div>
                        <div style="display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap;">
                            <div style="min-width: 260px;">
                                <label style="display:block; font-size: 12px; color:#64748b; margin-bottom:6px;">添加阶段</label>
                                <select id="dept_add_phase">
                                    ${(templates || []).map(t => `<option value="${t.id}">${t.name}（${t.scoringMode === 'rules_avg' ? '规则均分' : '手工录入'}）</option>`).join('')}
                                </select>
                            </div>
                            <button class="btn btn-default" onclick="App.addDepartmentPhase('${deptId}')">添加</button>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap: 12px;">
                        ${planPhases.length ? planPhases.map((p, idx) => {
                            const tpl = templates.find(t => t.id === p.phaseId);
                            const scoringMode = tpl?.scoringMode || 'manual';
                            const bound = new Set((p.ruleBindings || []).map(b => b.ruleId));
                            const ruleHint = scoringMode === 'rules_avg' ? `
                                <div style="color:#64748b; font-size: 12px; margin-top: 8px;">至少绑定 2 条规则，评估时以规则得分均值计算阶段得分。</div>
                            ` : `<div style="color:#94a3b8; font-size:12px; margin-top: 8px;">该阶段为手工录入阶段得分，不需要绑定规则。</div>`;
                            return `
                                <div class="phase-plan-row">
                                    <div class="phase-plan-left">
                                        <div class="phase-plan-order">#${idx + 1}</div>
                                        <div>
                                            <div style="font-weight: 650; color:#0f172a;">${tpl?.name || p.phaseId}</div>
                                            <div style="margin-top:4px; color:#64748b; font-size: 13px;">${tpl?.description || '-'}</div>
                                        </div>
                                    </div>
                                    <div class="phase-plan-actions">
                                        <span class="status-badge ${scoringMode === 'rules_avg' ? 'status-info' : ''}">${scoringMode === 'rules_avg' ? '规则均分' : '手工录入'}</span>
                                        <button class="btn btn-sm btn-default" ${idx === 0 ? 'disabled' : `onclick="App.moveDepartmentPhase('${deptId}','${p.phaseId}','up')"`}>上移</button>
                                        <button class="btn btn-sm btn-default" ${idx === planPhases.length - 1 ? 'disabled' : `onclick="App.moveDepartmentPhase('${deptId}','${p.phaseId}','down')"`}>下移</button>
                                        <button class="btn btn-sm btn-danger" onclick="App.removeDepartmentPhase('${deptId}','${p.phaseId}')">移除</button>
                                    </div>
                                    <div class="phase-plan-rules">
                                        ${scoringMode === 'rules_avg' ? `
                                            <div class="phase-rule-grid">
                                                ${(rules || []).map(r => {
                                                    const disabled = r.enabled === false;
                                                    const alreadyBound = bound.has(r.id);
                                                    if (disabled && !alreadyBound) return '';
                                                    return `
                                                    <label class="phase-rule-item" style="${disabled ? 'opacity:0.45; pointer-events:none;' : ''}">
                                                        <input type="checkbox" ${alreadyBound ? 'checked' : ''} ${disabled ? 'disabled' : ''} onchange="App.toggleDepartmentPhaseRule('${deptId}','${p.phaseId}','${r.id}', this.checked)">
                                                        <span class="phase-rule-name">${r.name}${disabled ? '（已禁用）' : ''}</span>
                                                    </label>`;
                                                }).join('')}
                                            </div>
                                        ` : ''}
                                        ${ruleHint}
                                    </div>
                                </div>
                            `;
                        }).join('') : `<div style="color:#8c8c8c;">暂无阶段，请从右上角选择模板添加。</div>`}
                    </div>
                </div>
            </div>
        `, 'dept-list');
    },

    addDepartmentPhase(deptId) {
        const phaseId = document.getElementById('dept_add_phase')?.value || '';
        if (!phaseId) return;
        const phases = this.departmentPlanDraft?.phases || [];
        if (phases.some(p => p.phaseId === phaseId)) {
            alert('该阶段已添加');
            return;
        }
        const order = phases.length ? Math.max(...phases.map(p => Number(p.order) || 0)) + 1 : 1;
        phases.push({ phaseId, order });
        this.departmentPlanDraft.phases = phases;
        this.renderDepartmentConfig(deptId);
    },

    moveDepartmentPhase(deptId, phaseId, dir) {
        const phases = (this.departmentPlanDraft?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const idx = phases.findIndex(p => p.phaseId === phaseId);
        if (idx < 0) return;
        const target = dir === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= phases.length) return;
        const tmp = phases[idx].order;
        phases[idx].order = phases[target].order;
        phases[target].order = tmp;
        this.departmentPlanDraft.phases = phases;
        this.renderDepartmentConfig(deptId);
    },

    removeDepartmentPhase(deptId, phaseId) {
        const phases = (this.departmentPlanDraft?.phases || []).filter(p => p.phaseId !== phaseId);
        // Re-number order
        phases.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach((p, idx) => (p.order = idx + 1));
        this.departmentPlanDraft.phases = phases;
        this.renderDepartmentConfig(deptId);
    },

    toggleDepartmentPhaseRule(deptId, phaseId, ruleId, checked) {
        const phases = this.departmentPlanDraft?.phases || [];
        const phase = phases.find(p => p.phaseId === phaseId);
        if (!phase) return;
        const list = Array.isArray(phase.ruleBindings) ? phase.ruleBindings : [];
        const exists = list.some(b => b.ruleId === ruleId);
        if (checked && !exists) list.push({ ruleId });
        if (!checked) phase.ruleBindings = list.filter(b => b.ruleId !== ruleId);
        else phase.ruleBindings = list;
    },

    async saveDepartmentConfig(deptId) {
        const phases = (this.departmentPlanDraft?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        phases.forEach((p, idx) => (p.order = idx + 1));
        await API.saveDepartmentPhasePlan(deptId, phases);
        alert('配置已保存');
        this.departmentPlanDraft = null;
        this.renderDepartmentConfig(deptId);
    },

    async renderEvaluationList() {
        const evaluations = await API.getEvaluations();
        const keyword = this.evaluationFilters.keyword.trim().toLowerCase();
        const status = this.evaluationFilters.status;
        const filteredEvaluations = evaluations.filter(item => {
            const displayName = (item.warehouseName || '').toLowerCase();
            const matchesKeyword = !keyword || displayName.includes(keyword);
            const matchesStatus = !status || item.status === status;
            return matchesKeyword && matchesStatus;
        });
        const evalCountByWarehouse = evaluations.reduce((acc, item) => {
            const key = item.warehouseId || item.warehouseName;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const pageSize = 8;
        const totalPages = Math.max(1, Math.ceil(filteredEvaluations.length / pageSize));
        this.evaluationPage = Math.min(Math.max(this.evaluationPage || 1, 1), totalPages);
        const start = (this.evaluationPage - 1) * pageSize;
        const pageItems = filteredEvaluations.slice(start, start + pageSize);
        this.renderWithLayout(`
            <div class="container">
                ${this.renderPageHero({
                    title: '评估运行中心',
                    subtitle: '查看评估进度、评分等级与历史复评记录，支撑问题闭环治理。',
                    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
                    tags: ['评估状态', '得分等级', '报告联动'],
                })}
                <div class="page-header">
                    <h1 class="page-title">评估列表</h1>
                </div>
                <div class="filter-bar">
                    <div class="filter-item">
                        <label>搜索数仓</label>
                        <input type="text" class="input" id="searchInput" value="${this.evaluationFilters.keyword}" placeholder="输入数仓名称">
                    </div>
                    <div class="filter-item">
                        <label>评估状态</label>
                        <select id="statusFilter">
                            <option value="" ${this.evaluationFilters.status === '' ? 'selected' : ''}>全部</option>
                            <option value="completed" ${this.evaluationFilters.status === 'completed' ? 'selected' : ''}>已完成</option>
                            <option value="in_progress" ${this.evaluationFilters.status === 'in_progress' ? 'selected' : ''}>进行中</option>
                            <option value="failed" ${this.evaluationFilters.status === 'failed' ? 'selected' : ''}>失败</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="App.applyEvaluationFilters()">查询</button>
                    <button class="btn btn-default" onclick="App.resetEvaluationFilters()">重置</button>
                </div>
                <div class="card">
                    <table>
	                        <thead>
	                            <tr>
	                                <th>数仓名称</th>
                                    <th style="width: 120px;">评估维度</th>
	                                <th>评估时间</th>
	                                <th>评估次数</th>
	                                <th>状态</th>
	                                <th>得分</th>
	                                <th>等级</th>
	                                <th>操作</th>
	                            </tr>
	                        </thead>
                        <tbody>
	                            ${pageItems.length ? pageItems.map(e => {
                                    const dimLabel = (e.evaluationDimension || (e.phaseId ? 'phase' : 'department')) === 'phase' ? '阶段' : '部门';
                                    return `
	                                <tr>
	                                    <td>${e.warehouseName}</td>
                                        <td>${dimLabel}</td>
	                                    <td>${this.formatDate(e.startTime)}</td>
	                                    <td>${evalCountByWarehouse[e.warehouseId || e.warehouseName] || 1}</td>
	                                    <td>${this.getStatusBadge(e.status)}</td>
	                                    <td>
	                                        ${e.score === null || e.score === undefined ? '-' : `<span style="font-weight: 700; color: ${this.getScoreColor(e.score)};">${e.score}</span>`}
	                                    </td>
	                                    <td>
	                                        ${e.grade ? `<span class="status-badge ${this.getGradeClass(e.grade)}">${e.grade}</span>` : '-'}
	                                    </td>
	                                    <td>
	                                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                            <button class="btn btn-sm btn-default" ${e.status === 'completed' ? `onclick="App.reEvaluateEvaluation('${e.id}')"` : 'disabled'}>重新评估</button>
	                                            <button class="btn btn-sm btn-default" ${e.status === 'completed' ? `onclick="App.openEvaluationReport('${e.id}')"` : 'disabled'}>报告</button>
	                                            <button class="btn btn-sm btn-primary" onclick="Router.navigate('/evaluations/${e.id}')">查看详情</button>
	                                        </div>
	                                    </td>
	                                </tr>
	                            `;
                                }).join('') : `
	                                <tr>
	                                    <td colspan="8" class="table-empty-cell">暂无评估记录</td>
	                                </tr>
	                            `}
                        </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <button ${this.evaluationPage <= 1 ? 'disabled' : ''} onclick="App.changeEvaluationPage(${this.evaluationPage - 1})">上一页</button>
                    ${Array.from({ length: totalPages }).map((_, i) => `
                        <button class="${this.evaluationPage === i + 1 ? 'active' : ''}" onclick="App.changeEvaluationPage(${i + 1})">${i + 1}</button>
                    `).join('')}
                    <button ${this.evaluationPage >= totalPages ? 'disabled' : ''} onclick="App.changeEvaluationPage(${this.evaluationPage + 1})">下一页</button>
                </div>
            </div>
        `, 'eval-list');
    },

    changeEvaluationPage(page) {
        this.evaluationPage = page;
        this.renderEvaluationList();
    },

    evaluationFilters: {
        keyword: '',
        status: '',
    },

    applyEvaluationFilters() {
        this.evaluationFilters = {
            keyword: (document.getElementById('searchInput')?.value || '').trim(),
            status: document.getElementById('statusFilter')?.value || '',
        };
        this.evaluationPage = 1;
        this.renderEvaluationList();
    },

    resetEvaluationFilters() {
        this.evaluationFilters = {
            keyword: '',
            status: '',
        };
        this.evaluationPage = 1;
        this.renderEvaluationList();
    },

    async openEvaluationReport(evaluationId) {
        const reports = await API.getReports();
        const existing = reports.find(r => r.evaluationId === evaluationId);
        if (existing) {
            Router.navigate(`/reports/${existing.id}`);
            return;
        }
        const created = await API.createReport({ evaluationId });
        Router.navigate(`/reports/${created.id}`);
    },

    reEvaluateWarehouse(warehouseId, warehouseName) {
        if (warehouseName) {
            this.selectedWarehouseName = warehouseName;
        } else if (warehouseId) {
            const wh = API.getFlatWarehouses().find(item => item.id === warehouseId);
            this.selectedWarehouseName = wh?.fullName || wh?.name || '未选择数仓';
        }
        this.selectedWarehouseId = warehouseId || '';
        Router.navigate('/evaluations/new');
    },

    reEvaluateEvaluation(evaluationId) {
        const e = (API.evaluations || []).find(item => item.id === evaluationId);
        if (!e) return;
        const dim = (e.evaluationDimension || (e.phaseId ? 'phase' : 'department')) === 'phase' ? 'phase' : 'department';
        if (dim === 'phase') {
            Router.navigate(`/evaluations/new?target=phase&deptId=${encodeURIComponent(e.departmentId || '')}&phaseId=${encodeURIComponent(e.phaseId || '')}`);
            return;
        }
        if (e.departmentId && !e.warehouseId) {
            Router.navigate(`/evaluations/new?target=department&deptId=${encodeURIComponent(e.departmentId)}`);
            return;
        }
        if (e.warehouseId) {
            this.selectedWarehouseId = e.warehouseId;
            this.selectedWarehouseName = e.warehouseName || '未选择对象';
            Router.navigate('/evaluations/new');
        }
    },

    selectedRuleSet: 'engineering',
    currentRules: [],
    selectedWarehouseName: '未选择数仓',
    selectedWarehouseId: '',

    async renderCreateEvaluation(query = {}) {
        const gradeLevels = API.gradeLevels || [];
        const templates = await API.getPhaseTemplates();
        const target = query?.target === 'phase' ? 'phase' : query?.target === 'department' ? 'department' : 'warehouse';
        const deptIdFromQuery = String(query?.deptId || '').trim();
        const phaseIdFromQuery = String(query?.phaseId || '').trim();

        const warehouseId = target === 'warehouse' ? (this.selectedWarehouseId || '') : '';
        const deptInfo = target === 'warehouse'
            ? (warehouseId ? API.getWarehouseDepartmentInfo(warehouseId) : null)
            : (deptIdFromQuery ? { deptId: deptIdFromQuery, deptName: (API.departments || []).find(d => d.id === deptIdFromQuery)?.name || '' } : null);
        const plan = deptInfo ? API.getDepartmentPhasePlan(deptInfo.deptId) : null;
        const orderedPhases = (plan?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const phasePreview = orderedPhases.map((p, idx) => {
            const tpl = templates.find(t => t.id === p.phaseId);
            return {
                idx,
                name: tpl?.name || p.phaseId,
                desc: tpl?.description || '-',
                scoringMode: tpl?.scoringMode || 'manual',
                ruleCount: (p.ruleBindings || []).length,
            };
        });
        const canStart = Boolean(deptInfo) && (target === 'phase' ? Boolean(phaseIdFromQuery) : orderedPhases.length > 0);
        const headerTitle = target === 'department'
            ? (deptInfo?.deptName || '部门评估')
            : target === 'phase'
                ? `${deptInfo?.deptName || '部门'} - ${(templates.find(t => t.id === phaseIdFromQuery)?.name || phaseIdFromQuery || '阶段')}`
                : this.selectedWarehouseName;
        const headerMeta = target === 'warehouse'
            ? `所属部门：${deptInfo?.deptName || '<span style="color:#ef4444;">未识别</span>'}`
            : `评估维度：${target === 'phase' ? '阶段' : '部门'}，所属部门：${deptInfo?.deptName || '-'}`;
        this.renderWithLayout(`
            <div class="container" style="max-width: 1100px;">
                <div class="card" style="padding: 18px 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap: wrap;">
                        <div>
                            <div style="color:#64748b; font-size: 12px; margin-bottom: 6px;">立即评估</div>
                            <div style="font-weight: 750; font-size: 18px; color:#0f172a;">${headerTitle}</div>
                            <div style="margin-top: 6px; color:#64748b; font-size: 13px;">${headerMeta}</div>
                        </div>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button class="btn btn-primary" ${canStart ? '' : 'disabled'} onclick="App.startEvaluationFromCreate()">开始评估</button>
                        </div>
                    </div>
                    ${canStart ? '' : `
                        <div style="margin-top: 12px;">
                            <span class="status-badge status-warning">所属部门未配置评估阶段，当前不可评估</span>
                            ${deptInfo?.deptId ? `<button class="btn btn-sm btn-default" style="margin-left: 10px;" onclick="Router.navigate('/departments/${deptInfo.deptId}/config')">去配置阶段</button>` : ''}
                        </div>
                    `}
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; margin-bottom: 12px;">
                        <h2 class="section-title" style="margin-bottom: 0;">阶段预览</h2>
                        ${deptInfo?.deptId ? `<button class="btn btn-sm btn-default" onclick="Router.navigate('/departments/${deptInfo.deptId}/config')">编辑部门阶段</button>` : ''}
                    </div>
                    ${phasePreview.length ? `
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            ${phasePreview.map(item => `
                                <div class="phase-preview-row">
                                    <div style="display:flex; gap:12px; align-items:flex-start;">
                                        <div class="phase-preview-index">${item.idx + 1}</div>
                                        <div>
                                            <div style="font-weight: 650; color:#0f172a;">${item.name}</div>
                                            <div style="margin-top: 4px; color:#64748b; font-size: 13px;">${item.desc}</div>
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                                        <span class="status-badge ${item.scoringMode === 'rules_avg' ? 'status-info' : ''}">${item.scoringMode === 'rules_avg' ? `规则均分（${item.ruleCount}）` : '手工录入'}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `<div style="color:#8c8c8c;">暂无阶段配置</div>`}
                </div>

                <div class="card">
                    <h2 class="section-title">得分等级划分</h2>
                    <div class="grade-levels">
                        ${gradeLevels.map(gl => `
                            <div class="grade-card grade-${gl.grade.toLowerCase()}">
                                <div class="grade-grade">${gl.grade}</div>
                                <div class="grade-range">${gl.minScore} - ${gl.maxScore} 分</div>
                                <div class="grade-desc">${gl.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `, 'eval-list');
    },

    async startEvaluationFromCreate() {
        try {
            const query = Router.currentRoute?.query || {};
            const target = query?.target === 'phase' ? 'phase' : query?.target === 'department' ? 'department' : 'warehouse';
            let payload = null;
            if (target === 'department') {
                const deptId = String(query?.deptId || '').trim();
                if (!deptId) {
                    alert('缺少部门信息');
                    return;
                }
                payload = { dimension: 'department', departmentId: deptId };
            } else if (target === 'phase') {
                const deptId = String(query?.deptId || '').trim();
                const phaseId = String(query?.phaseId || '').trim();
                if (!deptId || !phaseId) {
                    alert('缺少部门或阶段信息');
                    return;
                }
                payload = { dimension: 'phase', departmentId: deptId, phaseId };
            } else {
                let warehouseId = this.selectedWarehouseId;
                if (!warehouseId && this.selectedWarehouseName && this.selectedWarehouseName !== '未选择数仓') {
                    const matched = API.getFlatWarehouses().find(item =>
                        item.fullName === this.selectedWarehouseName || item.name === this.selectedWarehouseName
                    );
                    warehouseId = matched?.id || '';
                }
                if (!warehouseId) {
                    alert('请先从数据工程选择需要评估的对象');
                    return;
                }
                payload = { warehouseId };
            }
            const newEval = await API.createEvaluation(payload);
            Router.navigate(`/evaluations/${newEval.id}`);
        } catch (err) {
            alert(err?.message || '创建评估失败');
        }
    },

    renderRuleTableRows() {
        return this.currentRules.map((rule, idx) => `
            <tr data-index="${idx}">
                <td><input type="text" value="${rule.name}" readonly></td>
                <td><input type="text" value="${rule.dimension}" readonly></td>
                <td><input type="number" class="weight-input" value="${rule.weight}" min="0" max="100" onchange="App.updateRuleWeight(${idx}, this.value)"></td>
                <td><button class="btn btn-sm btn-danger" onclick="App.deleteRule(${idx})">删除</button></td>
            </tr>
        `).join('');
    },

    initAnchorLinks() {
        document.querySelectorAll('.anchor-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                document.querySelectorAll('.anchor-link').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },

    selectRuleSet(ruleSetId, el) {
        this.selectedRuleSet = ruleSetId;
        this.currentRules = JSON.parse(JSON.stringify(API.rules[ruleSetId]));
        document.querySelectorAll('.rule-set-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('ruleTableBody').innerHTML = this.renderRuleTableRows();
    },

    updateRuleWeight(index, value) {
        this.currentRules[index].weight = parseInt(value) || 0;
    },

    deleteRule(index) {
        this.currentRules.splice(index, 1);
        document.getElementById('ruleTableBody').innerHTML = this.renderRuleTableRows();
    },

    async renderEvaluationDetail(id) {
        const evaluation = await API.getEvaluation(id);
        if (!evaluation) {
            this.renderWithLayout('<div class="container"><h1>评估不存在</h1></div>', 'eval-list');
            return;
        }
        const templates = await API.getPhaseTemplates();
        const phaseRules = await API.getPhaseRules();
        const deptPlan = evaluation.departmentId ? API.getDepartmentPhasePlan(evaluation.departmentId) : null;
        const isPhaseEval = (evaluation.evaluationDimension || (evaluation.phaseId ? 'phase' : 'department')) === 'phase';
        const planPhases = (deptPlan?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const effectivePlanPhases = isPhaseEval
            ? [{ phaseId: evaluation.phaseId, order: 1, ruleBindings: [] }]
            : planPhases;
        const issueSeverityMeta = {
            high: { label: '高', color: '#cf1322', bg: 'rgba(207,19,34,0.12)' },
            medium: { label: '中', color: '#d48806', bg: 'rgba(212,136,6,0.12)' },
            low: { label: '低', color: '#389e0d', bg: 'rgba(56,158,13,0.12)' },
        };
        const issueCount = evaluation.issues?.length || 0;
        const completed = evaluation.status === 'completed';
        const getPhaseName = (phaseId) => templates.find(t => t.id === phaseId)?.name || phaseId;
        const getPhaseTemplate = (phaseId) => templates.find(t => t.id === phaseId) || null;
        const getPhasePlanItem = (phaseId) => effectivePlanPhases.find(p => p.phaseId === phaseId) || null;
        const getPhaseSubmission = (phaseId) => (evaluation.phaseSubmissions || []).find(s => s.phaseId === phaseId)?.data || {};
        const getPhaseScore = (phaseId) => (evaluation.phaseScores || []).find(s => s.phaseId === phaseId)?.score;
        const getPhaseRuleScore = (phaseId, ruleId) => (evaluation.phaseRuleScores || []).find(s => s.phaseId === phaseId && s.ruleId === ruleId)?.score;
        const phaseTabs = effectivePlanPhases.map((p, i) => `<div class="tab-item phase-tab-item ${i === 0 ? 'active' : ''}" onclick="App.switchEvalPhaseTab('${p.phaseId}', this)">${getPhaseName(p.phaseId)}</div>`).join('');
        const phaseContents = effectivePlanPhases.map((p, i) => {
            const tpl = getPhaseTemplate(p.phaseId);
            const scoringMode = isPhaseEval ? 'manual' : (tpl?.scoringMode || 'manual');
            const submission = getPhaseSubmission(p.phaseId);
            const score = getPhaseScore(p.phaseId);
            const bindings = (getPhasePlanItem(p.phaseId)?.ruleBindings || []).map(b => b.ruleId).filter(Boolean);
            const ruleRows = bindings.map(rid => {
                const rule = (phaseRules || []).find(r => r.id === rid);
                const cur = getPhaseRuleScore(p.phaseId, rid);
                return `
                    <div class="phase-rule-score-row">
                        <div>
                            <div style="font-weight: 650; color:#0f172a;">${rule?.name || rid}</div>
                            <div style="margin-top:4px; color:#64748b; font-size: 12px;">${rule?.description || '-'}</div>
                        </div>
                        <input class="input phase-score-input" id="phase_rule_${p.phaseId}_${rid}" type="number" min="0" max="100" value="${cur ?? ''}" placeholder="0-100">
                    </div>
                `;
            }).join('');
            const fields = tpl?.formSchema?.fields || [];
            const fieldRows = fields.map(f => {
                const val = submission?.[f.id];
                const requiredMark = f.required ? '<span class="form-label-required">*</span>' : '';
                if (f.type === 'select') {
                    const options = (f.options || []).map(o => `<option value="${o.value}" ${String(val || '') === String(o.value) ? 'selected' : ''}>${o.label}</option>`).join('');
                    return `
                        <div class="form-group">
                            <label class="form-label">${f.label}${requiredMark}</label>
                            <select id="phase_field_${p.phaseId}_${f.id}">
                                <option value="">请选择</option>
                                ${options}
                            </select>
                        </div>
                    `;
                }
                if (f.type === 'attachment') {
                    const fileLabel = val ? `<div class="phase-attachment-name">已选择：${val}</div>` : '<div class="phase-attachment-name is-empty">未选择文件</div>';
                    return `
                        <div class="form-group">
                            <label class="form-label">${f.label}${requiredMark}</label>
                            <input id="phase_field_${p.phaseId}_${f.id}" type="file" class="input">
                            ${fileLabel}
                        </div>
                    `;
                }
                return `
                    <div class="form-group">
                        <label class="form-label">${f.label}${requiredMark}</label>
                        <input id="phase_field_${p.phaseId}_${f.id}" class="input" value="${val ? String(val).replace(/\"/g, '&quot;') : ''}" placeholder="请输入">
                    </div>
                `;
            }).join('');
            const scoreBox = scoringMode === 'manual'
                ? `
                    <div class="phase-score-box">
                        <label class="form-label required">阶段得分（0-100）</label>
                        <input class="input phase-score-input" id="phase_score_${p.phaseId}" type="number" min="0" max="100" value="${score ?? ''}" placeholder="请输入阶段得分">
                    </div>
                `
                : `
                    <div class="phase-score-box">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap: 12px; flex-wrap:wrap;">
                            <div>
                                <div style="font-weight:650; color:#0f172a;">规则得分录入</div>
                                <div style="margin-top:4px; color:#64748b; font-size: 12px;">至少录入 2 条规则得分后自动计算阶段得分。</div>
                            </div>
                            <div class="phase-score-pill ${score === null || score === undefined ? 'is-empty' : ''}">
                                阶段得分：${score === null || score === undefined ? '--' : score}
                            </div>
                        </div>
                        <div style="margin-top: 12px; display:flex; flex-direction:column; gap: 12px;">
                            ${ruleRows || '<div style="color:#94a3b8;">暂无规则绑定，请先在部门配置页绑定规则。</div>'}
                        </div>
                    </div>
                `;
            return `
                <div class="tab-content ${i === 0 ? 'active' : ''}" id="eval_phase_tab_${p.phaseId}">
                    <div class="phase-detail-header">
                        <div>
                            <div style="font-weight: 750; color:#0f172a; font-size: 16px;">${tpl?.name || p.phaseId}</div>
                            <div style="margin-top:6px; color:#64748b; font-size: 13px;">${tpl?.description || '-'}</div>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            <span class="status-badge ${scoringMode === 'rules_avg' ? 'status-info' : ''}">${scoringMode === 'rules_avg' ? '规则均分' : '手工录入'}</span>
                            <span class="phase-score-pill ${score === null || score === undefined ? 'is-empty' : ''}">得分：${score === null || score === undefined ? '--' : score}</span>
                        </div>
                    </div>
                    <div class="phase-detail-body">
                        ${fields.length ? `
                            <div class="phase-form-grid">
                                ${fieldRows}
                            </div>
                        ` : '<div style="color:#94a3b8;">该阶段未配置表单字段</div>'}
                        ${scoreBox}
                        <div class="phase-detail-actions">
                            <button class="btn btn-primary" onclick="App.saveEvaluationPhaseFromDetail('${evaluation.id}', '${p.phaseId}')">保存阶段</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        this.renderWithLayout(`
            <div class="container">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px;">
                    <div>
                        <div class="back-link" onclick="Router.navigate('/evaluations')">← 返回列表</div>
                        <h2 style="margin-bottom: 6px;">${evaluation.warehouseName}</h2>
                        <div style="color: #666; font-size: 14px;">所属部门: ${evaluation.departmentName || '-'}</div>
                        <div style="color: #666; font-size: 14px; margin-top: 4px;">评估时间: ${this.formatDate(evaluation.startTime)}</div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" ${completed ? `onclick="App.openEvaluationReport('${evaluation.id}')"` : 'disabled'}>生成报告</button>
                        <button class="btn btn-default" onclick="API.exportEvaluationResult('${evaluation.id}', 'json')">下载</button>
                    </div>
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                        <div></div>
                        <div>${this.getStatusBadge(evaluation.status)}</div>
                    </div>
                    ${completed ? `
                        <div class="evaluation-overview-completed">
                            <div class="evaluation-score-bubble ${this.getGradeClass(evaluation.grade)}">
                                <div class="evaluation-score-value">${evaluation.score ?? '-'}</div>
                                <div class="evaluation-score-label">得分</div>
                            </div>
                            <div class="evaluation-overview-metrics">
                                <div class="overview-card">
                                    <div class="overview-card-value">${evaluation.grade || '-'}</div>
                                    <div class="overview-card-label">等级</div>
                                </div>
                                <div class="overview-card">
                                    <div class="overview-card-value">${issueCount}</div>
                                    <div class="overview-card-label">问题统计数</div>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div style="margin-bottom: 6px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                                <span>评估进度</span>
                                <span>${evaluation.progress || 0}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${evaluation.progress || 0}%;"></div>
                            </div>
                        </div>
                    `}
                </div>

                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; margin-bottom: 12px;">
                        <h3 style="font-size: 18px; margin-bottom: 0;">阶段评估</h3>
                        ${evaluation.departmentId ? `<button class="btn btn-sm btn-default" onclick="Router.navigate('/departments/${evaluation.departmentId}/config')">配置部门阶段</button>` : ''}
                    </div>
                    ${effectivePlanPhases.length ? `
                        <div class="tab-nav">
                            ${phaseTabs}
                        </div>
                        ${phaseContents}
                    ` : `<div style="color:#8c8c8c;">该评估未关联部门阶段配置</div>`}
                </div>

                <details class="card" style="padding: 18px 20px;">
                    <summary style="cursor:pointer; font-weight: 650; color:#0f172a;">维度得分（参考）</summary>
                    <div style="margin-top: 14px; color:#64748b; font-size: 13px; line-height:1.7;">
                        维度规则集仅用于分数展示，不参与本次部门/阶段主评分口径。
                    </div>
                    <div style="margin-top: 14px;">
                        ${this.renderEvaluationDimensionTable(evaluation)}
                    </div>
                </details>

                <div class="card">
                    <h3 style="font-size: 18px; margin-bottom: 16px;">问题清单</h3>
                    ${evaluation.issues?.length > 0 ? `
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${evaluation.issues.map((issue, idx) => {
                                const meta = issueSeverityMeta[issue.severity] || issueSeverityMeta.low;
                                const issueName = (issue.description || '').split(/[，。]/)[0] || `问题${idx + 1}`;
                                return `
                                    <div class="evaluation-issue-item" style="background:${meta.bg}; border: 1px solid ${meta.color}33;">
                                        <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; margin-bottom:8px;">
                                            <div>
                                                <div style="font-weight:600; color:#0f172a;">所属规则名称：${issue.rule}</div>
                                                <div style="margin-top:4px; color:#334155;">问题名称：${issueName}</div>
                                            </div>
                                            <span class="status-badge" style="background:${meta.bg}; color:${meta.color};">严重度：${meta.label}</span>
                                        </div>
                                        <div style="color:#334155; line-height:1.6;">问题描述：${issue.description || '-'}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : '<div style="color:#8c8c8c;">暂无问题</div>'}
                </div>
            </div>
        `, 'eval-list');
    },

    renderEvaluationDimensionTable(evaluation) {
        const ruleSets = API.ruleSets || [];
        const completed = evaluation.status === 'completed';
        const renderRuleRows = (ruleSetId) => {
            const rules = API.rules[ruleSetId] || [];
            const dimScore = evaluation.dimensionScores?.[ruleSetId]?.score;
            return rules.map(rule => {
                let scoreText = '-';
                if (completed && dimScore !== null && dimScore !== undefined) {
                    const seed = (rule.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
                    const offset = (seed % 9) - 4;
                    const score = Math.max(0, Math.min(100, Math.round(dimScore + offset)));
                    scoreText = String(score);
                }
                return `
                    <tr>
                        <td>${rule.name}</td>
                        <td>${rule.weight}</td>
                        <td>${scoreText}</td>
                    </tr>
                `;
            }).join('');
        };
        return `
            <div class="tab-nav">
                ${ruleSets.map((d, i) => `
                    <div class="tab-item dim-tab-item ${i === 0 ? 'active' : ''}" onclick="App.switchEvalRuleSetTab('${d.id}', this)">${d.name}</div>
                `).join('')}
            </div>
            ${ruleSets.map((rs, i) => `
                <div class="tab-content ${i === 0 ? 'active' : ''}" id="eval_rule_tab_${rs.id}">
                    <table class="rule-table">
                        <thead>
                            <tr>
                                <th>评估规则名称</th>
                                <th style="width: 120px;">权重</th>
                                <th style="width: 120px;">得分</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderRuleRows(rs.id)}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        `;
    },

    switchEvalPhaseTab(phaseId, el) {
        document.querySelectorAll('.phase-tab-item').forEach(item => item.classList.remove('active'));
        el.classList.add('active');
        document.querySelectorAll('[id^="eval_phase_tab_"]').forEach(tab => tab.classList.remove('active'));
        const target = document.getElementById(`eval_phase_tab_${phaseId}`);
        if (target) target.classList.add('active');
    },

    async saveEvaluationPhaseFromDetail(evaluationId, phaseId) {
        const evaluation = await API.getEvaluation(evaluationId);
        const templates = await API.getPhaseTemplates();
        const tpl = templates.find(t => t.id === phaseId);
        const submission = {};
        (tpl?.formSchema?.fields || []).forEach(f => {
            const el = document.getElementById(`phase_field_${phaseId}_${f.id}`);
            if (!el) return;
            if (f.type === 'attachment') {
                const file = el.files && el.files[0] ? el.files[0].name : null;
                if (file) submission[f.id] = file;
            } else {
                submission[f.id] = el.value;
            }
        });

        let score = null;
        let ruleScores = null;
        const isPhaseEval = (evaluation?.evaluationDimension || (evaluation?.phaseId ? 'phase' : 'department')) === 'phase';
        const mode = isPhaseEval ? 'manual' : (tpl?.scoringMode || 'manual');
        if (mode === 'manual') {
            const val = document.getElementById(`phase_score_${phaseId}`)?.value;
            score = val === '' || val === undefined ? null : Number(val);
        } else {
            const plan = API.getDepartmentPhasePlan(evaluation?.departmentId);
            const bindings = (plan?.phases || []).find(p => p.phaseId === phaseId)?.ruleBindings || [];
            ruleScores = bindings.map(b => ({
                ruleId: b.ruleId,
                score: document.getElementById(`phase_rule_${phaseId}_${b.ruleId}`)?.value,
            })).map(item => ({
                ruleId: item.ruleId,
                score: item.score === '' || item.score === undefined ? null : Number(item.score),
            })).filter(item => item.ruleId);
        }
        await API.saveEvaluationPhase(evaluationId, { phaseId, submission, score, ruleScores });
        this.renderEvaluationDetail(evaluationId);
    },

    async renderWarehouseDetail(id) {
        const warehouse = API.getWarehouseById(id);
        if (!warehouse) {
            this.renderWithLayout('<div class="container"><h1>数仓不存在</h1></div>', 'data-engineering');
            return;
        }
        const maskedPassword = warehouse.sourceConfig?.password ? '******' : '-';
        this.renderWithLayout(`
            <div class="container" style="max-width: 1100px;">
                <div class="back-link" onclick="Router.navigate('/warehouses')">← 返回数据工程</div>
                <div class="card">
                    <div class="page-header" style="margin-bottom: 12px;">
                        <div>
                            <h1 class="page-title" style="margin-bottom: 8px;">${warehouse.name}</h1>
                            <div style="color:#64748b;">${warehouse.fullName || warehouse.name}</div>
                        </div>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            ${warehouse.connectivityStatus ? API.getConnectivityBadge(warehouse.connectivityStatus) : '<span class="status-badge">预配置</span>'}
                            ${warehouse.onboardingStatus ? API.getOnboardingBadge(warehouse.onboardingStatus) : '<span class="status-badge status-success">ready</span>'}
                        </div>
                    </div>

                    <div class="overview-grid">
                        <div class="overview-card">
                            <div class="overview-card-value">${warehouse.dbCount || 0}</div>
                            <div class="overview-card-label">库数量</div>
                        </div>
                        <div class="overview-card">
                            <div class="overview-card-value">${warehouse.tableCount || 0}</div>
                            <div class="overview-card-label">表数量</div>
                        </div>
                        <div class="overview-card">
                            <div class="overview-card-value">${warehouse.owner || '-'}</div>
                            <div class="overview-card-label">负责人</div>
                        </div>
                        <div class="overview-card">
                            <div class="overview-card-value">${warehouse.deptName || '-'}</div>
                            <div class="overview-card-label">所属部门</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2 class="section-title">数据源配置摘要</h2>
                    ${warehouse.sourceConfig ? `
                        <div class="data-source-summary-grid">
                            <div class="data-source-summary-item"><span>数据源名称</span><strong>${warehouse.sourceConfig.name || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>数据源类型</span><strong>${warehouse.sourceConfig.type || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>主机</span><strong>${warehouse.sourceConfig.host || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>端口</span><strong>${warehouse.sourceConfig.port || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>数据库名</span><strong>${warehouse.sourceConfig.database || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>用户名</span><strong>${warehouse.sourceConfig.username || '-'}</strong></div>
                            <div class="data-source-summary-item"><span>密码</span><strong>${maskedPassword}</strong></div>
                        </div>
                    ` : `
                        <div style="color:#8c8c8c;">该数仓暂无数据源配置摘要，当前来源为系统预配置。</div>
                    `}
                </div>
            </div>
        `, 'data-engineering');
    },

    switchEvalRuleSetTab(tabId, el) {
        document.querySelectorAll('.dim-tab-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('[id^="eval_rule_tab_"]').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('eval_rule_tab_' + tabId)?.classList.add('active');
    },

    switchTab(tabId, el) {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('tab_' + tabId)?.classList.add('active');
    },

    async renderReportList() {
        const reports = await API.getReports();
        this.renderWithLayout(`
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">报告列表</h1>
                    <button class="btn btn-primary" onclick="Router.navigate('/reports/generate')">生成报告</button>
                </div>
                <div class="filter-bar">
                    <div class="filter-item">
                        <label>搜索</label>
                        <input type="text" class="input" placeholder="报告/数仓名称">
                    </div>
                </div>
                <div class="report-grid">
                    ${reports.map(r => `
                        <div class="report-card">
                            <div class="report-preview"><i class="fa-solid fa-chart-column" style="font-size: 52px;"></i></div>
                            <div class="report-info">
                                <div class="report-title">${r.title}</div>
                                <div class="report-meta">${r.warehouseName}</div>
                                <div class="report-meta">${this.formatDate(r.createdAt)}</div>
                                <div class="report-actions">
                                    <button class="btn btn-sm btn-primary" onclick="Router.navigate('/reports/${r.id}')">预览</button>
                                    <button class="btn btn-sm btn-default" onclick="API.downloadReport('${r.id}', 'pdf')">下载</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `, 'report-list');
    },

    async renderGenerateReport() {
        const evaluations = await API.getEvaluations();
        const completedEvals = evaluations.filter(e => e.status === 'completed');
        this.renderWithLayout(`
            <div class="container" style="max-width: 700px;">
                <h1 class="page-title" style="margin-bottom: 24px;">生成报告</h1>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label required">选择评估记录</label>
                        <select id="evalSelect">
                            <option value="">请选择</option>
                            ${completedEvals.map(e => `<option value="${e.id}">${e.warehouseName} - ${this.formatDate(e.startTime)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">报告模板</label>
                        <div class="radio-group">
                            <div class="radio-item"><input type="radio" name="template" value="standard" checked><label>标准模板</label></div>
                            <div class="radio-item"><input type="radio" name="template" value="full"><label>详版</label></div>
                            <div class="radio-item"><input type="radio" name="template" value="simple"><label>简版</label></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">包含章节</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item"><input type="checkbox" id="ch1" checked><label for="ch1">执行摘要</label></div>
                            <div class="checkbox-item"><input type="checkbox" id="ch2" checked><label for="ch2">评估详情</label></div>
                            <div class="checkbox-item"><input type="checkbox" id="ch3" checked><label for="ch3">问题清单</label></div>
                            <div class="checkbox-item"><input type="checkbox" id="ch4" checked><label for="ch4">改进建议</label></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">输出格式</label>
                        <div class="radio-group">
                            <div class="radio-item"><input type="radio" name="format" value="pdf" checked><label>PDF</label></div>
                            <div class="radio-item"><input type="radio" name="format" value="word"><label>Word</label></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button class="btn btn-default" onclick="Router.navigate('/reports')">取消</button>
                        <button class="btn btn-primary" onclick="App.submitReport()">生成报告</button>
                    </div>
                </div>
            </div>
        `, 'report-list');
    },

    async submitReport() {
        const evaluationId = document.getElementById('evalSelect')?.value;
        if (!evaluationId) {
            alert('请选择评估记录');
            return;
        }
        const newReport = await API.createReport({ evaluationId });
        Router.navigate(`/reports/${newReport.id}`);
    },

    async renderReportDetail(id) {
        const report = await API.getReport(id);
        const evaluation = report ? await API.getEvaluation(report.evaluationId) : null;
        if (!report) {
            this.renderWithLayout('<div class="container"><h1>报告不存在</h1></div>', 'report-list');
            return;
        }
        const allReports = await API.getReports();
        const relatedReports = allReports
            .filter(r => r.warehouseName === report.warehouseName)
            .sort((a, b) => {
                const eva = API.evaluations.find(e => e.id === a.evaluationId);
                const evb = API.evaluations.find(e => e.id === b.evaluationId);
                const ta = new Date(eva?.startTime || a.createdAt).getTime();
                const tb = new Date(evb?.startTime || b.createdAt).getTime();
                return tb - ta;
            });
        const phaseTemplates = await API.getPhaseTemplates();
        const phaseRows = (evaluation?.phaseScores || []).map(item => {
            const tpl = phaseTemplates.find(t => t.id === item.phaseId);
            const modeText = (tpl?.scoringMode || item.scoringMode) === 'rules_avg' ? '规则均分' : '手工录入';
            return { name: tpl?.name || item.phaseId, mode: modeText, score: item.score ?? '-' };
        });
        const ruleSets = API.ruleSets || [];
        const ruleRows = ruleSets.flatMap(rs => {
            const dimScore = evaluation?.dimensionScores?.[rs.id]?.score;
            const rules = API.rules[rs.id] || [];
            return rules.map(rule => {
                let scoreText = '-';
                if (dimScore !== null && dimScore !== undefined) {
                    const seed = (rule.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
                    const offset = (seed % 9) - 4;
                    scoreText = String(Math.max(0, Math.min(100, Math.round(dimScore + offset))));
                }
                return { name: rule.name, ruleSet: rs.name, weight: rule.weight, score: scoreText };
            });
        });
        const issueRows = evaluation?.issues || [];
        const issueLabelMap = { high: '高', medium: '中', low: '低' };
        this.renderWithLayout(`
            <div class="container" style="max-width: 1100px;">
                <div style="background: #fff; padding: 12px 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="back-link" onclick="Router.navigate('/reports')">← 返回列表</div>
                        ${relatedReports.length > 1 ? `
                            <select class="input" style="width: 300px;" onchange="App.switchReport(this.value)">
                                ${relatedReports.map(item => {
                                    const evalItem = API.evaluations.find(e => e.id === item.evaluationId);
                                    const timeText = this.formatDate(evalItem?.startTime || item.createdAt);
                                    return `<option value="${item.id}" ${item.id === report.id ? 'selected' : ''}>${timeText}</option>`;
                                }).join('')}
                            </select>
                        ` : ''}
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-default" onclick="API.downloadReport('${report.id}', 'pdf')">下载 PDF</button>
                        <button class="btn btn-default" onclick="API.downloadReport('${report.id}', 'docx')">下载 Word</button>
                    </div>
                </div>

                <div class="card">
                    <div style="text-align:center; margin-bottom: 24px;">
                        <h1 style="font-size: 30px; margin-bottom: 10px;">${report.title}</h1>
                    </div>

                    <div class="report-section">
                        <h2 class="report-section-title">综述</h2>
                        <p style="font-size: 15px; line-height: 1.8; color: #334155;">
                            在 ${this.formatDate(evaluation?.startTime)} 完成 ${report.warehouseName} 的评估，
                            总评分 ${evaluation?.score ?? '-'} 分，${evaluation?.grade || '-'} 等级，
                            总共发现 ${issueRows.length} 个问题。
                        </p>
                    </div>

                    <div class="report-section">
                        <h2 class="report-section-title">评估阶段</h2>
                        ${phaseRows.length ? `
                            <table class="issue-table">
                                <thead>
                                    <tr>
                                        <th>阶段</th>
                                        <th style="width: 160px;">得分模式</th>
                                        <th style="width: 120px;">得分</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${phaseRows.map(row => `
                                        <tr>
                                            <td>${row.name}</td>
                                            <td>${row.mode}</td>
                                            <td>${row.score}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `<div style="color:#8c8c8c;">暂无阶段数据</div>`}
                    </div>

                    <div class="report-section">
                        <h2 class="report-section-title">评估规则</h2>
                        <table class="issue-table">
                            <thead>
                                <tr>
                                    <th>评估规则名称</th>
                                    <th style="width: 200px;">所属规则集</th>
                                    <th style="width: 120px;">权重</th>
                                    <th style="width: 120px;">得分</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ruleRows.map(row => `
                                    <tr>
                                        <td>${row.name}</td>
                                        <td>${row.ruleSet}</td>
                                        <td>${row.weight}</td>
                                        <td>${row.score}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="report-section">
                        <h2 class="report-section-title">问题清单</h2>
                        <table class="issue-table">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">序号</th>
                                    <th>所属规则</th>
                                    <th>问题描述</th>
                                    <th style="width: 120px;">严重度</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${issueRows.length > 0 ? issueRows.map((item, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td>${item.rule}</td>
                                        <td>${item.description || '-'}</td>
                                        <td>${issueLabelMap[item.severity] || '-'}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="4" class="table-empty-cell">暂无问题</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `, 'report-list');
    },

    switchReport(reportId) {
        if (!reportId) return;
        Router.navigate(`/reports/${reportId}`);
    },

    renderDashboard() {
        this.renderDashboardWithLayout(`
            <div class="dashboard-shell">
                <iframe
                    class="dashboard-iframe"
                    src="src/dashboard/index.html"
                    title="综合大屏"
                    loading="lazy"
                ></iframe>
            </div>
        `);
    },
};

App.init();
