export const portfolio = {
  name: 'Harsh Sharma',
  shortName: 'Harsh',
  role: 'Software Developer',
  specialization: 'Computer Science Engineering Student',
  focus: '/ COMPUTER SCIENCE ENGINEERING',
  year: '©2026',
  email: 'harshsharmarohta@gmail.com',
  github: 'https://github.com/harshxyxo',
  linkedin: 'https://www.linkedin.com/in/harsh-sharma-3428a430b',
  education: {
    status: 'Currently pursuing',
    degree: 'B.Tech Computer Science & Engineering',
    field: 'Software Development & Systems'
  },
  journey: [
    {
      id: 'current-degree',
      isCurrent: true,
      currentLabel: 'Final-year student',
      date: '2023 – 2027 · Ongoing',
      title: 'B.Tech in Computer Science & Engineering',
      place: 'MIET (Meerut Institute of Engineering and Technology)',
      affiliation: 'Affiliated with AKTU',
      description: 'Currently in the final year of B.Tech CSE, focusing on core computing foundations, full-stack software development, and algorithm design.'
    },
    {
      id: 'core-foundations',
      isCurrent: false,
      date: 'Academic Foundations',
      title: 'Systems & Core CS Curriculum',
      place: 'Department of Computer Science',
      affiliation: 'MIET / AKTU',
      description: 'Rigorous coursework spanning Data Structures & Algorithms, Database Management Systems, Operating Systems, and Object-Oriented Software Design.'
    },
    {
      id: 'practical-engineering',
      isCurrent: false,
      date: 'Engineering Practice',
      title: 'Software Development & Projects',
      place: 'Personal & Academic Lab Work',
      affiliation: 'Independent Engineering',
      description: 'Building practical web and software applications including expense management systems, interactive audio interfaces, placement trackers, and ML predictive models.'
    }
  ],
  skills: [
    {
      id: 'languages-frameworks',
      category: 'Languages & Frameworks',
      note: 'Core programming languages, typed web technologies, and backend microframeworks.',
      items: ['Java', 'JavaScript', 'TypeScript', 'Python', 'FastAPI', 'React', 'Vite', 'Tailwind CSS']
    },
    {
      id: 'backend-architecture',
      category: 'Backend & Web Architecture',
      note: 'Robust API protocols, cloud deployment pipelines, and scalable database systems.',
      items: ['RESTful APIs', 'SQL', 'MySQL', 'MongoDB', 'Vercel', 'Git', 'GitHub']
    },
    {
      id: 'systems-cs',
      category: 'Core CS & Systems Foundations',
      note: 'Foundational computer science principles, algorithmic optimization, and system design paradigms.',
      items: [
        'Data Structures & Algorithms',
        'OOP',
        'DBMS',
        'HTML',
        'CSS'
      ]
    }
  ],
  bioLead: "A focused space for my software projects, learning, and the work I'm preparing to share.",
  projects: [
    {
      id: 'paisa-track',
      number: '01',
      name: 'PaisaTrack',
      type: 'Web Application',
      category: 'Financial Management',
      tagline: 'Expense & budget tracking application.',
      summary: 'A personal finance management application for income and expense tracking, financial analytics, budget goals, bill splitting, receipt scanning and an AI financial advisor.',
      previewText: 'Expense tracking & financial clarity',
      stack: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'Vercel'],
      status: 'Core features built & deployed',
      details: 'PaisaTrack provides a structured and focused dashboard to log daily transactions, categorize expenditures, monitor budget thresholds, split bills with friends, scan receipts, and consult an AI financial advisor for analytical spending insights.',
      github: 'https://github.com/harshxyxo/PaisaTrack',
      live: 'https://paisa-track-zeta.vercel.app/login'
    },
    {
      id: 'groovra',
      number: '02',
      name: 'Groovra',
      type: 'Web Application',
      category: 'Audio & Music',
      tagline: 'Interactive music streaming platform.',
      summary: 'A modern music streaming web application with authentication, music listening experience, listening analytics and responsive mobile-first navigation.',
      previewText: 'Music streaming & playlist discovery',
      stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Node.js', 'Vercel'],
      status: 'Live & active',
      details: 'Groovra delivers an interactive frontend experience for audio playback, browseable track collections, listening analytics, authentication, and playlist management with smooth user interactions and responsive mobile-first views.',
      github: 'https://github.com/harshxyxo/music-app',
      live: 'https://music-app-web-fawn.vercel.app/'
    },
    {
      id: 'cardiosense-ai',
      number: '03',
      name: 'CardioSense AI',
      type: 'Machine Learning Research',
      category: 'Healthcare & ML',
      tagline: 'Drug-related cardiac prediction engine.',
      summary: 'A machine-learning research project using a Transformer model and synthetic oversampling for drug-related cardiac prediction.',
      previewText: 'Transformer cardiac prediction engine',
      stack: ['Python', 'Transformers', 'Deep Learning', 'Synthetic Oversampling', 'Machine Learning'],
      status: 'In Progress',
      isInProgress: true,
      details: 'CardioSense AI focuses on evaluating potential cardiotoxicity in drug candidates through transformer-based sequence and molecular representations coupled with synthetic oversampling to mitigate severe class imbalances. Currently in active research and model prototyping.',
      github: null,
      live: null
    },
    {
      id: 'placement-study-tracker',
      number: '04',
      name: 'Placement Study Tracker',
      type: 'Web Platform',
      category: 'Education & Career',
      tagline: 'Study and placement preparation tracking platform.',
      summary: 'A study and placement preparation tracking platform designed to organize learning and monitor preparation progress.',
      previewText: 'Structured syllabus & study progress tracker',
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Java', 'Spring Boot', 'MongoDB'],
      status: 'Live & active',
      details: 'Designed to help students systematically prepare for technical interviews and campus placements. Organizes coding problem tracks, tracks conceptual revisions, and provides progress analytics across core CS topics and coding practice.',
      github: 'https://github.com/harshxyxo/PlacementStudyTracker',
      live: 'https://placement-study-tracker.vercel.app/'
    },
    {
      id: 'speakspark-ai',
      number: '05',
      name: 'SpeakSpark AI',
      type: 'AI Web Application',
      category: 'AI & Productivity',
      tagline: 'AI-assisted public speaking practice application.',
      summary: 'An AI-assisted public speaking practice application featuring speaking topics, topic shuffle animation, speech timer, saved topics and Gemini-powered topic generation.',
      previewText: 'Gemini-powered public speaking coach',
      stack: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'Google Gemini API'],
      status: 'Live & active',
      details: 'SpeakSpark AI empowers speakers to build confidence and impromptu speaking fluency. Features instant topic shuffling animations, an active countdown speech timer, custom saved topics library, and Gemini API integration for on-demand contextual prompts.',
      github: 'https://github.com/harshxyxo/speakspark',
      live: 'https://speakspark-coral.vercel.app/'
    }
  ]
}
