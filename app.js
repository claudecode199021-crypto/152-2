// Social Lens - Main Application Controller
// Handles UI rendering, chart drawing, interactive events, state management

let currentLang = 'en';
let activeEmotions = ['positive', 'negative', 'neutral'];
let networkTimeStep = 4;
let networkZoom = 1;
let selectedNode = null;
let liveCount = 0;
let currentUser = null;

function t(key) {
  return SocialLensData.translations[currentLang]?.[key] || SocialLensData.translations['en']?.[key] || key;
}

function handleLogout(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  localStorage.removeItem('socialLensUser');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  currentUser = checkAuth();

  initUI();
  initTheme();
  renderKPIs();
  renderSentimentChart();
  renderTrendingTopics();
  renderDemographics();
  renderInfluencers();
  renderNetworkGraph();
  renderTimeline();
  startLiveUpdates();
});

function checkAuth() {
  const userStr = localStorage.getItem('socialLensUser');
  let user;
  
  if (!userStr) {
    // Default active session so dashboard opens directly without login wall
    user = { username: 'admin', role: 'admin' };
  } else {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = { username: 'admin', role: 'admin' };
    }
  }

  const displayName = document.getElementById('user-display-name');
  const displayRole = document.getElementById('user-display-role');
  const avatarInitial = document.getElementById('user-avatar-initial');

  if (displayName) displayName.textContent = user.username.toUpperCase();
  if (displayRole) displayRole.textContent = user.role.toUpperCase();
  if (avatarInitial) avatarInitial.textContent = user.username.charAt(0).toUpperCase();

  return user;
}

function initUI() {
  // Language toggle
  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    document.getElementById('lang-toggle').textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
    updateAllTranslations();
  });

  // High contrast toggle
  document.getElementById('contrast-toggle').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // Filter handlers
  document.getElementById('platform-filter').addEventListener('change', (e) => {
    const platform = e.target.value;
    updateKPIsForFilter(platform);
  });

  // Export handlers
  document.getElementById('export-csv').addEventListener('click', () => exportData('csv'));
  document.getElementById('export-pdf').addEventListener('click', () => exportData('pdf'));
}

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-toggle-icon');
  const themeText = document.getElementById('theme-toggle-text');

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
      if (themeText) themeText.textContent = isDark ? 'Light' : 'Dark';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      renderSentimentChart();
      renderNetworkGraph();
    });
  }
}

function updateAllTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

function renderKPIs() {
  const { totalPosts, activeUsers, trendingTopics, sentimentSplit } = SocialLensData.kpi;
  document.getElementById('kpi-posts').textContent = SocialLensData.formatIndianNumber(totalPosts);
  document.getElementById('kpi-users').textContent = SocialLensData.formatIndianNumber(activeUsers);
  document.getElementById('kpi-topics').textContent = trendingTopics;
  document.getElementById('kpi-sentiment').textContent = `${sentimentSplit.positive}%`;
  document.getElementById('kpi-sentiment-sub').textContent =
    `${t('positive')} ${sentimentSplit.positive}% · ${t('negative')} ${sentimentSplit.negative}% · ${t('neutral')} ${sentimentSplit.neutral}%`;
}

function updateKPIsForFilter(platform) {
  const mult = platform === 'all' ? 1 : 0.35 + Math.random() * 0.3;
  const posts = Math.round(SocialLensData.kpi.totalPosts * mult);
  const users = Math.round(SocialLensData.kpi.activeUsers * mult);
  document.getElementById('kpi-posts').textContent = SocialLensData.formatIndianNumber(posts);
  document.getElementById('kpi-users').textContent = SocialLensData.formatIndianNumber(users);
}

function renderSentimentChart() {
  const container = document.getElementById('sentiment-chart-container');
  const isDark = document.body.classList.contains('dark');
  const gridColor = isDark ? '#283549' : '#f3f4f6';
  const textColor = isDark ? '#94a3b8' : '#94a3b8';

  const emotionColors = {
    positive: '#138808', negative: '#dc2626', neutral: isDark ? '#94a3b8' : '#6b7280',
    anxiety: '#f59e0b', excitement: '#8b5cf6', anger: '#ef4444', supportive: '#06b6d4'
  };

  const emotionList = ['positive', 'negative', 'neutral', 'anxiety', 'excitement', 'anger', 'supportive'];

  // Emotion toggle buttons
  let togglesHTML = '<div class="emotion-toggles">';
  emotionList.forEach(e => {
    const active = activeEmotions.includes(e);
    const style = active ? `background-color: ${emotionColors[e]}` : '';
    togglesHTML += `
      <button class="emotion-toggle ${active ? 'active' : 'inactive'}" style="${style}" onclick="toggleEmotion('${e}')" aria-label="Toggle ${e}">
        ${e.charAt(0).toUpperCase() + e.slice(1)}
      </button>`;
  });
  togglesHTML += '</div>';

  const data = SocialLensData.sentimentTimeline;
  const maxValue = Math.max(...data.flatMap(p => activeEmotions.map(e => p[e])));

  const width = 720;
  const height = 240;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  let gridLines = '';
  [0, 0.25, 0.5, 0.75, 1].forEach(r => {
    const y = pad.top + innerH * (1 - r);
    gridLines += `
      <line x1="${pad.left}" y1="${y}" x2="${pad.left + innerW}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>
      <text x="${pad.left - 5}" y="${y + 4}" text-anchor="end" fill="${textColor}" font-size="10">${Math.round((maxValue + 10) * r)}</text>`;
  });

  let xLabels = '';
  data.filter((_, i) => i % 4 === 0).forEach((p, i) => {
    const x = pad.left + ((i * 4) / (data.length - 1)) * innerW;
    xLabels += `<text x="${x}" y="${height - 5}" text-anchor="middle" fill="${textColor}" font-size="10">${p.time}</text>`;
  });

  // Sentiment shift marker at 14:00 (index 14)
  const shiftX = pad.left + (14 / 23) * innerW;
  const shiftMarker = `
    <line x1="${shiftX}" y1="${pad.top}" x2="${shiftX}" y2="${pad.top + innerH}" stroke="#ff9933" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="${shiftX}" y="${pad.top - 5}" text-anchor="middle" fill="#fb8c00" font-size="9" font-weight="600">Sentiment Shift (2 PM)</text>`;

  let pathsHTML = '';
  activeEmotions.forEach(e => {
    const points = data.map((p, i) => {
      const x = pad.left + (i / (data.length - 1)) * innerW;
      const y = pad.top + innerH - (p[e] / (maxValue + 10)) * innerH;
      return `${x},${y}`;
    });
    const d = `M ${points.join(' L ')}`;
    pathsHTML += `<path d="${d}" fill="none" stroke="${emotionColors[e]}" stroke-width="2.5" stroke-linecap="round"/>`;
  });

  const svgHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Sentiment timeline chart">
      ${gridLines}
      ${xLabels}
      ${shiftMarker}
      ${pathsHTML}
    </svg>`;

  container.innerHTML = togglesHTML + `<div class="chart-container">${svgHTML}</div>`;
}

function toggleEmotion(emotion) {
  if (activeEmotions.includes(emotion)) {
    activeEmotions = activeEmotions.filter(e => e !== emotion);
  } else {
    activeEmotions.push(emotion);
  }
  renderSentimentChart();
}

function renderTrendingTopics() {
  const container = document.getElementById('trending-topics-container');
  const topics = SocialLensData.trendingTopics;

  let html = '<div class="trend-list">';
  topics.forEach((topic, index) => {
    const growthClass = topic.growthPct >= 200 ? 'growth-high' : topic.growthPct >= 100 ? 'growth-medium' : 'growth-low';
    const sparkColor = topic.status === 'viral' ? '#dc2626' : topic.status === 'rising' ? '#138808' : '#6b7280';
    
    // Sparkline points
    const min = Math.min(...topic.sparkline);
    const max = Math.max(...topic.sparkline);
    const range = max - min || 1;
    const points = topic.sparkline.map((v, i) => {
      const x = (i / (topic.sparkline.length - 1)) * 80;
      const y = 24 - ((v - min) / range) * 20 - 2;
      return `${x},${y}`;
    }).join(' ');

    html += `
      <div class="trend-item" tabindex="0" onclick="selectTopic('${topic.id}')" onkeypress="if(event.key==='Enter'||event.key===' ')selectTopic('${topic.id}')">
        <span class="trend-rank">${index + 1}</span>
        <div class="trend-info">
          <div class="trend-name">
            ${topic.label}
            <span class="badge badge-${topic.status}">${t('status.' + topic.status)}</span>
          </div>
          <div class="trend-keywords">${topic.keywords.join(' ')}</div>
        </div>
        <svg width="80" height="24" class="sparkline" aria-hidden="true">
          <polyline points="${points}" fill="none" stroke="${sparkColor}" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="trend-growth ${growthClass}">+${topic.growthPct}%</span>
      </div>`;
  });
  html += '</div>';

  container.innerHTML = html;
}

function selectTopic(id) {
  const topic = SocialLensData.trendingTopics.find(t => t.id === id);
  if (topic) {
    alert(`Topic Selected: ${topic.label}\nGrowth: +${topic.growthPct}%\nFirst Platform: ${topic.firstPlatform}`);
  }
}

function renderDemographics() {
  const { ageBrackets, locations, languages, interests } = SocialLensData.demographics;

  // Age bars
  const ageContainer = document.getElementById('demo-age');
  const maxAge = Math.max(...ageBrackets.map(a => a.share));
  let ageHTML = '';
  ageBrackets.forEach(a => {
    const width = (a.share / maxAge) * 100;
    ageHTML += `
      <div class="bar-chart-item">
        <span class="bar-label">${a.bracket}</span>
        <div class="bar-track">
          <div class="bar-fill bar-fill-navy" style="width: ${width}%">
            <span>${a.share}%</span>
          </div>
        </div>
      </div>`;
  });
  ageContainer.innerHTML = ageHTML;

  // Pie sections (Locations, Languages, Interests)
  renderPieSection('demo-location', locations, ['#1a237e', '#3949ab', '#5c6bc0', '#7986cb', '#9fa8da', '#c5cae9', '#e8eaf6']);
  renderPieSection('demo-language', languages, ['#138808', '#2e7d32', '#43a047', '#66bb6a', '#a5d6a7']);
  renderPieSection('demo-interest', interests, ['#ff9933', '#fb8c00', '#f57c00', '#ef6c00', '#e65100']);
}

function renderPieSection(elementId, data, colors) {
  const container = document.getElementById(elementId);
  let cum = 0;
  let paths = '';
  let legend = '<div class="pie-legend">';

  data.forEach((item, i) => {
    const start = cum;
    cum += item.share;
    const startAngle = (start / 100) * 360;
    const endAngle = (cum / 100) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const sRad = ((startAngle - 90) * Math.PI) / 180;
    const eRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = 50 + 40 * Math.cos(sRad);
    const y1 = 50 + 40 * Math.sin(sRad);
    const x2 = 50 + 40 * Math.cos(eRad);
    const y2 = 50 + 40 * Math.sin(eRad);
    const color = colors[i % colors.length];

    paths += `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}"><title>${item.name}: ${item.share}%</title></path>`;

    legend += `
      <div class="pie-legend-item">
        <span class="pie-dot" style="background-color: ${color}"></span>
        <span class="pie-legend-name">${item.name}</span>
        <span class="pie-legend-value">${item.share}%</span>
      </div>`;
  });

  legend += '</div>';

  container.innerHTML = `
    <div class="pie-container">
      <svg viewBox="0 0 100 100" style="width: 100px; height: 100px; flex-shrink: 0;" aria-label="Distribution pie chart">${paths}</svg>
      ${legend}
    </div>`;
}

function renderInfluencers() {
  const container = document.getElementById('influencers-table-body');
  const infs = SocialLensData.influencers;

  let html = '';
  infs.forEach(inf => {
    const rankClass = inf.rank <= 3 ? 'rank-top' : 'rank-normal';
    const scoreClass = inf.score >= 90 ? 'score-high' : inf.score >= 70 ? 'score-medium' : 'score-low';
    const arrow = inf.change === 'up' ? '<span class="trend-arrow-up">▲</span>' : inf.change === 'down' ? '<span class="trend-arrow-down">▼</span>' : '<span class="trend-arrow-same">━</span>';

    html += `
      <tr>
        <td><span class="rank-badge ${rankClass}">#${inf.rank}</span></td>
        <td style="font-weight: 600;">${inf.handle}</td>
        <td>
          <div class="score-bar-track"><div class="score-bar-fill ${scoreClass}" style="width: ${inf.score}%"></div></div>
          <span style="font-weight: 700;">${inf.score}</span>
        </td>
        <td class="hide-mobile" style="color: var(--text-secondary);">${inf.platform}</td>
        <td class="hide-mobile" style="color: var(--text-secondary);">${SocialLensData.formatIndianNumber(inf.reach)}</td>
        <td class="hide-mobile" style="color: var(--text-secondary);">${inf.engagement}%</td>
        <td>${arrow}</td>
      </tr>`;
  });

  container.innerHTML = html;
}

function renderNetworkGraph() {
  const container = document.getElementById('network-graph-container');
  const isDark = document.body.classList.contains('dark');
  const communityColors = ['#ff9933', '#60a5fa', '#4ade80', '#a78bfa'];
  const edgeColor = isDark ? '#334155' : '#cbd5e1';
  const labelColor = isDark ? '#cbd5e1' : '#475569';

  const visibleComms = networkTimeStep === 0 ? [0] : networkTimeStep === 1 ? [0, 1] : networkTimeStep === 2 ? [0, 1, 2] : [0, 1, 2, 3];
  const nodes = SocialLensData.networkNodes.filter(n => visibleComms.includes(n.community));
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = SocialLensData.networkEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

  const svgW = 700;
  const svgH = 420;

  // Control bar HTML
  let controlsHTML = `
    <div class="network-controls">
      <label for="net-slider">Time Slider:</label>
      <input type="range" id="net-slider" min="0" max="4" value="${networkTimeStep}" class="time-slider" onchange="setNetworkTime(this.value)" aria-label="Time slider">
      <span class="time-value">${12 + networkTimeStep > 12 ? (12 + networkTimeStep - 12) + ' PM' : '12 PM'}</span>
      <button class="zoom-btn" onclick="zoomNetwork(-0.1)" aria-label="Zoom out">−</button>
      <button class="zoom-btn" onclick="zoomNetwork(0.1)" aria-label="Zoom in">+</button>
    </div>`;

  // Cascade steps HTML
  let cascadeHTML = '<div class="cascade-steps">';
  SocialLensData.cascadeSteps.filter((_, i) => i < networkTimeStep).forEach(step => {
    cascadeHTML += `
      <div class="cascade-step">
        <span class="cascade-from">${step.from}</span>
        <span class="cascade-arrow">→</span>
        <span class="cascade-to">${step.to}</span>
        <span class="cascade-time">${step.timestamp}</span>
      </div>`;
  });
  cascadeHTML += '</div>';

  // SVG edges
  let edgesHTML = '';
  edges.forEach(e => {
    const s = nodes.find(n => n.id === e.source);
    const t = nodes.find(n => n.id === e.target);
    if (s && t) {
      edgesHTML += `<line x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" stroke="${edgeColor}" stroke-width="${Math.max(0.5, e.weight / 2.5)}" stroke-opacity="0.6"/>`;
    }
  });

  // SVG nodes
  let nodesHTML = '';
  nodes.forEach(n => {
    const isSelected = selectedNode === n.id;
    const fill = communityColors[n.community];
    const stroke = isSelected ? '#ff9933' : 'white';
    const strokeW = isSelected ? 3 : 1.5;
    const r = n.size / 2;

    nodesHTML += `
      <g onclick="selectNode('${n.id}')" style="cursor: pointer;">
        <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" fill-opacity="${isSelected ? 1 : 0.85}" stroke="${stroke}" stroke-width="${strokeW}"/>
        ${n.size > 15 ? `<text x="${n.x}" y="${n.y + r + 10}" text-anchor="middle" fill="${labelColor}" font-size="8" font-weight="500">${n.label.length > 10 ? n.label.slice(0, 10) + '…' : n.label}</text>` : ''}
      </g>`;
  });

  // Node detail panel
  let detailHTML = '';
  if (selectedNode) {
    const sNode = SocialLensData.networkNodes.find(n => n.id === selectedNode);
    if (sNode) {
      const commLabels = ['Influencers', 'Community A', 'Community B', 'Community C'];
      const connCount = SocialLensData.networkEdges.filter(e => e.source === sNode.id || e.target === sNode.id).length;
      detailHTML = `
        <div class="node-detail">
          <button class="node-detail-close" onclick="selectNode(null)">✕</button>
          <h4>${sNode.label}</h4>
          <div class="node-detail-row"><span class="node-detail-label">Score:</span><span class="node-detail-value">${sNode.score}</span></div>
          <div class="node-detail-row"><span class="node-detail-label">Community:</span><span class="node-detail-value">${commLabels[sNode.community]}</span></div>
          <div class="node-detail-row"><span class="node-detail-label">Connections:</span><span class="node-detail-value">${connCount}</span></div>
        </div>`;
    }
  }

  const svgHTML = `
    <div class="graph-container">
      <svg viewBox="0 0 ${svgW} ${svgH}" style="transform: scale(${networkZoom}); transform-origin: center;" role="img" aria-label="Network graph">
        ${edgesHTML}
        ${nodesHTML}
      </svg>
      ${detailHTML}
    </div>`;

  container.innerHTML = controlsHTML + cascadeHTML + svgHTML;
}

function setNetworkTime(val) {
  networkTimeStep = parseInt(val);
  renderNetworkGraph();
}

function zoomNetwork(delta) {
  networkZoom = Math.min(2, Math.max(0.5, networkZoom + delta));
  renderNetworkGraph();
}

function selectNode(id) {
  selectedNode = selectedNode === id ? null : id;
  renderNetworkGraph();
}

function renderTimeline() {
  const container = document.getElementById('timeline-container');
  const events = SocialLensData.timelineEvents;

  const typeColors = {
    appear: { bg: '#eff6ff', text: '#2563eb' },
    influencer: { bg: '#fff8e1', text: '#f57c00' },
    sentiment_shift: { bg: '#fef2f2', text: '#dc2626' },
    viral: { bg: '#faf5ff', text: '#7c3aed' },
    cross_platform: { bg: '#e8f5e9', text: '#0f6d06' }
  };

  let html = '<div class="timeline">';
  events.forEach((ev, i) => {
    const c = typeColors[ev.type];

    let postsHTML = '';
    ev.posts.forEach(p => {
      postsHTML += `
        <div class="evidence-post">
          <div class="evidence-meta">
            <span class="evidence-author">${p.author}</span>
            <span class="evidence-dot">·</span>
            <span class="evidence-platform">${p.platform}</span>
            <span class="evidence-dot">·</span>
            <span class="evidence-time">${p.time}</span>
            <span class="evidence-sentiment sentiment-${p.sentiment}">${p.sentiment}</span>
          </div>
          <div class="evidence-text">${p.text}</div>
        </div>`;
    });

    html += `
      <div class="timeline-event">
        <div class="timeline-dot" style="background-color: ${c.bg}; color: ${c.text}">${ev.icon}</div>
        <div class="timeline-card" tabindex="0" onclick="toggleTimelineEvent('${ev.id}')" onkeypress="if(event.key==='Enter'||event.key===' ')toggleTimelineEvent('${ev.id}')">
          <div class="timeline-header">
            <div>
              <span class="timeline-time" style="background-color: ${c.bg}; color: ${c.text}">${ev.time}</span>
              <div class="timeline-title">${ev.label}</div>
              <div class="timeline-desc">${ev.description}</div>
            </div>
            <span class="timeline-chevron" id="chevron-${ev.id}">▼</span>
          </div>
          <div class="evidence-section" id="evidence-${ev.id}">
            <div class="evidence-label">Evidence Posts</div>
            ${postsHTML}
          </div>
        </div>
      </div>`;
  });
  html += '</div>';

  container.innerHTML = html;
}

function toggleTimelineEvent(id) {
  const evSection = document.getElementById(`evidence-${id}`);
  const chevron = document.getElementById(`chevron-${id}`);
  if (evSection) {
    evSection.classList.toggle('open');
    if (chevron) chevron.classList.toggle('open');
  }
}

function startLiveUpdates() {
  setInterval(() => {
    liveCount += Math.floor(Math.random() * 30) + 10;
    const badge = document.getElementById('live-badge');
    if (badge) {
      badge.textContent = `+${SocialLensData.formatIndianNumber(liveCount)} ${t('live.newPosts')}`;
    }
  }, 5000);
}

function exportData(format) {
  if (format === 'csv') {
    let csvContent = 'data:text/csv;charset=utf-8,Category,Field,Value,Details\n';
    csvContent += `KPI,Total Posts,${SocialLensData.kpi.totalPosts},Ingested Posts\n`;
    csvContent += `KPI,Active Users,${SocialLensData.kpi.activeUsers},Unique User Handles\n`;
    csvContent += `KPI,Trending Topics,${SocialLensData.kpi.trendingTopics},Active Clusters\n`;
    csvContent += `KPI,Positive Sentiment,${SocialLensData.kpi.sentimentSplit.positive}%,Sentiment Split\n`;
    
    SocialLensData.trendingTopics.forEach(t => {
      csvContent += `Topic,${t.label},+${t.growthPct}%,Status: ${t.status} | Platform: ${t.firstPlatform}\n`;
    });

    SocialLensData.influencers.forEach(inf => {
      csvContent += `Influencer,${inf.handle},Score: ${inf.score},Reach: ${inf.reach} | Platform: ${inf.platform}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'social-lens-analytics-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert(`Exporting Social Lens Dashboard to PDF format...\nReport generated for user: ${currentUser ? currentUser.username : 'admin'}`);
  }
}
