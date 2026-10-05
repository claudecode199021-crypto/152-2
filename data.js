// Social Lens - Mock Data Layer (Replay Adapter)
// All data from the NTRO Social Lens specification

var SocialLensData = {
  kpi: {
    totalPosts: 124560,
    activeUsers: 38420,
    trendingTopics: 17,
    sentimentSplit: { positive: 58, negative: 27, neutral: 15 }
  },

  formatIndianNumber(num) {
    const str = num.toString();
    if (str.length <= 3) return str;
    let lastThree = str.substring(str.length - 3);
    const remaining = str.substring(0, str.length - 3);
    if (remaining.length > 0) lastThree = ',' + lastThree;
    return remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  },

  sentimentTimeline: Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    positive: 45 + Math.round(Math.sin(i / 3) * 15 + Math.random() * 10),
    negative: 20 + Math.round(Math.cos(i / 4) * 10 + Math.random() * 8),
    neutral: 10 + Math.round(Math.random() * 8),
    anxiety: 5 + Math.round(Math.random() * 15),
    excitement: 10 + Math.round(Math.sin(i / 2) * 10 + Math.random() * 5),
    anger: 3 + Math.round(Math.random() * 12),
    supportive: 8 + Math.round(Math.random() * 10)
  })),

  trendingTopics: [
    { id: 't1', label: 'AI Regulation', keywords: ['#AIRegulation', '#AIPolicy', '#AISafety'], growthPct: 340, sparkline: [10,15,22,35,58,89,120,180,250,340], status: 'viral', firstPlatform: 'X (Twitter)' },
    { id: 't2', label: 'New Product Launch', keywords: ['#NewProduct', '#Launch2024', '#Innovation'], growthPct: 280, sparkline: [5,8,18,30,55,80,130,190,240,280], status: 'rising', firstPlatform: 'Instagram' },
    { id: 't3', label: 'Data Privacy', keywords: ['#DataPrivacy', '#GDPR', '#PrivacyMatters'], growthPct: 190, sparkline: [8,12,18,25,40,65,95,130,160,190], status: 'rising', firstPlatform: 'Telegram' },
    { id: 't4', label: 'Climate Action Summit', keywords: ['#ClimateSummit', '#ClimateAction'], growthPct: 165, sparkline: [3,5,10,18,30,50,80,110,140,165], status: 'stable', firstPlatform: 'X (Twitter)' },
    { id: 't5', label: 'Startup Funding Wave', keywords: ['#StartupIndia', '#VCFunding'], growthPct: 142, sparkline: [2,4,8,15,28,45,70,100,125,142], status: 'rising', firstPlatform: 'X (Twitter)' },
    { id: 't6', label: 'Digital India Initiative', keywords: ['#DigitalIndia', '#GovTech'], growthPct: 128, sparkline: [5,8,12,20,35,55,75,95,112,128], status: 'stable', firstPlatform: 'Facebook' },
    { id: 't7', label: 'Cybersecurity Alert', keywords: ['#CyberSecurity', '#InfoSec'], growthPct: 95, sparkline: [1,3,5,10,20,35,55,70,85,95], status: 'declining', firstPlatform: 'Reddit' }
  ],

  demographics: {
    ageBrackets: [
      { bracket: '13-17', share: 8 },
      { bracket: '18-24', share: 42 },
      { bracket: '25-34', share: 31 },
      { bracket: '35-44', share: 12 },
      { bracket: '45-54', share: 5 },
      { bracket: '55+', share: 2 }
    ],
    locations: [
      { name: 'India', share: 45 },
      { name: 'USA', share: 22 },
      { name: 'UK', share: 11 },
      { name: 'Canada', share: 7 },
      { name: 'Germany', share: 5 },
      { name: 'Australia', share: 4 },
      { name: 'Others', share: 6 }
    ],
    languages: [
      { name: 'English', share: 52 },
      { name: 'Hindi', share: 28 },
      { name: 'Hinglish', share: 12 },
      { name: 'Tamil', share: 4 },
      { name: 'Bengali', share: 4 }
    ],
    interests: [
      { name: 'Technology', share: 35 },
      { name: 'Politics', share: 22 },
      { name: 'Business', share: 18 },
      { name: 'Entertainment', share: 15 },
      { name: 'Sports', share: 10 }
    ]
  },

  influencers: [
    { id: 'u1', handle: 'User A', score: 94, platform: 'X (Twitter)', reach: 1250000, engagement: 8.5, rank: 1, change: 'same' },
    { id: 'u2', handle: 'User B', score: 89, platform: 'X (Twitter)', reach: 980000, engagement: 7.2, rank: 2, change: 'up' },
    { id: 'u3', handle: 'User C', score: 84, platform: 'Telegram', reach: 750000, engagement: 6.8, rank: 3, change: 'up' },
    { id: 'u4', handle: 'User D', score: 78, platform: 'Instagram', reach: 620000, engagement: 5.9, rank: 4, change: 'down' },
    { id: 'u5', handle: 'User E', score: 72, platform: 'X (Twitter)', reach: 510000, engagement: 5.2, rank: 5, change: 'same' },
    { id: 'u6', handle: 'User F', score: 67, platform: 'Facebook', reach: 420000, engagement: 4.8, rank: 6, change: 'up' },
    { id: 'u7', handle: 'User G', score: 61, platform: 'Reddit', reach: 350000, engagement: 4.3, rank: 7, change: 'down' },
    { id: 'u8', handle: 'User H', score: 56, platform: 'YouTube', reach: 280000, engagement: 3.9, rank: 8, change: 'same' }
  ],

  networkNodes: [],
  networkEdges: [],
  cascadeSteps: [
    { step: 1, from: 'Influencer (User A)', to: 'Community A', timestamp: '1:00 PM' },
    { step: 2, from: 'Community A', to: 'Community B', timestamp: '2:30 PM' },
    { step: 3, from: 'Community B', to: 'Community C', timestamp: '3:45 PM' },
    { step: 4, from: 'Community C', to: 'Cross-Platform', timestamp: '4:00 PM' }
  ],

  timelineEvents: [
    {
      id: 'ev1', time: '12:00 PM', label: 'Topic Appears', type: 'appear', icon: '📡',
      description: 'AI Regulation topic first detected on X (Twitter) with initial posts from policy researchers.',
      posts: [
        { author: '@PolicyExpert', text: 'New EU AI Act amendments could reshape how we build AI systems globally. #AIRegulation', platform: 'X (Twitter)', time: '12:02 PM', sentiment: 'neutral' },
        { author: '@TechAnalyst', text: 'Breaking: Major tech companies respond to proposed AI regulation framework. This is huge. #AIPolicy', platform: 'X (Twitter)', time: '12:15 PM', sentiment: 'positive' }
      ]
    },
    {
      id: 'ev2', time: '1:00 PM', label: 'Influencer Picks Up', type: 'influencer', icon: '👤',
      description: 'User A (score: 94) shares the topic, amplifying reach to 1.2M followers.',
      posts: [
        { author: 'User A', text: 'AI regulation is not just about control—it\'s about building trust. Every startup should pay attention. #AIRegulation', platform: 'X (Twitter)', time: '1:05 PM', sentiment: 'positive' },
        { author: 'User B', text: 'RT @UserA: Absolutely right. The industry needs guardrails, not roadblocks. #AISafety', platform: 'X (Twitter)', time: '1:22 PM', sentiment: 'positive' }
      ]
    },
    {
      id: 'ev3', time: '2:00 PM', label: 'Sentiment Shifts', type: 'sentiment_shift', icon: '📊',
      description: 'Sentiment swings from neutral/positive to mixed as counter-arguments emerge. Anxiety emotion spikes.',
      posts: [
        { author: '@StartupFounder', text: 'These regulations will kill innovation in India. Small companies can\'t afford compliance costs. #AIRegulation', platform: 'X (Twitter)', time: '2:10 PM', sentiment: 'negative' },
        { author: '@DevCommunity', text: 'ye regulations sirf bade companies ke liye hain, chhote developers ka kya hoga? #AIRegulation', platform: 'X (Twitter)', time: '2:30 PM', sentiment: 'negative' }
      ]
    },
    {
      id: 'ev4', time: '3:00 PM', label: 'Goes Viral', type: 'viral', icon: '🔥',
      description: 'Topic reaches viral status with 340% growth. Burst detection triggered. Community engagement peaks.',
      posts: [
        { author: '@NewsHandle', text: 'TRENDING: AI Regulation debate goes viral with over 50,000 posts in 3 hours. #AIRegulation', platform: 'X (Twitter)', time: '3:00 PM', sentiment: 'neutral' },
        { author: '@DataScientist', text: 'The data is clear—public opinion on AI regulation is deeply divided. Thread 🧵 #AIRegulation', platform: 'X (Twitter)', time: '3:15 PM', sentiment: 'neutral' }
      ]
    },
    {
      id: 'ev5', time: '4:00 PM', label: 'Cross-Platform Spread', type: 'cross_platform', icon: '🌐',
      description: 'Topic spreads from X to Telegram, Instagram and Reddit. Cascade: Influencer → Community A → B → C.',
      posts: [
        { author: 'TechChannel', text: 'Forwarded from X: The AI regulation debate has reached Telegram. Join the discussion.', platform: 'Telegram', time: '4:05 PM', sentiment: 'neutral' },
        { author: '@TechInfluencer', text: 'Posted about AI regulation on Instagram stories. The debate is everywhere now. #AIRegulation', platform: 'Instagram', time: '4:20 PM', sentiment: 'positive' }
      ]
    }
  ],

  translations: {
    en: {
      'app.title': 'Social Lens', 'app.subtitle': 'National Technical Research Organisation (NTRO)',
      'kpi.totalPosts': 'Total Posts', 'kpi.activeUsers': 'Active Users', 'kpi.trendingTopics': 'Trending Topics', 'kpi.sentimentSplit': 'Sentiment Split',
      'section.trending': 'Trending Topics', 'section.audience': 'Audience Demographics', 'section.influencers': 'Top Influencers',
      'section.network': 'Network Analysis', 'section.timeline': 'Topic Timeline', 'section.sentiment': 'Sentiment Over Time',
      'filter.platform': 'Platform', 'filter.dateRange': 'Date Range', 'filter.all': 'All Platforms',
      'action.export': 'Export', 'live.connected': 'Live Connected', 'live.newPosts': 'new posts',
      'positive': 'Positive', 'negative': 'Negative', 'neutral': 'Neutral',
      'label.age': 'Age Distribution', 'label.location': 'Top Locations', 'label.language': 'Languages', 'label.interests': 'Professional Interests',
      'label.score': 'Score', 'label.rank': 'Rank', 'label.platform': 'Platform', 'label.reach': 'Reach', 'label.engagement': 'Engagement',
      'status.rising': 'Rising', 'status.viral': 'Viral', 'status.stable': 'Stable', 'status.declining': 'Declining'
    },
    hi: {
      'app.title': 'सोशल लेंस', 'app.subtitle': 'राष्ट्रीय तकनीकी अनुसंधान संगठन (NTRO)',
      'kpi.totalPosts': 'कुल पोस्ट', 'kpi.activeUsers': 'सक्रिय उपयोगकर्ता', 'kpi.trendingTopics': 'ट्रेंडिंग विषय', 'kpi.sentimentSplit': 'भावना विभाजन',
      'section.trending': 'ट्रेंडिंग विषय', 'section.audience': 'दर्शक जनसांख्यिकी', 'section.influencers': 'शीर्ष प्रभावशाली',
      'section.network': 'नेटवर्क विश्लेषण', 'section.timeline': 'विषय समयरेखा', 'section.sentiment': 'समय के अनुसार भावना',
      'filter.platform': 'मंच', 'filter.dateRange': 'तारीख सीमा', 'filter.all': 'सभी मंच',
      'action.export': 'निर्यात करें', 'live.connected': 'लाइव कनेक्टेड', 'live.newPosts': 'नई पोस्ट',
      'positive': 'सकारात्मक', 'negative': 'नकारात्मक', 'neutral': 'तटस्थ',
      'label.age': 'आयु वितरण', 'label.location': 'शीर्ष स्थान', 'label.language': 'भाषाएँ', 'label.interests': 'पेशेवर रुचियाँ',
      'label.score': 'स्कोर', 'label.rank': 'रैंक', 'label.platform': 'मंच', 'label.reach': 'पहुँच', 'label.engagement': 'जुड़ाव',
      'status.rising': 'बढ़ रहा है', 'status.viral': 'वायरल', 'status.stable': 'स्थिर', 'status.declining': 'घट रहा है'
    }
  },

  generateNetwork() {
    const nodes = [];
    const edges = [];
    const communityLabels = ['Influencers', 'Community A', 'Community B', 'Community C'];

    // Influencer nodes
    this.influencers.slice(0, 3).forEach((inf, i) => {
      nodes.push({ id: inf.id, label: inf.handle, score: inf.score, community: 0, x: 300 + i * 120, y: 80, size: 28 + inf.score / 5 });
    });

    // Community nodes
    for (let comm = 1; comm <= 3; comm++) {
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        const cx = 150 + (comm - 1) * 200;
        const cy = 280 + (comm % 2) * 80;
        nodes.push({
          id: `c${comm}_n${j}`, label: `${communityLabels[comm]} #${j + 1}`, score: 20 + Math.round(Math.random() * 30),
          community: comm, x: cx + Math.cos(angle) * 70, y: cy + Math.sin(angle) * 70, size: 8 + Math.round(Math.random() * 10)
        });
      }
    }

    // Edges: influencers to community A
    nodes.filter(n => n.community === 0).forEach(inf => {
      nodes.filter(n => n.community === 1).slice(0, 3).forEach(target => {
        edges.push({ source: inf.id, target: target.id, weight: 3 + Math.random() * 5 });
      });
    });

    // Edges: community cascades
    for (let comm = 1; comm <= 2; comm++) {
      const fromN = nodes.filter(n => n.community === comm);
      const toN = nodes.filter(n => n.community === comm + 1);
      fromN.slice(0, 3).forEach(from => {
        toN.slice(0, 2).forEach(to => {
          edges.push({ source: from.id, target: to.id, weight: 1 + Math.random() * 3 });
        });
      });
    }

    // Internal community edges
    for (let comm = 1; comm <= 3; comm++) {
      const cn = nodes.filter(n => n.community === comm);
      for (let i = 0; i < cn.length; i++) {
        for (let j = i + 1; j < cn.length; j++) {
          if (Math.random() > 0.4) {
            edges.push({ source: cn[i].id, target: cn[j].id, weight: 1 + Math.random() * 2 });
          }
        }
      }
    }

    this.networkNodes = nodes;
    this.networkEdges = edges;
  }
};

// Generate network on load
SocialLensData.generateNetwork();

if (typeof window !== 'undefined') {
  window.SocialLensData = SocialLensData;
}
