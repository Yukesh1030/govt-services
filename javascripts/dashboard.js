// ─────────────────────────────────────────────
// dashboard.js  — Government Services Dashboard
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── Sidebar toggle (mobile) ──────────────
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar       = document.getElementById('dashSidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ── Chart defaults ───────────────────────
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color       = '#64748b';

    // ── Bar Chart — Applications by Service ──
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Birth Cert.', 'Land Rec.', 'Tax Pay', 'Vehicle', 'Scholarship', 'Health'],
                datasets: [{
                    label: 'Applications',
                    data: [820, 650, 540, 480, 310, 290],
                    backgroundColor: [
                        'rgba(59,130,246,.75)',
                        'rgba(239,68,68,.75)',
                        'rgba(245,158,11,.75)',
                        'rgba(16,185,129,.75)',
                        'rgba(139,92,246,.75)',
                        'rgba(249,115,22,.75)',
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                        grid: { color: 'rgba(0,0,0,.05)' },
                        border: { display: false, dash: [4, 4] },
                        ticks: { maxTicksLimit: 5 }
                    }
                }
            }
        });
    }

    // ── Line Chart — Processing Trends ───────
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
                datasets: [
                    {
                        label: 'Applied',
                        data: [210, 280, 260, 340, 380],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,.08)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointRadius: 4,
                        borderWidth: 2.5,
                    },
                    {
                        label: 'Approved',
                        data: [160, 200, 195, 260, 300],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,.06)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 4,
                        borderWidth: 2.5,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: { boxWidth: 10, borderRadius: 4, padding: 12, font: { size: 12 } }
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: {
                        grid: { color: 'rgba(0,0,0,.05)' },
                        border: { display: false },
                        ticks: { maxTicksLimit: 5 }
                    }
                }
            }
        });
    }

    // ── Donut Chart — Services by District ───
    const donutCtx = document.getElementById('donutChart');
    const districts = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'];
    const donutColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    if (donutCtx) {
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: districts,
                datasets: [{
                    data: [35, 28, 17, 12, 8],
                    backgroundColor: donutColors,
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                cutout: '68%',
                plugins: { legend: { display: false } }
            }
        });

        // Build legend
        const legendEl = document.getElementById('donutLegend');
        if (legendEl) {
            districts.forEach((d, i) => {
                legendEl.innerHTML += `
                    <div class="legend-item">
                        <span class="legend-dot" style="background:${donutColors[i]}"></span>
                        ${d}
                    </div>`;
            });
        }
    }

    // ── Chart Tab Switching (visual only) ────
    document.querySelectorAll('.chart-tabs').forEach(group => {
        group.querySelectorAll('.chart-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

});
