const API = {
    warehouses: [
        {
            id: 'hf',
            city: '合肥市',
            departments: [
                {
                    id: 'hf_czj',
                    name: '财政厅',
                    warehouses: [
                        { id: 'wh1', name: '财政收支数据仓库', lastScore: 85, grade: 'B', dbCount: 12, tableCount: 256, owner: '张三' },
                        { id: 'wh2', name: '预算管理数据仓库', lastScore: 92, grade: 'A', dbCount: 8, tableCount: 168, owner: '李四' },
                    ]
                },
                {
                    id: 'hf_ggj',
                    name: '公安厅',
                    warehouses: [
                        { id: 'wh3', name: '治安管理数据仓库', lastScore: 72, grade: 'C', dbCount: 15, tableCount: 312, owner: '王五' },
                        { id: 'wh4', name: '交通管理数据仓库', lastScore: 78, grade: 'C', dbCount: 10, tableCount: 198, owner: '赵六' },
                    ]
                },
                {
                    id: 'hf_jtj',
                    name: '交通厅',
                    warehouses: [
                        { id: 'wh5', name: '公路运输数据仓库', lastScore: 88, grade: 'B', dbCount: 6, tableCount: 124, owner: '孙七' },
                    ]
                },
            ]
        },
        {
            id: 'wuhu',
            city: '芜湖市',
            departments: [
                {
                    id: 'wuhu_czj',
                    name: '财政局',
                    warehouses: [
                        { id: 'wh6', name: '芜湖财政数据仓库', lastScore: 91, grade: 'A', dbCount: 9, tableCount: 176, owner: '周八' },
                    ]
                },
                {
                    id: 'wuhu_ghj',
                    name: '规划局',
                    warehouses: [
                        { id: 'wh7', name: '城市规划数据仓库', lastScore: 87, grade: 'B', dbCount: 11, tableCount: 215, owner: '吴九' },
                        { id: 'wh8', name: '国土资源数据仓库', lastScore: 83, grade: 'B', dbCount: 7, tableCount: 142, owner: '郑十' },
                    ]
                },
            ]
        },
        {
            id: 'bengbu',
            city: '蚌埠市',
            departments: [
                {
                    id: 'bengbu_swj',
                    name: '商务局',
                    warehouses: [
                        { id: 'wh9', name: '商贸流通数据仓库', lastScore: 79, grade: 'C', dbCount: 8, tableCount: 156, owner: '陈一' },
                    ]
                },
                {
                    id: 'bengbu_nyj',
                    name: '农业局',
                    warehouses: [
                        { id: 'wh10', name: '农业农村数据仓库', lastScore: 84, grade: 'B', dbCount: 10, tableCount: 189, owner: '林二' },
                    ]
                },
            ]
        },
        {
            id: 'huainan',
            city: '淮南市',
            departments: [
                {
                    id: 'huainan_mtj',
                    name: '煤炭局',
                    warehouses: [
                        { id: 'wh11', name: '煤炭生产数据仓库', lastScore: 76, grade: 'C', dbCount: 14, tableCount: 267, owner: '黄三' },
                    ]
                },
            ]
        },
        {
            id: 'maanshan',
            city: '马鞍山市',
            departments: [
                {
                    id: 'maanshan_gtj',
                    name: '钢铁局',
                    warehouses: [
                        { id: 'wh12', name: '钢铁产业数据仓库', lastScore: 89, grade: 'B', dbCount: 11, tableCount: 203, owner: '杨四' },
                    ]
                },
            ]
        },
        {
            id: 'huaibei',
            city: '淮北市',
            departments: [
                {
                    id: 'huaibei_mtj',
                    name: '煤炭局',
                    warehouses: [
                        { id: 'wh13', name: '淮北矿业数据仓库', lastScore: 81, grade: 'B', dbCount: 9, tableCount: 168, owner: '朱五' },
                    ]
                },
            ]
        },
        {
            id: 'tongling',
            city: '铜陵市',
            departments: [
                {
                    id: 'tongling_ysj',
                    name: '有色局',
                    warehouses: [
                        { id: 'wh14', name: '有色金属数据仓库', lastScore: 90, grade: 'A', dbCount: 8, tableCount: 154, owner: '何六' },
                    ]
                },
            ]
        },
        {
            id: 'anqing',
            city: '安庆市',
            departments: [
                {
                    id: 'anqing_lyj',
                    name: '林业局',
                    warehouses: [
                        { id: 'wh15', name: '林业资源数据仓库', lastScore: 86, grade: 'B', dbCount: 7, tableCount: 132, owner: '罗七' },
                    ]
                },
            ]
        },
    ],

    departments: [
        { id: 'dept_finance', name: '财政厅', description: '财政资金收支与预算管理', code: 'FIN', owner: '钱一' },
        { id: 'dept_police', name: '公安厅', description: '社会治安与交通管理', code: 'PSB', owner: '王五' },
        { id: 'dept_transport', name: '交通厅', description: '综合交通运输与路网运营', code: 'TRA', owner: '孙七' },
        { id: 'dept_planning', name: '规划局', description: '国土空间规划与城市治理', code: 'PLN', owner: '沈二' },
        { id: 'dept_business', name: '商务局', description: '商贸流通与招商引资', code: 'BUS', owner: '陈一' },
        { id: 'dept_agriculture', name: '农业局', description: '农业农村与产业发展', code: 'AGR', owner: '林二' },
        { id: 'dept_energy', name: '煤炭局', description: '能源与矿业安全生产', code: 'ENG', owner: '黄三' },
        { id: 'dept_metallurgy', name: '钢铁局', description: '钢铁产业与制造升级', code: 'MET', owner: '杨四' },
        { id: 'dept_nonferrous', name: '有色局', description: '有色金属与资源管理', code: 'NFM', owner: '何六' },
        { id: 'dept_forestry', name: '林业局', description: '生态保护与森林资源', code: 'FOR', owner: '罗七' },
    ],

    sourceTypes: [
        { value: 'mysql', label: 'MySQL' },
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'oracle', label: 'Oracle' },
        { value: 'sqlserver', label: 'SQL Server' },
    ],

    managedWarehouses: [
        {
            id: 'mwh1',
            name: '省级财政共享数仓',
            fullName: '省级 - 财政厅 - 省级财政共享数仓',
            cityId: 'province',
            cityName: '省级',
            deptId: 'dept_finance',
            deptName: '财政厅',
            owner: '钱一',
            dbCount: 9,
            tableCount: 188,
            lastScore: null,
            grade: null,
            connectivityStatus: 'connected',
            onboardingStatus: 'ready',
            sourceConfig: {
                name: '财政共享库',
                type: 'mysql',
                host: '10.10.8.12',
                port: '3306',
                database: 'finance_dw',
                username: 'finance_reader',
                password: '******',
            },
        },
        {
            id: 'mwh2',
            name: '省级规划专题数仓',
            fullName: '省级 - 规划局 - 省级规划专题数仓',
            cityId: 'province',
            cityName: '省级',
            deptId: 'dept_planning',
            deptName: '规划局',
            owner: '沈二',
            dbCount: 6,
            tableCount: 132,
            lastScore: null,
            grade: null,
            connectivityStatus: 'connected',
            onboardingStatus: 'ready',
            sourceConfig: {
                name: '规划专题库',
                type: 'postgresql',
                host: '10.10.11.20',
                port: '5432',
                database: 'planning_dw',
                username: 'planning_user',
                password: '******',
            },
        },
    ],

    dimensions: [
        { id: 'engineering', name: '数据工程实施指南' },
        { id: 'governance', name: '数据治理方法论' },
        { id: 'quality', name: '数据质量' },
        { id: 'security', name: '数据安全' },
    ],

    ruleSets: [
        { id: 'engineering', name: '数据工程实施指南', icon: '⚙️' },
        { id: 'security', name: '数据安全', icon: '🔒' },
        { id: 'quality', name: '数据质量', icon: '✅' },
        { id: 'governance', name: '数据治理方法论', icon: '📋' },
    ],

    rules: {
        engineering: [
            { id: 'r1', name: '架构设计合理性', dimension: '数据工程实施指南', weight: 15 },
            { id: 'r2', name: '数据建模规范性', dimension: '数据工程实施指南', weight: 20 },
            { id: 'r3', name: 'ETL流程完整性', dimension: '数据工程实施指南', weight: 25 },
            { id: 'r4', name: '任务调度可靠性', dimension: '数据工程实施指南', weight: 15 },
            { id: 'r5', name: '性能优化措施', dimension: '数据工程实施指南', weight: 15 },
            { id: 'r6', name: '文档完整性', dimension: '数据工程实施指南', weight: 10 },
        ],
        security: [
            { id: 'r7', name: '访问控制机制', dimension: '数据安全', weight: 25 },
            { id: 'r8', name: '数据加密覆盖率', dimension: '数据安全', weight: 25 },
            { id: 'r9', name: '审计日志完整性', dimension: '数据安全', weight: 20 },
            { id: 'r10', name: '敏感数据脱敏', dimension: '数据安全', weight: 20 },
            { id: 'r11', name: '安全漏洞修复', dimension: '数据安全', weight: 10 },
        ],
        quality: [
            { id: 'r12', name: '数据完整性', dimension: '数据质量', weight: 25 },
            { id: 'r13', name: '数据准确性', dimension: '数据质量', weight: 25 },
            { id: 'r14', name: '数据一致性', dimension: '数据质量', weight: 20 },
            { id: 'r15', name: '数据及时性', dimension: '数据质量', weight: 20 },
            { id: 'r16', name: '数据唯一性', dimension: '数据质量', weight: 10 },
        ],
        governance: [
            { id: 'r17', name: '数据标准体系', dimension: '数据治理方法论', weight: 20 },
            { id: 'r18', name: '元数据管理', dimension: '数据治理方法论', weight: 20 },
            { id: 'r19', name: '数据血缘追踪', dimension: '数据治理方法论', weight: 20 },
            { id: 'r20', name: '数据资产管理', dimension: '数据治理方法论', weight: 15 },
            { id: 'r21', name: '组织架构完善', dimension: '数据治理方法论', weight: 15 },
            { id: 'r22', name: '制度流程建设', dimension: '数据治理方法论', weight: 10 },
        ],
    },

    gradeLevels: [
        { grade: 'A', minScore: 90, maxScore: 100, color: '#52c41a', desc: '优秀' },
        { grade: 'B', minScore: 80, maxScore: 89, color: '#1890ff', desc: '良好' },
        { grade: 'C', minScore: 60, maxScore: 79, color: '#faad14', desc: '合格' },
        { grade: 'D', minScore: 0, maxScore: 59, color: '#ff4d4f', desc: '待改进' },
    ],

    phaseTemplates: [
        {
            id: 'phase_research',
            name: '调研阶段',
            description: '梳理业务场景、盘点数据资产与需求边界。',
            scoringMode: 'manual',
            formSchema: {
                fields: [
                    { id: 'field_scope', type: 'text', label: '调研范围说明', required: true },
                    { id: 'field_method', type: 'select', label: '调研方式', required: true, options: [
                        { label: '访谈', value: 'interview' },
                        { label: '问卷', value: 'survey' },
                        { label: '资料分析', value: 'doc' },
                    ]},
                    { id: 'field_attachment', type: 'attachment', label: '调研材料附件', required: false },
                ],
            },
        },
        {
            id: 'phase_implementation',
            name: '实施阶段',
            description: '数据建模、ETL、调度、治理落地与质量验证。',
            scoringMode: 'rules_avg',
            formSchema: {
                fields: [
                    { id: 'field_arch', type: 'text', label: '实施要点摘要', required: true },
                    { id: 'field_tooling', type: 'select', label: '实施工具链', required: false, options: [
                        { label: '自研', value: 'custom' },
                        { label: '开源', value: 'oss' },
                        { label: '商业化', value: 'commercial' },
                    ]},
                    { id: 'field_attachment', type: 'attachment', label: '实施产物附件', required: false },
                ],
            },
        },
        {
            id: 'phase_demo',
            name: '演示阶段',
            description: '验收演示、指标展示与问题复盘。',
            scoringMode: 'rules_avg',
            formSchema: {
                fields: [
                    { id: 'field_story', type: 'text', label: '演示脚本要点', required: true },
                    { id: 'field_audience', type: 'select', label: '演示对象', required: true, options: [
                        { label: '业务处室', value: 'biz' },
                        { label: '主管领导', value: 'leader' },
                        { label: '多部门联合', value: 'multi' },
                    ]},
                    { id: 'field_attachment', type: 'attachment', label: '演示材料附件', required: false },
                ],
            },
        },
    ],

    phaseRules: [
        { id: 'pr_01', name: '阶段交付物完整性', description: '交付物是否齐全，证据是否可追溯。', category: '交付质量', enabled: true },
        { id: 'pr_02', name: '过程合规性', description: '流程与制度执行情况，审批留痕是否完整。', category: '过程管控', enabled: true },
        { id: 'pr_03', name: '数据建模规范性', description: '主题域划分、维度事实设计与命名规范。', category: '技术实施', enabled: true },
        { id: 'pr_04', name: 'ETL链路稳定性', description: '调度可靠性、失败重跑、延迟与告警。', category: '技术实施', enabled: true },
        { id: 'pr_05', name: '质量校验覆盖率', description: '质量规则覆盖、抽检与问题闭环。', category: '交付质量', enabled: true },
        { id: 'pr_06', name: '安全策略落实', description: '访问控制、脱敏、审计与最小权限。', category: '安全合规', enabled: true },
        { id: 'pr_07', name: '演示可用性', description: '演示流程顺畅，指标口径清晰，查询性能良好。', category: '交付质量', enabled: true },
        { id: 'pr_08', name: '问题整改闭环', description: '问题记录、分级、整改与复核闭环。', category: '过程管控', enabled: true },
    ],

    departmentPhasePlans: {
        dept_finance: {
            departmentId: 'dept_finance',
            phases: [
                { phaseId: 'phase_research', order: 1 },
                { phaseId: 'phase_implementation', order: 2, ruleBindings: [{ ruleId: 'pr_01' }, { ruleId: 'pr_03' }, { ruleId: 'pr_04' }] },
                { phaseId: 'phase_demo', order: 3, ruleBindings: [{ ruleId: 'pr_01' }, { ruleId: 'pr_07' }, { ruleId: 'pr_08' }] },
            ],
        },
        dept_planning: {
            departmentId: 'dept_planning',
            phases: [
                { phaseId: 'phase_research', order: 1 },
                { phaseId: 'phase_demo', order: 2, ruleBindings: [{ ruleId: 'pr_01' }, { ruleId: 'pr_07' }] },
            ],
        },
        dept_business: {
            departmentId: 'dept_business',
            phases: [
                { phaseId: 'phase_research', order: 1 },
            ],
        },
    },

    evaluations: [
        {
            id: 'eval1',
            warehouseId: 'wh1',
            warehouseName: '合肥市 - 财政厅 - 财政收支数据仓库',
            status: 'completed',
            score: 85,
            grade: 'B',
            startTime: '2026-03-13T10:30:00',
            endTime: '2026-03-13T11:00:00',
            dimensionScores: {
                engineering: { score: 90, subDimensions: [
                    { name: '架构设计', score: 92, status: 'normal' },
                    { name: '数据建模', score: 88, status: 'normal' },
                    { name: 'ETL流程', score: 86, status: 'warning' },
                ]},
                governance: { score: 75, subDimensions: [
                    { name: '数据标准', score: 70, status: 'issue' },
                    { name: '元数据管理', score: 80, status: 'warning' },
                ]},
                quality: { score: 88, subDimensions: [
                    { name: '完整性', score: 90, status: 'normal' },
                    { name: '准确性', score: 86, status: 'normal' },
                ]},
                security: { score: 82, subDimensions: [
                    { name: '访问控制', score: 85, status: 'normal' },
                    { name: '数据加密', score: 78, status: 'warning' },
                ]},
            },
            issues: [
                { rule: '数据标准完整性', severity: 'high', description: '缺少行业标准数据字典', suggestion: '参考国家标准建立数据字典' },
                { rule: 'ETL作业监控', severity: 'medium', description: '部分作业缺少告警机制', suggestion: '完善监控告警体系' },
                { rule: '数据加密覆盖率', severity: 'low', description: '敏感字段加密率78%', suggestion: '提升至95%以上' },
            ],
        },
        {
            id: 'eval2',
            warehouseId: 'wh3',
            warehouseName: '合肥市 - 公安厅 - 治安管理数据仓库',
            status: 'completed',
            score: 72,
            grade: 'C',
            startTime: '2026-03-12T15:20:00',
            endTime: '2026-03-12T15:50:00',
            dimensionScores: {
                engineering: { score: 75, subDimensions: [
                    { name: '架构设计', score: 72, status: 'warning' },
                    { name: '数据建模', score: 78, status: 'normal' },
                    { name: 'ETL流程', score: 70, status: 'issue' },
                ]},
                governance: { score: 68, subDimensions: [
                    { name: '数据标准', score: 65, status: 'issue' },
                    { name: '元数据管理', score: 70, status: 'warning' },
                ]},
                quality: { score: 70, subDimensions: [
                    { name: '完整性', score: 68, status: 'warning' },
                    { name: '准确性', score: 72, status: 'normal' },
                ]},
                security: { score: 76, subDimensions: [
                    { name: '访问控制', score: 78, status: 'normal' },
                    { name: '数据加密', score: 73, status: 'warning' },
                ]},
            },
            issues: [
                { rule: '架构可扩展性', severity: 'high', description: '当前架构无法支撑未来2年数据增长', suggestion: '考虑引入分布式存储和计算框架' },
                { rule: '数据标准统一性', severity: 'high', description: '各业务系统数据标准不统一', suggestion: '建立企业级数据标准体系' },
                { rule: 'ETL任务调度', severity: 'medium', description: '任务依赖关系不清晰，偶发死锁', suggestion: '引入专业的调度工具，完善依赖管理' },
                { rule: '数据质量监控', severity: 'medium', description: '缺少数据质量监控指标体系', suggestion: '建立数据质量SLA和监控机制' },
                { rule: '敏感数据脱敏', severity: 'low', description: '部分测试环境存在未脱敏数据', suggestion: '完善数据脱敏流程和检查机制' },
            ],
        },
        {
            id: 'eval3',
            warehouseId: 'wh6',
            warehouseName: '芜湖市 - 财政局 - 芜湖财政数据仓库',
            status: 'in_progress',
            score: null,
            grade: null,
            startTime: '2026-03-12T09:00:00',
            endTime: null,
            progress: 65,
            dimensionScores: {},
            issues: [],
        },
        {
            id: 'eval4',
            warehouseId: 'wh7',
            warehouseName: '芜湖市 - 规划局 - 城市规划数据仓库',
            status: 'completed',
            score: 91,
            grade: 'A',
            startTime: '2026-03-11T10:00:00',
            endTime: '2026-03-11T10:40:00',
            dimensionScores: {
                engineering: { score: 94, subDimensions: [
                    { name: '架构设计', score: 96, status: 'normal' },
                    { name: '数据建模', score: 92, status: 'normal' },
                    { name: 'ETL流程', score: 93, status: 'normal' },
                ]},
                governance: { score: 89, subDimensions: [
                    { name: '数据标准', score: 88, status: 'normal' },
                    { name: '元数据管理', score: 90, status: 'normal' },
                ]},
                quality: { score: 92, subDimensions: [
                    { name: '完整性', score: 94, status: 'normal' },
                    { name: '准确性', score: 90, status: 'normal' },
                ]},
                security: { score: 88, subDimensions: [
                    { name: '访问控制', score: 90, status: 'normal' },
                    { name: '数据加密', score: 86, status: 'normal' },
                ]},
            },
            issues: [
                { rule: '元数据更新频率', severity: 'low', description: '部分业务元数据更新延迟', suggestion: '优化元数据采集任务频率' },
            ],
        },
        {
            id: 'eval5',
            warehouseId: 'wh9',
            warehouseName: '蚌埠市 - 商务局 - 商贸流通数据仓库',
            status: 'completed',
            score: 78,
            grade: 'C',
            startTime: '2026-03-10T14:00:00',
            endTime: '2026-03-10T14:35:00',
            dimensionScores: {
                engineering: { score: 80, subDimensions: [
                    { name: '架构设计', score: 82, status: 'normal' },
                    { name: '数据建模', score: 78, status: 'warning' },
                    { name: 'ETL流程', score: 79, status: 'warning' },
                ]},
                governance: { score: 75, subDimensions: [
                    { name: '数据标准', score: 72, status: 'warning' },
                    { name: '元数据管理', score: 78, status: 'warning' },
                ]},
                quality: { score: 79, subDimensions: [
                    { name: '完整性', score: 80, status: 'normal' },
                    { name: '准确性', score: 77, status: 'warning' },
                ]},
                security: { score: 77, subDimensions: [
                    { name: '访问控制', score: 78, status: 'warning' },
                    { name: '数据加密', score: 76, status: 'warning' },
                ]},
            },
            issues: [
                { rule: '维度建模规范', severity: 'medium', description: '部分事实表缺少一致性维度', suggestion: '按照星型模型重构核心表结构' },
                { rule: '数据血缘追踪', severity: 'medium', description: '缺少完整的数据血缘图谱', suggestion: '引入数据血缘管理工具' },
                { rule: '权限审计日志', severity: 'low', description: '操作审计日志保留期不足', suggestion: '将审计日志保留期延长至1年' },
            ],
        },
        {
            id: 'eval6',
            warehouseId: 'wh2',
            warehouseName: '合肥市 - 财政厅 - 预算管理数据仓库',
            status: 'completed',
            score: 93,
            grade: 'A',
            startTime: '2026-03-14T09:10:00',
            endTime: '2026-03-14T09:42:00',
            dimensionScores: {
                engineering: { score: 95, subDimensions: [] },
                governance: { score: 90, subDimensions: [] },
                quality: { score: 94, subDimensions: [] },
                security: { score: 91, subDimensions: [] },
            },
            issues: [
                { rule: 'ETL作业监控', severity: 'high', description: '关键链路阈值设置偏宽', suggestion: '按链路等级重新设定阈值' },
            ],
        },
        {
            id: 'eval7',
            warehouseId: 'wh12',
            warehouseName: '马鞍山市 - 钢铁局 - 钢铁产业数据仓库',
            status: 'completed',
            score: 76,
            grade: 'C',
            startTime: '2026-03-14T14:00:00',
            endTime: '2026-03-14T14:35:00',
            dimensionScores: {
                engineering: { score: 78, subDimensions: [] },
                governance: { score: 72, subDimensions: [] },
                quality: { score: 77, subDimensions: [] },
                security: { score: 74, subDimensions: [] },
            },
            issues: [
                { rule: '数据标准统一性', severity: 'high', description: '关键指标命名与省标不一致', suggestion: '统一字段与指标命名规范' },
                { rule: '权限审计日志', severity: 'medium', description: '关键表访问审计不完整', suggestion: '补齐关键表审计策略' },
            ],
        },
        {
            id: 'eval8',
            warehouseId: 'wh14',
            warehouseName: '铜陵市 - 有色局 - 有色金属数据仓库',
            status: 'completed',
            score: 87,
            grade: 'B',
            startTime: '2026-03-15T10:20:00',
            endTime: '2026-03-15T10:55:00',
            dimensionScores: {
                engineering: { score: 89, subDimensions: [] },
                governance: { score: 84, subDimensions: [] },
                quality: { score: 88, subDimensions: [] },
                security: { score: 86, subDimensions: [] },
            },
            issues: [
                { rule: '数据标准完整性', severity: 'high', description: '主数据字典存在缺失项', suggestion: '补齐主数据字典并建立校验任务' },
            ],
        },
        {
            id: 'eval9',
            warehouseId: 'wh3',
            warehouseName: '合肥市 - 公安厅 - 治安管理数据仓库',
            status: 'completed',
            score: 84,
            grade: 'B',
            startTime: '2026-03-15T16:05:00',
            endTime: '2026-03-15T16:42:00',
            dimensionScores: {
                engineering: { score: 86, subDimensions: [] },
                governance: { score: 79, subDimensions: [] },
                quality: { score: 85, subDimensions: [] },
                security: { score: 83, subDimensions: [] },
            },
            issues: [
                { rule: 'ETL作业监控', severity: 'high', description: '夜间任务偶发延迟', suggestion: '增加作业前置检查并优化资源分配' },
                { rule: '数据质量监控', severity: 'medium', description: '部分质量规则误报偏高', suggestion: '优化规则阈值和分级策略' },
            ],
        },
        {
            id: 'eval10',
            warehouseId: 'wh14',
            warehouseName: '铜陵市 - 有色局 - 有色金属数据仓库',
            status: 'completed',
            score: 74,
            grade: 'C',
            startTime: '2026-03-15T17:10:00',
            endTime: '2026-03-15T17:48:00',
            dimensionScores: {
                engineering: { score: 76, subDimensions: [] },
                governance: { score: 70, subDimensions: [] },
                quality: { score: 75, subDimensions: [] },
                security: { score: 73, subDimensions: [] },
            },
            issues: [
                { rule: '数据标准完整性', severity: 'high', description: '核心主题域标准字段缺失', suggestion: '补齐标准字段并校验历史数据' },
                { rule: '权限审计日志', severity: 'medium', description: '高敏表审计策略未完全覆盖', suggestion: '扩大审计范围并按月复核' },
            ],
        },
    ],

    reports: [
        {
            id: 'report1',
            title: '合肥市财政厅财政收支数据仓库评估报告',
            warehouseName: '合肥市 - 财政厅 - 财政收支数据仓库',
            evaluationId: 'eval1',
            createdAt: '2026-03-13T11:30:00',
            version: '1.0',
        },
        {
            id: 'report2',
            title: '合肥市公安厅治安管理数据仓库评估报告',
            warehouseName: '合肥市 - 公安厅 - 治安管理数据仓库',
            evaluationId: 'eval2',
            createdAt: '2026-03-12T16:30:00',
            version: '1.0',
        },
        {
            id: 'report3',
            title: '芜湖市规划局城市规划数据仓库评估报告',
            warehouseName: '芜湖市 - 规划局 - 城市规划数据仓库',
            evaluationId: 'eval4',
            createdAt: '2026-03-11T11:00:00',
            version: '1.0',
        },
        {
            id: 'report4',
            title: '蚌埠市商务局商贸流通数据仓库评估报告',
            warehouseName: '蚌埠市 - 商务局 - 商贸流通数据仓库',
            evaluationId: 'eval5',
            createdAt: '2026-03-10T15:00:00',
            version: '1.2',
        },
        {
            id: 'report5',
            title: '合肥市财政厅预算管理数据仓库评估报告',
            warehouseName: '合肥市 - 财政厅 - 预算管理数据仓库',
            evaluationId: 'eval6',
            createdAt: '2026-03-14T10:10:00',
            version: '1.0',
        },
        {
            id: 'report6',
            title: '马鞍山市钢铁局钢铁产业数据仓库评估报告',
            warehouseName: '马鞍山市 - 钢铁局 - 钢铁产业数据仓库',
            evaluationId: 'eval7',
            createdAt: '2026-03-14T15:00:00',
            version: '1.0',
        },
        {
            id: 'report7',
            title: '合肥市公安厅治安管理数据仓库评估报告（复评）',
            warehouseName: '合肥市 - 公安厅 - 治安管理数据仓库',
            evaluationId: 'eval9',
            createdAt: '2026-03-15T17:05:00',
            version: '1.1',
        },
    ],

    dashboardMetrics: {
        totalEvaluations: 1234,
        avgScore: 82.5,
        avgScoreTrend: 'up',
        excellentRate: 35,
        pendingImprovements: 12,
        newThisMonth: 45,
        newThisMonthChange: '+12%',
        regions: [
            { name: '合肥', avgScore: 85, evaluationCount: 156 },
            { name: '芜湖', avgScore: 82, evaluationCount: 142 },
            { name: '蚌埠', avgScore: 80, evaluationCount: 189 },
            { name: '淮南', avgScore: 84, evaluationCount: 134 },
            { name: '马鞍山', avgScore: 81, evaluationCount: 121 },
            { name: '淮北', avgScore: 79, evaluationCount: 108 },
            { name: '铜陵', avgScore: 78, evaluationCount: 96 },
            { name: '安庆', avgScore: 83, evaluationCount: 88 },
        ],
        scoreTrend: [
            { month: '2025-10', score: 78.5 },
            { month: '2025-11', score: 79.2 },
            { month: '2025-12', score: 80.1 },
            { month: '2026-01', score: 81.0 },
            { month: '2026-02', score: 81.8 },
            { month: '2026-03', score: 82.5 },
        ],
        dimensionScores: {
            engineering: 84,
            governance: 79,
            quality: 83,
            security: 82,
        },
        topWarehouses: [
            { rank: 1, name: '芜湖市规划局城市规划数据仓库', score: 95 },
            { rank: 2, name: '合肥市财政厅预算管理数据仓库', score: 92 },
            { rank: 3, name: '合肥市公安厅交通管理数据仓库', score: 90 },
            { rank: 4, name: '蚌埠市农业局农业农村数据仓库', score: 89 },
            { rank: 5, name: '安庆市林业局林业资源数据仓库', score: 88 },
            { rank: 6, name: '芜湖市规划局国土资源数据仓库', score: 87 },
            { rank: 7, name: '马鞍山市钢铁局钢铁产业数据仓库', score: 86 },
            { rank: 8, name: '合肥市交通厅公路运输数据仓库', score: 85 },
            { rank: 9, name: '淮北市煤炭局淮北矿业数据仓库', score: 84 },
            { rank: 10, name: '铜陵市有色局有色金属数据仓库', score: 83 },
        ],
        highPriorityIssues: [
            { id: 1, description: '数据标准缺失', regionCount: 3 },
            { id: 2, description: 'ETL监控不完善', regionCount: 2 },
            { id: 3, description: '敏感数据加密不足', regionCount: 4 },
            { id: 4, description: '元数据管理不规范', regionCount: 2 },
        ],
    },

    async getWarehouses() {
        return this.warehouses;
    },

    async getDepartments() {
        return this.departments;
    },

    async createDepartment(data) {
        const name = String(data?.name || '').trim();
        const description = String(data?.description || '').trim();
        const code = String(data?.code || '').trim();
        const owner = String(data?.owner || '').trim();
        if (!name || !code || !owner) {
            return { success: false, message: '请完整填写部门名称、编码与负责人' };
        }
        if (this.departments.some(d => String(d.code || '').toLowerCase() === code.toLowerCase())) {
            return { success: false, message: '部门编码已存在，请更换后重试' };
        }
        const id = `dept_${code.toLowerCase()}_${Date.now()}`;
        const newDept = { id, name, description, code, owner };
        this.departments.unshift(newDept);
        if (!this.departmentPhasePlans[id]) {
            this.departmentPhasePlans[id] = { departmentId: id, phases: [] };
        }
        return { success: true, department: newDept };
    },

    async updateDepartment(deptId, data) {
        const dept = this.departments.find(d => d.id === deptId);
        if (!dept) return { success: false, message: '部门不存在' };
        const name = String(data?.name || '').trim();
        const description = String(data?.description || '').trim();
        const code = String(data?.code || '').trim();
        const owner = String(data?.owner || '').trim();
        if (!name || !code || !owner) {
            return { success: false, message: '请完整填写部门名称、编码与负责人' };
        }
        if (this.departments.some(d => d.id !== deptId && String(d.code || '').toLowerCase() === code.toLowerCase())) {
            return { success: false, message: '部门编码已存在，请更换后重试' };
        }
        dept.name = name;
        dept.description = description;
        dept.code = code;
        dept.owner = owner;
        return { success: true, department: dept };
    },

    async deleteDepartment(deptId) {
        const dept = this.departments.find(d => d.id === deptId);
        if (!dept) return { success: false, message: '部门不存在' };
        const usedByManagedWarehouse = (this.managedWarehouses || []).some(w => w.deptId === deptId);
        const usedByEvaluation = (this.evaluations || []).some(e => e.departmentId === deptId);
        if (usedByManagedWarehouse || usedByEvaluation) {
            return { success: false, message: '该部门已被数仓或评估记录使用，无法删除' };
        }
        this.departments = this.departments.filter(d => d.id !== deptId);
        if (this.departmentPhasePlans?.[deptId]) delete this.departmentPhasePlans[deptId];
        return { success: true };
    },

    async getSourceTypes() {
        return this.sourceTypes;
    },

    getConnectivityBadge(status) {
        const map = {
            connected: '<span class="status-badge status-success">连通正常</span>',
            disconnected: '<span class="status-badge status-error">连通失败</span>',
        };
        return map[status] || '<span class="status-badge">待测试</span>';
    },

    getOnboardingBadge(status) {
        const map = {
            bind_pending: '<span class="status-badge status-warning">待关联部门</span>',
            ready: '<span class="status-badge status-success">可评估</span>',
            created: '<span class="status-badge status-info">已创建</span>',
        };
        return map[status] || `<span class="status-badge">${status || '-'}</span>`;
    },

    async getManagedWarehouses() {
        return this.managedWarehouses;
    },

    testDataSourceConnectivity(data) {
        const requiredFields = ['name', 'type', 'host', 'port', 'database', 'username', 'password'];
        const missingField = requiredFields.find(field => !String(data?.[field] || '').trim());
        if (missingField) {
            return {
                success: false,
                status: 'test_failed',
                message: '请完整填写数据源配置后再测试连通性',
            };
        }
        if (String(data.host).toLowerCase().includes('fail')) {
            return {
                success: false,
                status: 'test_failed',
                message: '连通性测试失败，请检查主机地址或账号权限',
            };
        }
        return {
            success: true,
            status: 'test_success',
            message: '连通性测试通过，可以继续创建逻辑数仓',
        };
    },

    async createManagedWarehouse(data) {
        const newWarehouse = {
            id: 'mwh' + Date.now(),
            name: data.name,
            fullName: `省级 - ${data.deptName} - ${data.name}`,
            cityId: 'province',
            cityName: '省级',
            deptId: data.deptId,
            deptName: data.deptName,
            owner: data.owner,
            dbCount: Number(data.dbCount) || 0,
            tableCount: Number(data.tableCount) || 0,
            lastScore: null,
            grade: null,
            connectivityStatus: data.connectivityStatus || 'connected',
            onboardingStatus: data.onboardingStatus || 'ready',
            sourceConfig: {
                name: data.sourceConfig.name,
                type: data.sourceConfig.type,
                host: data.sourceConfig.host,
                port: data.sourceConfig.port,
                database: data.sourceConfig.database,
                username: data.sourceConfig.username,
                password: data.sourceConfig.password,
            },
        };
        this.managedWarehouses.unshift(newWarehouse);
        return newWarehouse;
    },

    async bindWarehouseDepartment(warehouseId, deptId) {
        const warehouse = this.managedWarehouses.find(item => item.id === warehouseId);
        const dept = this.departments.find(item => item.id === deptId);
        if (!warehouse || !dept) return null;
        warehouse.deptId = dept.id;
        warehouse.deptName = dept.name;
        warehouse.fullName = `省级 - ${dept.name} - ${warehouse.name}`;
        warehouse.onboardingStatus = 'ready';
        return warehouse;
    },

    getPhaseTemplateById(id) {
        return (this.phaseTemplates || []).find(item => item.id === id);
    },

    async getPhaseTemplates() {
        return this.phaseTemplates;
    },

    async createPhaseTemplate(data) {
        const name = String(data?.name || '').trim();
        const description = String(data?.description || '').trim();
        const scoringMode = data?.scoringMode === 'rules_avg' ? 'rules_avg' : 'manual';
        const fields = Array.isArray(data?.formSchema?.fields) ? data.formSchema.fields : [];
        if (!name) {
            return { success: false, message: '请填写阶段名称' };
        }
        const id = `phase_${Date.now()}`;
        const safeFields = fields.map((f, idx) => ({
            id: String(f.id || `field_${idx + 1}`),
            type: f.type === 'select' ? 'select' : f.type === 'attachment' ? 'attachment' : 'text',
            label: String(f.label || '').trim() || '未命名字段',
            required: Boolean(f.required),
            options: Array.isArray(f.options) ? f.options.map(o => ({ label: String(o.label || ''), value: String(o.value || '') })) : undefined,
        }));
        const template = {
            id,
            name,
            description,
            scoringMode,
            formSchema: { fields: safeFields },
        };
        this.phaseTemplates.unshift(template);
        return { success: true, template };
    },

    async updatePhaseTemplate(phaseId, data) {
        const tpl = (this.phaseTemplates || []).find(t => t.id === phaseId);
        if (!tpl) return { success: false, message: '阶段不存在' };
        const name = String(data?.name || '').trim();
        const description = String(data?.description || '').trim();
        const scoringMode = data?.scoringMode === 'rules_avg' ? 'rules_avg' : 'manual';
        const fields = Array.isArray(data?.formSchema?.fields) ? data.formSchema.fields : [];
        if (!name) return { success: false, message: '请填写阶段名称' };
        tpl.name = name;
        tpl.description = description;
        tpl.scoringMode = scoringMode;
        tpl.formSchema = { fields: fields.map((f, idx) => ({
            id: String(f.id || `field_${idx + 1}`),
            type: f.type === 'select' ? 'select' : f.type === 'attachment' ? 'attachment' : 'text',
            label: String(f.label || '').trim() || '未命名字段',
            required: Boolean(f.required),
            options: Array.isArray(f.options) ? f.options.map(o => ({ label: String(o.label || ''), value: String(o.value || '') })) : undefined,
        })) };
        return { success: true, template: tpl };
    },

    async deletePhaseTemplate(phaseId) {
        const tpl = (this.phaseTemplates || []).find(t => t.id === phaseId);
        if (!tpl) return { success: false, message: '阶段不存在' };
        const usedByPlan = Object.values(this.departmentPhasePlans || {}).some(plan =>
            (plan?.phases || []).some(p => p.phaseId === phaseId)
        );
        const usedByEvaluation = (this.evaluations || []).some(e =>
            (e.phaseScores || []).some(p => p.phaseId === phaseId)
        );
        if (usedByPlan || usedByEvaluation) {
            return { success: false, message: '该阶段已被部门配置或评估记录使用，无法删除' };
        }
        this.phaseTemplates = (this.phaseTemplates || []).filter(t => t.id !== phaseId);
        return { success: true };
    },

    async getPhaseRules() {
        return this.phaseRules;
    },

    async createPhaseRule(data) {
        const name = String(data?.name || '').trim();
        if (!name) return { success: false, message: '规则名称不能为空' };
        const id = 'pr_' + Date.now();
        this.phaseRules.push({
            id,
            name,
            description: String(data.description || '').trim(),
            category: String(data.category || '交付质量').trim(),
            enabled: data.enabled !== false,
        });
        return { success: true, id };
    },

    async updatePhaseRule(ruleId, data) {
        const rule = this.phaseRules.find(r => r.id === ruleId);
        if (!rule) return { success: false, message: '规则不存在' };
        if (data.name !== undefined) {
            const name = String(data.name).trim();
            if (!name) return { success: false, message: '规则名称不能为空' };
            rule.name = name;
        }
        if (data.description !== undefined) rule.description = String(data.description).trim();
        if (data.category !== undefined) rule.category = String(data.category).trim();
        if (data.enabled !== undefined) rule.enabled = Boolean(data.enabled);
        return { success: true };
    },

    async deletePhaseRule(ruleId) {
        const idx = this.phaseRules.findIndex(r => r.id === ruleId);
        if (idx < 0) return { success: false, message: '规则不存在' };
        for (const [deptId, plan] of Object.entries(this.departmentPhasePlans || {})) {
            for (const p of (plan.phases || [])) {
                if ((p.ruleBindings || []).some(b => b.ruleId === ruleId)) {
                    const dept = (this.departments || []).find(d => d.id === deptId);
                    const tpl = (this.phaseTemplates || []).find(t => t.id === p.phaseId);
                    return { success: false, message: `该规则已被部门「${dept?.name || deptId}」的阶段「${tpl?.name || p.phaseId}」绑定，请先解绑再删除` };
                }
            }
        }
        this.phaseRules.splice(idx, 1);
        return { success: true };
    },

    resolveDepartmentIdByName(name) {
        const raw = String(name || '').trim();
        if (!raw) return null;
        const exact = this.departments.find(d => d.name === raw);
        if (exact) return exact.id;
        if (raw.endsWith('局')) {
            const asHall = raw.slice(0, -1) + '厅';
            const hall = this.departments.find(d => d.name === asHall);
            if (hall) return hall.id;
        }
        return null;
    },

    getWarehouseDepartmentInfo(warehouseId) {
        const wh = this.getFlatWarehouses().find(w => w.id === warehouseId);
        if (!wh) return null;
        const mappedDeptId = wh.deptId && this.departments.some(d => d.id === wh.deptId)
            ? wh.deptId
            : this.resolveDepartmentIdByName(wh.deptName);
        if (!mappedDeptId) return null;
        const dept = this.departments.find(d => d.id === mappedDeptId);
        return { deptId: mappedDeptId, deptName: dept?.name || wh.deptName || '' };
    },

    getDepartmentPhasePlan(deptId) {
        return this.departmentPhasePlans?.[deptId] || { departmentId: deptId, phases: [] };
    },

    async saveDepartmentPhasePlan(deptId, phases) {
        const safe = Array.isArray(phases) ? phases.map((p, idx) => ({
            phaseId: String(p.phaseId || ''),
            order: Number(p.order) || (idx + 1),
            ruleBindings: Array.isArray(p.ruleBindings) ? p.ruleBindings.map(b => ({ ruleId: String(b.ruleId || '') })).filter(b => b.ruleId) : undefined,
        })).filter(p => p.phaseId) : [];
        this.departmentPhasePlans[deptId] = { departmentId: deptId, phases: safe.sort((a, b) => a.order - b.order) };
        return this.departmentPhasePlans[deptId];
    },

    getGradeByScore(score) {
        const val = Number(score);
        if (!Number.isFinite(val)) return null;
        const level = (this.gradeLevels || []).find(item => val >= item.minScore && val <= item.maxScore);
        return level?.grade || null;
    },

    getFlatWarehouses() {
        const list = [];
        this.warehouses.forEach(city => {
            city.departments.forEach(dept => {
                dept.warehouses.forEach(wh => {
                    list.push({
                        id: wh.id,
                        cityId: city.id,
                        cityName: city.city,
                        deptId: dept.id,
                        deptName: dept.name,
                        name: wh.name,
                        fullName: `${city.city} - ${dept.name} - ${wh.name}`,
                        ...wh
                    });
                });
            });
        });
        this.managedWarehouses
            .filter(item => item.onboardingStatus === 'ready')
            .forEach(wh => {
                list.push({
                    id: wh.id,
                    cityId: wh.cityId,
                    cityName: wh.cityName,
                    deptId: wh.deptId,
                    deptName: wh.deptName,
                    name: wh.name,
                    fullName: wh.fullName,
                    owner: wh.owner,
                    dbCount: wh.dbCount,
                    tableCount: wh.tableCount,
                    lastScore: wh.lastScore,
                    grade: wh.grade,
                    connectivityStatus: wh.connectivityStatus,
                    onboardingStatus: wh.onboardingStatus,
                    sourceConfig: { ...wh.sourceConfig },
                    sourceManaged: true,
                });
            });
        return list;
    },

    getWarehouseById(id) {
        const readyWarehouse = this.getFlatWarehouses().find(item => item.id === id);
        if (readyWarehouse) return readyWarehouse;
        const managed = this.managedWarehouses.find(item => item.id === id);
        if (managed) {
            return {
                id: managed.id,
                cityId: managed.cityId,
                cityName: managed.cityName,
                deptId: managed.deptId,
                deptName: managed.deptName,
                name: managed.name,
                fullName: managed.fullName,
                owner: managed.owner,
                dbCount: managed.dbCount,
                tableCount: managed.tableCount,
                lastScore: managed.lastScore,
                grade: managed.grade,
                connectivityStatus: managed.connectivityStatus,
                onboardingStatus: managed.onboardingStatus,
                sourceConfig: { ...managed.sourceConfig },
                sourceManaged: true,
            };
        }
        return null;
    },

    async getRuleSets() {
        return this.ruleSets;
    },

    async getDimensions() {
        return this.dimensions;
    },

    async getEvaluations() {
        return this.evaluations;
    },

    async getEvaluation(id) {
        return this.evaluations.find(e => e.id === id);
    },

    async createEvaluation(data) {
        const dimension = data?.dimension === 'phase' || data?.evaluationDimension === 'phase' || data?.phaseId
            ? 'phase'
            : 'department';

        let departmentId = String(data?.departmentId || data?.deptId || '').trim();
        let departmentName = '';
        let warehouseId = String(data?.warehouseId || '').trim();
        let warehouseName = '';
        let phaseId = String(data?.phaseId || '').trim();

        if (warehouseId) {
            const wh = this.getFlatWarehouses().find(w => w.id === warehouseId);
            warehouseName = wh?.fullName || wh?.name || '';
            const deptInfo = this.getWarehouseDepartmentInfo(warehouseId);
            if (!deptInfo) {
                throw new Error('当前数仓未能识别所属部门，无法开始评估');
            }
            departmentId = deptInfo.deptId;
            departmentName = deptInfo.deptName;
        } else {
            if (!departmentId) {
                throw new Error('缺少部门信息，无法开始评估');
            }
            const dept = (this.departments || []).find(d => d.id === departmentId);
            if (!dept) {
                throw new Error('部门不存在，无法开始评估');
            }
            departmentName = dept.name;
            warehouseName = dimension === 'phase' ? `${dept.name} - ${this.getPhaseTemplateById(phaseId)?.name || phaseId}` : dept.name;
        }

        const plan = this.getDepartmentPhasePlan(departmentId);
        const orderedPhases = (plan?.phases || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        if (dimension === 'department' && !orderedPhases.length) {
            throw new Error('所属部门尚未配置评估阶段，无法开始评估');
        }
        if (dimension === 'phase') {
            if (!phaseId) throw new Error('缺少阶段信息，无法开始评估');
            const inPlan = orderedPhases.some(p => p.phaseId === phaseId);
            if (!inPlan) throw new Error('该阶段未在部门阶段配置中，无法开始评估');
        }

        const phaseScoreSeeds = dimension === 'phase'
            ? [{ phaseId, score: null, scoringMode: this.getPhaseTemplateById(phaseId)?.scoringMode || 'manual' }]
            : orderedPhases.map(item => {
                const tpl = this.getPhaseTemplateById(item.phaseId);
                return { phaseId: item.phaseId, score: null, scoringMode: tpl?.scoringMode || 'manual' };
            });

        const newEval = {
            id: 'eval' + Date.now(),
            evaluationDimension: dimension,
            warehouseId: warehouseId || null,
            warehouseName: warehouseName || '',
            departmentId,
            departmentName,
            phaseId: dimension === 'phase' ? phaseId : null,
            status: 'in_progress',
            score: null,
            grade: null,
            startTime: new Date().toISOString(),
            endTime: null,
            progress: 0,
            dimensionScores: {},
            issues: [],
            phaseScores: phaseScoreSeeds,
            phaseRuleScores: [],
            phaseSubmissions: [],
        };
        this.evaluations.unshift(newEval);
        return newEval;
    },

    async saveEvaluationPhase(evaluationId, data) {
        const evaluation = this.evaluations.find(e => e.id === evaluationId);
        if (!evaluation) return null;
        const phaseId = String(data?.phaseId || '');
        if (!phaseId) return evaluation;
        const submission = data?.submission && typeof data.submission === 'object' ? data.submission : null;
        const directScore = data?.score === null || data?.score === undefined ? null : Number(data.score);
        const ruleScores = Array.isArray(data?.ruleScores) ? data.ruleScores : null;

        const plan = this.getDepartmentPhasePlan(evaluation.departmentId);
        const planItem = (plan?.phases || []).find(p => p.phaseId === phaseId);
        const template = this.getPhaseTemplateById(phaseId);
        const scoringMode = template?.scoringMode || 'manual';

        if (submission) {
            const existing = (evaluation.phaseSubmissions || []).find(s => s.phaseId === phaseId);
            if (existing) existing.data = submission;
            else (evaluation.phaseSubmissions || (evaluation.phaseSubmissions = [])).push({ phaseId, data: submission });
        }

        if (scoringMode === 'rules_avg' && planItem?.ruleBindings?.length) {
            const bindings = planItem.ruleBindings.map(b => b.ruleId).filter(Boolean);
            const scoreMap = new Map();
            (ruleScores || []).forEach(item => {
                const rid = String(item.ruleId || '');
                const sval = Number(item.score);
                if (!rid || !Number.isFinite(sval)) return;
                scoreMap.set(rid, Math.max(0, Math.min(100, Math.round(sval))));
            });
            evaluation.phaseRuleScores = (evaluation.phaseRuleScores || []).filter(item => item.phaseId !== phaseId);
            bindings.forEach(rid => {
                if (!scoreMap.has(rid)) return;
                evaluation.phaseRuleScores.push({ phaseId, ruleId: rid, score: scoreMap.get(rid) });
            });
        }

        let finalPhaseScore = null;
        if (scoringMode === 'manual') {
            if (directScore !== null && Number.isFinite(directScore)) {
                finalPhaseScore = Math.max(0, Math.min(100, Math.round(directScore)));
            }
        } else {
            const bindings = (planItem?.ruleBindings || []).map(b => b.ruleId).filter(Boolean);
            const scores = (evaluation.phaseRuleScores || [])
                .filter(item => item.phaseId === phaseId && bindings.includes(item.ruleId))
                .map(item => Number(item.score))
                .filter(v => Number.isFinite(v));
            if (scores.length >= 2) {
                finalPhaseScore = Math.max(0, Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)));
            }
        }

        const phaseEntry = (evaluation.phaseScores || []).find(item => item.phaseId === phaseId);
        if (phaseEntry) {
            phaseEntry.scoringMode = scoringMode;
            phaseEntry.score = finalPhaseScore;
        }

        const total = (evaluation.phaseScores || []).length;
        const completedCount = (evaluation.phaseScores || []).filter(p => Number.isFinite(Number(p.score))).length;
        evaluation.progress = total ? Math.round((completedCount / total) * 100) : 0;

        const isCompleted = total > 0 && completedCount === total;
        if (isCompleted) {
            const deptScore = Math.round((evaluation.phaseScores || []).reduce((sum, p) => sum + Number(p.score || 0), 0) / total);
            evaluation.score = deptScore;
            evaluation.grade = this.getGradeByScore(deptScore);
            evaluation.status = 'completed';
            evaluation.endTime = evaluation.endTime || new Date().toISOString();
        } else {
            evaluation.status = 'in_progress';
            evaluation.endTime = null;
            evaluation.score = null;
            evaluation.grade = null;
        }

        return evaluation;
    },

    async getReports() {
        return this.reports;
    },

    async getReport(id) {
        return this.reports.find(r => r.id === id);
    },

    async createReport(data) {
        const evaluation = this.evaluations.find(e => e.id === data.evaluationId);
        const newReport = {
            id: 'report' + Date.now(),
            title: `${evaluation?.warehouseName || '数据仓库'}评估报告`,
            warehouseName: evaluation?.warehouseName || '',
            evaluationId: data.evaluationId,
            createdAt: new Date().toISOString(),
            version: '1.0',
        };
        this.reports.unshift(newReport);
        return newReport;
    },

    async getDashboardMetrics() {
        return this.dashboardMetrics;
    },

    exportEvaluationResult(evaluationId, format) {
        const evaluation = this.evaluations.find(e => e.id === evaluationId);
        if (!evaluation) return;

        const data = JSON.stringify(evaluation, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evaluation-${evaluationId}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
    },

    downloadReport(reportId, format) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        const evaluation = this.evaluations.find(e => e.id === report.evaluationId);
        const phaseRows = (evaluation?.phaseScores || []).map(item => {
            const tpl = this.getPhaseTemplateById(item.phaseId);
            const modeText = (tpl?.scoringMode || item.scoringMode) === 'rules_avg' ? '规则均分' : '手工录入';
            const scoreText = item.score === null || item.score === undefined ? '-' : String(item.score);
            return `${tpl?.name || item.phaseId}\t${scoreText}\t${modeText}`;
        });
        const ruleRows = (this.ruleSets || []).flatMap(rs => {
            const dimScore = evaluation?.dimensionScores?.[rs.id]?.score;
            const rules = this.rules[rs.id] || [];
            return rules.map(rule => {
                let scoreText = '-';
                if (dimScore !== null && dimScore !== undefined) {
                    const seed = (rule.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
                    const offset = (seed % 9) - 4;
                    scoreText = String(Math.max(0, Math.min(100, Math.round(dimScore + offset))));
                }
                return `${rule.name}\t${rule.weight}\t${scoreText}`;
            });
        });
        const issueRows = (evaluation?.issues || []).map((item, idx) => `${idx + 1}\t${item.rule}\t${item.description || '-'}\t${item.severity || '-'}`);
        const content = [
            `${report.title}`,
            '',
            `综述：在 ${evaluation?.startTime || report.createdAt} 完成 ${report.warehouseName} 的评估，总评分 ${evaluation?.score ?? '-'} 分，${evaluation?.grade || '-'} 等级，总共发现 ${(evaluation?.issues || []).length} 个问题。`,
            '',
            '评估阶段（阶段\t得分\t模式）',
            ...(phaseRows.length ? phaseRows : ['-']),
            '',
            '评估规则（评估规则名称\t权重\t得分）',
            ...(ruleRows.length ? ruleRows : ['-']),
            '',
            '问题清单（序号\t所属规则\t问题描述\t严重度）',
            ...(issueRows.length ? issueRows : ['-']),
            '',
        ].join('\n');
        const blob = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
    },
};

window.API = API;
