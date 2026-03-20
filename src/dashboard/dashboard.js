(function () {
    const app = document.getElementById('dashboard-app');
    const COLORS = {
        A: '#34d399',
        B: '#60a5fa',
        C: '#fbbf24',
        D: '#f87171',
    };

    function getSource() {
        return window.API || null;
    }

    function getTimestamp(record) {
        return new Date(record.endTime || record.startTime || 0).getTime();
    }

    function safeNumber(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    }

    function formatPercent(value) {
        return `${(value * 100).toFixed(1)}%`;
    }

    function formatScore(value) {
        return safeNumber(value).toFixed(1);
    }

    function buildSnapshot() {
        const source = getSource();
        if (!source) {
            return null;
        }

        const warehouses = source.getFlatWarehouses();
        const evaluations = (source.evaluations || []).slice();
        const reports = (source.reports || []).slice();
        const dimensions = (source.dimensions || []).slice();

        const latestEvalByWarehouse = new Map();
        const latestCompletedByWarehouse = new Map();

        evaluations.forEach((evaluation) => {
            const existing = latestEvalByWarehouse.get(evaluation.warehouseId);
            if (!existing || getTimestamp(evaluation) > getTimestamp(existing)) {
                latestEvalByWarehouse.set(evaluation.warehouseId, evaluation);
            }

            if (evaluation.status === 'completed' && evaluation.score !== null) {
                const completed = latestCompletedByWarehouse.get(evaluation.warehouseId);
                if (!completed || getTimestamp(evaluation) > getTimestamp(completed)) {
                    latestCompletedByWarehouse.set(evaluation.warehouseId, evaluation);
                }
            }
        });

        const rows = warehouses.map((warehouse) => ({
            ...warehouse,
            latestEvaluation: latestEvalByWarehouse.get(warehouse.id) || null,
            latestCompletedEvaluation: latestCompletedByWarehouse.get(warehouse.id) || null,
        }));

        const departmentCount = new Set(rows.map((item) => item.deptName)).size;
        const assessedCount = rows.filter((item) => item.latestEvaluation).length;
        const unassessedCount = rows.length - assessedCount;
        const scoredRows = rows.filter((item) => item.latestCompletedEvaluation);
        const ruleSetCount = (source.ruleSets || []).length;
        const ruleCount = Object.values(source.rules || {}).reduce((sum, items) => sum + items.length, 0);
        const latestIssues = scoredRows.flatMap((item) => item.latestCompletedEvaluation.issues || []);
        const issueCount = latestIssues.length;
        const openIssueCount = latestIssues.length;

        const kpis = [
            { label: '部门数', value: String(departmentCount), unit: '个', foot: '按部门-数仓口径统计' },
            { label: '数仓数', value: String(rows.length), unit: '个', foot: '纳入综合质量总览' },
            { label: '已评估覆盖率', value: formatPercent(rows.length ? assessedCount / rows.length : 0), unit: '', foot: `${assessedCount}/${rows.length} 已发起评估` },
            { label: '未评估数', value: String(unassessedCount), unit: '个', foot: '尚未进入评估流程' },
            { label: '规则集数', value: String(ruleSetCount), unit: '个', foot: '纳入评估体系' },
            { label: '规则数', value: String(ruleCount), unit: '条', foot: '全量评估规则' },
            { label: '问题数', value: String(issueCount), unit: '项', foot: '最新评估发现问题' },
            { label: '未闭环问题', value: String(openIssueCount), unit: '项', foot: '当前 mock 未区分闭环状态' },
        ];

        const topFive = scoredRows
            .map((item) => ({
                warehouseId: item.id,
                warehouseName: item.name,
                deptName: item.deptName,
                cityName: item.cityName,
                score: safeNumber(item.latestCompletedEvaluation.score),
                grade: item.latestCompletedEvaluation.grade,
            }))
            .sort((a, b) => b.score - a.score || a.warehouseName.localeCompare(b.warehouseName, 'zh-CN'))
            .slice(0, 5);

        const distributionBins = [
            { label: '0-59', min: 0, max: 59, count: 0 },
            { label: '60-69', min: 60, max: 69, count: 0 },
            { label: '70-79', min: 70, max: 79, count: 0 },
            { label: '80-89', min: 80, max: 89, count: 0 },
            { label: '90-100', min: 90, max: 100, count: 0 },
        ];

        const gradeDistribution = { A: 0, B: 0, C: 0, D: 0 };
        const dimensionAccumulator = new Map();
        const ruleCounter = new Map();
        const issueCounter = new Map();

        dimensions.forEach((dimension) => {
            dimensionAccumulator.set(dimension.id, { name: dimension.name, total: 0, count: 0 });
        });

        scoredRows.forEach((item) => {
            const evaluation = item.latestCompletedEvaluation;
            const score = safeNumber(evaluation.score);

            distributionBins.forEach((bin) => {
                if (score >= bin.min && score <= bin.max) {
                    bin.count += 1;
                }
            });

            if (gradeDistribution[evaluation.grade] !== undefined) {
                gradeDistribution[evaluation.grade] += 1;
            }

            Object.entries(evaluation.dimensionScores || {}).forEach(([key, payload]) => {
                const target = dimensionAccumulator.get(key) || { name: key, total: 0, count: 0 };
                target.total += safeNumber(payload.score);
                target.count += 1;
                dimensionAccumulator.set(key, target);
            });

            (evaluation.issues || []).forEach((issue) => {
                const ruleName = issue.rule || '未命名规则';
                const currentRule = ruleCounter.get(ruleName) || { count: 0, departments: new Set() };
                currentRule.count += 1;
                currentRule.departments.add(item.deptName);
                ruleCounter.set(ruleName, currentRule);

                const issueStat = issueCounter.get(ruleName) || {
                    count: 0,
                    departments: new Set(),
                    deptCountMap: new Map(),
                    descriptions: new Map(),
                };
                issueStat.count += 1;
                issueStat.departments.add(item.deptName);
                issueStat.deptCountMap.set(item.deptName, (issueStat.deptCountMap.get(item.deptName) || 0) + 1);
                if (issue.description) {
                    issueStat.descriptions.set(issue.description, (issueStat.descriptions.get(issue.description) || 0) + 1);
                }
                issueCounter.set(ruleName, issueStat);
            });
        });

        const radar = Array.from(dimensionAccumulator.entries()).map(([key, item]) => ({
            id: key,
            name: item.name,
            score: item.count ? Number((item.total / item.count).toFixed(1)) : 0,
        }));

        const ruleTopFive = Array.from(ruleCounter.entries())
            .map(([name, item]) => ({
                name,
                count: item.count,
                deptCount: item.departments.size,
            }))
            .sort((a, b) => b.count - a.count || b.deptCount - a.deptCount || a.name.localeCompare(b.name, 'zh-CN'))
            .slice(0, 5);

        const issueTopFive = Array.from(issueCounter.entries())
            .map(([name, item]) => {
                let owner = '-';
                let ownerCount = -1;
                let description = '-';
                let descriptionCount = -1;
                item.deptCountMap.forEach((count, deptName) => {
                    if (count > ownerCount) {
                        owner = deptName;
                        ownerCount = count;
                    }
                });
                item.descriptions.forEach((count, text) => {
                    if (count > descriptionCount) {
                        description = text;
                        descriptionCount = count;
                    }
                });

                return {
                    name,
                    description,
                    count: item.count,
                    deptCount: item.departments.size,
                    ownerDept: owner,
                };
            })
            .sort((a, b) => b.count - a.count || b.deptCount - a.deptCount || a.name.localeCompare(b.name, 'zh-CN'))
            .slice(0, 5);

        return {
            generatedAt: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }),
            kpis,
            topFive,
            distributionBins,
            gradeDistribution,
            radar,
            ruleTopFive,
            issueTopFive,
            reportCount: reports.length,
        };
    }

    function polarToCartesian(cx, cy, radius, angle) {
        const radians = (angle - 90) * (Math.PI / 180);
        return {
            x: cx + radius * Math.cos(radians),
            y: cy + radius * Math.sin(radians),
        };
    }

    function describeArc(cx, cy, radius, startAngle, endAngle) {
        const start = polarToCartesian(cx, cy, radius, endAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }

    function renderKpis(kpis) {
        return `
            <section class="kpi-grid">
                ${kpis.map((item) => `
                    <article class="panel kpi-card">
                        <div class="panel-inner">
                            <div class="kpi-label">${item.label}</div>
                            <div>
                                <span class="kpi-value">${item.value}</span>
                                ${item.unit ? `<span class="kpi-unit">${item.unit}</span>` : ''}
                            </div>
                            <div class="kpi-foot">${item.foot}</div>
                        </div>
                    </article>
                `).join('')}
            </section>
        `;
    }

    function renderTopFive(items) {
        if (!items.length) {
            return '<div class="chart-empty">暂无已完成评估数据</div>';
        }

        const [first, second, third, fourth, fifth] = items;
        const podiumOrder = [second, first, third];
        const medals = ['🥈', '🥇', '🥉'];
        const classes = ['podium-second', 'podium-first', 'podium-third'];

        return `
            <div class="podium">
                ${podiumOrder.map((item, index) => item ? `
                    <div class="podium-item ${classes[index]}">
                        <div class="podium-medal">${medals[index]}</div>
                        <div class="podium-name">${item.warehouseName}</div>
                        <div class="podium-dept">${item.deptName}</div>
                        <div class="podium-base">
                            <div class="podium-score">${item.score}</div>
                            <div class="muted">${item.grade} 级</div>
                        </div>
                    </div>
                ` : '').join('')}
            </div>
            <ol class="rank-list">
                ${[fourth, fifth].filter(Boolean).map((item, index) => `
                    <li class="rank-item">
                        <div class="rank-index">${index + 4}</div>
                        <div>
                            <div class="rank-name">${item.warehouseName}</div>
                            <div class="rank-dept">${item.deptName}</div>
                        </div>
                        <div class="rank-score">${item.score}</div>
                    </li>
                `).join('')}
            </ol>
        `;
    }

    function renderDistribution(bins) {
        const max = Math.max(...bins.map((item) => item.count), 1);
        return `
            <div class="bar-chart">
                ${bins.map((item) => `
                    <div class="bar-column">
                        <div class="bar-value">${item.count}</div>
                        <div class="bar-shell">
                            <div class="bar" style="height:${Math.max((item.count / max) * 100, item.count > 0 ? 12 : 0)}%"></div>
                        </div>
                        <div class="bar-label">${item.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderPie(gradeDistribution) {
        const entries = Object.entries(gradeDistribution);
        const total = entries.reduce((sum, [, count]) => sum + count, 0);
        if (!total) {
            return '<div class="chart-empty">暂无等级分布数据</div>';
        }

        let currentAngle = 0;
        const arcs = entries.map(([grade, count]) => {
            const angle = (count / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;
            return {
                grade,
                count,
                path: describeArc(130, 130, 86, startAngle, endAngle),
            };
        });

        return `
            <div class="pie-layout">
                <svg class="pie-svg" viewBox="0 0 260 260" aria-label="数仓得分等级分布">
                    <circle cx="130" cy="130" r="86" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="28"></circle>
                    ${arcs.map((item) => `
                        <path d="${item.path}" fill="none" stroke="${COLORS[item.grade]}" stroke-width="28" stroke-linecap="round"></path>
                    `).join('')}
                    <circle class="pie-center" cx="130" cy="130" r="56"></circle>
                    <text class="pie-center-label" x="130" y="118">已完成评估</text>
                    <text class="pie-center-value" x="130" y="148">${total}</text>
                </svg>
                <div class="legend">
                    ${entries.map(([grade, count]) => `
                        <div class="legend-item">
                            <span class="legend-swatch" style="background:${COLORS[grade]}"></span>
                            <span>${grade} 级 ${count} 个</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderRadar(items) {
        if (!items.length) {
            return '<div class="chart-empty">暂无规则集维度数据</div>';
        }

        const cx = 180;
        const cy = 145;
        const radius = 98;
        const levels = [0.25, 0.5, 0.75, 1];
        const angleStep = 360 / items.length;

        const levelPolygons = levels.map((level) => {
            return items.map((_, index) => {
                const point = polarToCartesian(cx, cy, radius * level, index * angleStep);
                return `${point.x},${point.y}`;
            }).join(' ');
        });

        const axes = items.map((item, index) => {
            const point = polarToCartesian(cx, cy, radius, index * angleStep);
            const labelPoint = polarToCartesian(cx, cy, radius + 30, index * angleStep);
            return { ...item, point, labelPoint };
        });

        const areaPoints = items.map((item, index) => {
            const point = polarToCartesian(cx, cy, radius * (item.score / 100), index * angleStep);
            return `${point.x},${point.y}`;
        }).join(' ');

        return `
            <div class="radar-wrap">
                <svg class="radar-svg" viewBox="0 0 360 300" aria-label="规则集雷达图">
                    ${levelPolygons.map((points) => `<polygon class="radar-grid" points="${points}"></polygon>`).join('')}
                    ${axes.map((item) => `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${item.point.x}" y2="${item.point.y}"></line>`).join('')}
                    <polygon class="radar-area" points="${areaPoints}"></polygon>
                    ${items.map((item, index) => {
                        const point = polarToCartesian(cx, cy, radius * (item.score / 100), index * angleStep);
                        return `<circle class="radar-point" cx="${point.x}" cy="${point.y}" r="3.5"></circle>`;
                    }).join('')}
                    ${axes.map((item) => `
                        <text class="radar-label" x="${item.labelPoint.x}" y="${item.labelPoint.y}" text-anchor="middle">${item.name}</text>
                    `).join('')}
                </svg>
            </div>
        `;
    }

    function renderRuleTop(items) {
        if (!items.length) {
            return '<div class="chart-empty">暂无规则命中数据</div>';
        }

        return `
            <ol class="rule-top-list">
                ${items.map((item, index) => `
                    <li class="rule-item">
                        <div class="rule-rank">${index + 1}</div>
                        <div>
                            <div class="rule-name">${item.name}</div>
                        </div>
                        <div class="rule-count">${item.count}</div>
                    </li>
                `).join('')}
            </ol>
        `;
    }

    function renderIssueTable(items) {
        if (!items.length) {
            return '<div class="chart-empty">暂无高频问题数据</div>';
        }

        return `
            <table class="issue-table">
                <thead>
                    <tr>
                        <th>问题名称</th>
                        <th>描述</th>
                        <th>出现次数</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item) => `
                        <tr>
                            <td class="issue-name">${item.name}</td>
                            <td class="issue-name">${item.description}</td>
                            <td>${item.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function render(snapshot) {
        if (!snapshot) {
            app.innerHTML = '<div class="screen"><div class="chart-empty">未找到 mock 数据源</div></div>';
            return;
        }

        const systemTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        app.innerHTML = `
            <div class="dashboard">
                <section class="hero">
                    <h1 class="hero-title">安徽省数据工程综合大屏</h1>
                    <div class="hero-meta">
                        <div class="meta-chip">
                            <span class="meta-label">系统时间</span>
                            <span class="meta-value">${systemTime}</span>
                        </div>
                        <div class="meta-chip">
                            <span class="meta-label">更新时间</span>
                            <span class="meta-value">${snapshot.generatedAt}</span>
                        </div>
                    </div>
                </section>

                ${renderKpis(snapshot.kpis)}

                <section class="triple-grid">
                    <article class="panel ranking-card">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">数仓排名</h2>
                            </div>
                            ${renderTopFive(snapshot.topFive)}
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">数仓分数</h2>
                            </div>
                            ${renderDistribution(snapshot.distributionBins)}
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">数仓等级</h2>
                            </div>
                            ${renderPie(snapshot.gradeDistribution)}
                        </div>
                    </article>
                </section>

                <section class="triple-grid">
                    <article class="panel">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">评估规则集雷达图</h2>
                            </div>
                            ${renderRadar(snapshot.radar)}
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">评估规则引用数Top5</h2>
                            </div>
                            ${renderRuleTop(snapshot.ruleTopFive)}
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-inner">
                            <div class="panel-header">
                                <h2 class="panel-title">高频问题</h2>
                            </div>
                            ${renderIssueTable(snapshot.issueTopFive)}
                        </div>
                    </article>
                </section>
            </div>
        `;
    }

    render(buildSnapshot());
})();
