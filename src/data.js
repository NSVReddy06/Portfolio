// ─────────────────────────────────────────────────────────────
//  All site content lives here. Edit this file to update the site.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Sai Vikas Reddy',
  fullName: 'Nallamilli Sai Vikas Reddy',
  initials: 'SV',
  role: 'AI & ML Engineer',
  location: 'Bengaluru, India',
  email: 'saivikasreddy213@gmail.com',

  // Paste your URLs here. Links left empty are hidden on the site.
  linkedin: 'https://www.linkedin.com/in/blueobserver/',
  github: '', // e.g. 'https://github.com/your-handle'

  roles: [
    'AI & ML Engineer',
    'Deep Learning Practitioner',
    'Time-Series Forecaster',
    'LLM & Agentic AI Builder',
  ],
  tagline:
    'I build production-grade forecasting engines and LLM applications that turn raw enterprise signals into decisions.',
  summary: [
    'I’m an AI & ML Engineer with 3+ years of enterprise experience at Wipro, specializing in deep learning, predictive modeling and generative AI workflows.',
    'I architected Wipro’s enterprise demand prediction framework, which moved workforce planning from reactive fulfillment to forward-looking, signal-driven decisions. That work won the GWFM Global Industry Excellence Award 2024.',
    'These days I build agentic LLM systems: RAG pipelines that read contracts, and learning assistants that remember where you got confused.',
  ],
}

export const stats = [
  { value: 3, suffix: '+', label: 'Years in enterprise AI' },
  { value: 1, suffix: '', label: 'Global industry award' },
  { value: 2, suffix: '', label: 'Top-4 hackathon finishes in 2026' },
]

export const experience = [
  {
    company: 'Wipro Limited',
    role: 'Project Engineer, AI / ML Engineer',
    period: '2023 – Present',
    location: 'Bengaluru, India',
    points: [
      {
        title: 'Enterprise Demand Prediction Engine',
        text: 'Architected and deployed an enterprise-grade AI forecasting pipeline, transitioning workforce planning from reactive fulfillment to forward-looking, signal-driven decision intelligence across SMUs and SLs.',
      },
      {
        title: 'Deep Learning Architectures',
        text: 'Engineered parallel LSTM and Transformer-Encoder time-series models for workforce sequence forecasting. Deployed the LSTM to production as the core backbone after it delivered better accuracy than the baseline models.',
      },
      {
        title: 'Contract Intelligence & Rate Estimation Agent',
        text: 'Built an automated COLA clause detection and rate estimation engine on GCP. Contract documents are ingested into Cloud Storage, and RAG Engine with GCP Agent Runtime extracts contractual parameters and calculates revised rates in real time.',
      },
      {
        title: 'Feature Engineering & Accuracy',
        text: 'Designed multi-variate feature pipelines using allocations, cancellations, lead-time and duration metrics to establish 1/2/3-Star demand categorizations.',
      },
      {
        title: 'Agentic LLM Platform (ATLAS POC)',
        text: 'Built a proof-of-concept LLM learning assistant with 5-level confusion resolution memory, dynamic quiz generation and real-time interactive code feedback.',
      },
    ],
  },
]

export const projects = [
  {
    title: 'Enterprise Demand Prediction Engine',
    kicker: 'Forecasting · Award-winning',
    description:
      'An enterprise AI forecasting pipeline that predicts workforce demand across business units, so planners act on signals instead of reacting to requests.',
    highlights: [
      'Parallel LSTM vs Transformer-Encoder experiments',
      'LSTM deployed to production as the core backbone',
      'Won the GWFM Global Industry Excellence Award 2024',
    ],
    tags: ['LSTM', 'Transformer', 'Time-Series', 'Python'],
    accent: '#22d3ee',
    icon: 'chart',
  },
  {
    title: 'COLA Contract Intelligence Agent',
    kicker: 'RAG · GCP',
    description:
      'Reads client contracts, detects Cost-of-Living Adjustment clauses and calculates revised billing rates in real time.',
    highlights: [
      'Contract ingestion into Cloud Storage',
      'RAG Engine + GCP Agent Runtime for parameter extraction',
      'Real-time revised-rate calculation',
    ],
    tags: ['GCP', 'RAG', 'Agents', 'LLM'],
    accent: '#a78bfa',
    icon: 'doc',
  },
  {
    title: 'ATLAS: Agentic Learning Assistant',
    kicker: 'LLM · Proof of concept',
    description:
      'An LLM tutor that tracks where a learner is confused, then adapts with quizzes and live code feedback.',
    highlights: [
      '5-level confusion resolution memory',
      'Dynamic quiz generation',
      'Real-time interactive code feedback',
    ],
    tags: ['Agentic AI', 'LLM', 'Memory', 'EdTech'],
    accent: '#f472b6',
    icon: 'brain',
  },
  {
    title: 'Demand Categorization Pipeline',
    kicker: 'Feature Engineering',
    description:
      'Multi-variate feature pipelines that turn allocation and cancellation history into 1/2/3-Star demand quality ratings.',
    highlights: [
      'Allocation, cancellation, lead-time and duration signals',
      '1/2/3-Star demand categorization',
      'Feeds the forecasting engine',
    ],
    tags: ['Pandas', 'Scikit-Learn', 'SQL', 'Features'],
    accent: '#34d399',
    icon: 'layers',
  },
]

export const skills = {
  'Languages & Data': ['Python', 'SQL', 'Pandas', 'NumPy', 'MongoDB'],
  'ML & Deep Learning': ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'LSTM', 'Transformers'],
  'AI Systems': ['LLMs', 'RAG', 'Agentic AI', 'GCP Agent Runtime', 'Time-Series Forecasting'],
  'Tooling': ['Git', 'VS Code', 'GitHub Copilot', 'Google Cloud'],
}

// Words floating in the 3D skill sphere
export const sphereWords = [
  'Python', 'PyTorch', 'TensorFlow', 'LSTM', 'Transformers', 'LLMs', 'RAG',
  'Agents', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'GCP', 'MongoDB',
  'Forecasting', 'Deep Learning', 'Feature Eng.', 'Git', 'Time-Series',
  'GenAI', 'Copilot', 'Embeddings', 'Attention', 'Cloud Storage',
]

export const awards = [
  {
    title: 'Global Industry Excellence Award',
    org: 'GWFM',
    year: '2024',
    place: 'Winner',
    text: 'For architecting Wipro’s enterprise demand prediction framework.',
    tier: 'gold',
  },
  {
    title: 'HackOn: Agentic AI with Bob & watsonx Challenge',
    org: 'HackOn',
    year: '2026',
    place: '3rd Place',
    text: 'Agentic AI challenge built with Bob and watsonx.',
    tier: 'bronze',
  },
  {
    title: 'Gemini Enterprise Hackathon',
    org: 'Gemini Enterprise',
    year: '2026',
    place: '4th Place',
    text: 'Enterprise generative AI hackathon built on Gemini.',
    tier: 'silver',
  },
]

export const certifications = [
  { name: 'Machine Learning with Python', issuer: 'Coursera' },
  { name: 'Introduction to Data Science in Python', issuer: 'Coursera' },
  { name: 'Java Fullstack Certification', issuer: 'RPS Consulting' },
  { name: 'Problem Solving in C / C++', issuer: 'NPTEL' },
]

export const education = [
  {
    degree: 'B.Tech',
    school: 'Vignan’s Lara Institute of Technology & Science',
    board: 'JNTUK',
    score: '7.5 CGPA',
    period: '2018 – 2022',
  },
  {
    degree: 'Intermediate (12th)',
    school: 'Sri Chaitanya Junior College',
    board: 'APBIE',
    score: '96.7%',
    period: '2016 – 2018',
  },
  {
    degree: '10th (SSC)',
    school: 'Sri Chaitanya Techno School',
    board: 'BSEAP',
    score: '9.5 GPA',
    period: '2016',
  },
]

export const interests = ['Web novels', 'Geopolitics', 'Business case studies']
