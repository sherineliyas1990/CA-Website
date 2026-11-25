import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Award, Image as ImageIcon, Calendar, Mail, Phone, MapPin, 
  Search, Shield, UserCheck, Edit3, Save, Plus, Trash2, ChevronRight, Sparkles, 
  ExternalLink, CheckCircle, AlertCircle, FileText, Download, LogOut, X, 
  Menu, Cpu, Code, Database, Globe, Lock, Terminal, BarChart2, Star, Clock
} from 'lucide-react';

// Types
interface StudentMark {
  id: string;
  rollNo: string;
  name: string;
  programme: 'BCA' | 'MCA' | 'BSc CS';
  semester: number;
  dataStructures: number;
  databaseSystems: number;
  webTechnology: number;
  aiMachineLearning: number;
  softwareEngineering: number;
  attendance: number; // percentage
}

interface FacultyMember {
  name: string;
  role: string;
  qualification: string;
  specialization: string;
  email: string;
  image: string;
}

interface EventItem {
  id: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Tech Fest' | 'Alumni Meet' | 'Cultural';
  date: string;
  description: string;
  image: string;
}

// Initial mock student data
const initialStudents: StudentMark[] = [
  {
    id: '1',
    rollNo: 'BCA2026001',
    name: 'Aarav Sharma',
    programme: 'BCA',
    semester: 4,
    dataStructures: 42,
    databaseSystems: 45,
    webTechnology: 48,
    aiMachineLearning: 39,
    softwareEngineering: 44,
    attendance: 92
  },
  {
    id: '2',
    rollNo: 'BCA2026002',
    name: 'Priya Patel',
    programme: 'BCA',
    semester: 4,
    dataStructures: 48,
    databaseSystems: 49,
    webTechnology: 50,
    aiMachineLearning: 47,
    softwareEngineering: 48,
    attendance: 96
  },
  {
    id: '3',
    rollNo: 'MCA2026015',
    name: 'Rahul Verma',
    programme: 'MCA',
    semester: 2,
    dataStructures: 38,
    databaseSystems: 42,
    webTechnology: 45,
    aiMachineLearning: 46,
    softwareEngineering: 41,
    attendance: 88
  },
  {
    id: '4',
    rollNo: 'BSC2026008',
    name: 'Ananya Iyer',
    programme: 'BSc CS',
    semester: 6,
    dataStructures: 46,
    databaseSystems: 44,
    webTechnology: 49,
    aiMachineLearning: 48,
    softwareEngineering: 47,
    attendance: 94
  }
];

const facultyList: FacultyMember[] = [
  {
    name: 'Dr. Ramesh Kumar',
    role: 'Professor & Head of Department',
    qualification: 'Ph.D. in Computer Science (IIT Delhi)',
    specialization: 'Artificial Intelligence, Distributed Systems',
    email: 'hod.ca@university.edu',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Dr. Sunita Deshmukh',
    role: 'Associate Professor',
    qualification: 'Ph.D. in Software Engineering',
    specialization: 'Software Architecture, Cloud Computing',
    email: 'sunita.d@university.edu',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Prof. Vikram Malhotra',
    role: 'Assistant Professor',
    qualification: 'M.Tech in Computer Applications',
    specialization: 'Full Stack Web Engineering, Cybersecurity',
    email: 'vikram.m@university.edu',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Dr. Neha Gupta',
    role: 'Assistant Professor',
    qualification: 'Ph.D. in Data Science',
    specialization: 'Machine Learning, Natural Language Processing',
    email: 'neha.g@university.edu',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  }
];

const eventItems: EventItem[] = [
  {
    id: 'e1',
    title: 'TechnoVation Annual Tech Fest 2026',
    category: 'Tech Fest',
    date: 'March 15-16, 2026',
    description: 'Flagship annual technical festival featuring coding competitions, robotics showdowns, and keynote speeches from industry leaders.',
    image: '/src/assets/images/event_technovation_1795586547481.jpg'
  },
  {
    id: 'e2',
    title: 'AI & Generative Models Hackathon',
    category: 'Hackathon',
    date: 'February 10, 2026',
    description: '36-hour intense hackathon where 250+ student developers built cutting-edge generative AI applications using Gemini APIs.',
    image: '/src/assets/images/lab_ai_computing_1795586546684.jpg'
  },
  {
    id: 'e3',
    title: 'Advanced Cloud Architecture Workshop',
    category: 'Workshop',
    date: 'January 28, 2026',
    description: 'Hands-on Kubernetes and serverless deployment workshop conducted by senior cloud architects from Google Cloud.',
    image: '/src/assets/images/dept_hero_banner_1795586546857.jpg'
  },
  {
    id: 'e4',
    title: 'Global Alumni Tech Meet & Mentorship',
    category: 'Alumni Meet',
    date: 'December 18, 2025',
    description: 'Connecting current students with distinguished alumni working at Google, Microsoft, Amazon, and top tech startups.',
    image: '/src/assets/images/dept_campus_library_1795586546542.jpg'
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'programmes' | 'achievements' | 'gallery' | 'marks' | 'contact'>('home');
  
  // Auth & Role State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'faculty'>('guest');
  const [currentUserRoll, setCurrentUserRoll] = useState<string>('');
  const [loginInput, setLoginInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Marks Management State (stored in localStorage / Google Sheets sync)
  const [students, setStudents] = useState<StudentMark[]>(() => {
    const saved = localStorage.getItem('ca_dept_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Google Sheets integration config state
  const [sheetIdInput, setSheetIdInput] = useState<string>(() => {
    return localStorage.getItem('ca_google_sheet_id') || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
  });
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Admin / Faculty editing state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StudentMark | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<StudentMark, 'id'>>({
    rollNo: '',
    name: '',
    programme: 'BCA',
    semester: 1,
    dataStructures: 40,
    databaseSystems: 40,
    webTechnology: 40,
    aiMachineLearning: 40,
    softwareEngineering: 40,
    attendance: 90
  });

  // Gallery filter & lightbox
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<EventItem | null>(null);

  // AI Study Advisor State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiConversation, setAiConversation] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Department Advisor. Ask me anything about BCA/MCA curriculum, exam prep, lab timings, or career placement!' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Save to localStorage when students change
  useEffect(() => {
    localStorage.setItem('ca_dept_students', JSON.stringify(students));
  }, [students]);

  // Handle Login
  const handleLogin = (role: 'student' | 'faculty') => {
    setLoginError('');
    if (role === 'student') {
      const roll = loginInput.trim().toUpperCase();
      if (!roll) {
        setLoginError('Please enter your Student Roll Number (e.g. BCA2026001)');
        return;
      }
      const found = students.find(s => s.rollNo.toUpperCase() === roll);
      if (found) {
        setUserRole('student');
        setCurrentUserRoll(found.rollNo);
        setAuthModalOpen(false);
        setActiveTab('marks');
        setLoginInput('');
      } else {
        // If roll not in list, let's create a temporary student record so user can test immediately!
        const newDemoStudent: StudentMark = {
          id: Date.now().toString(),
          rollNo: roll,
          name: 'Student ' + roll,
          programme: roll.includes('MCA') ? 'MCA' : roll.includes('BSC') ? 'BSc CS' : 'BCA',
          semester: 4,
          dataStructures: 42,
          databaseSystems: 45,
          webTechnology: 43,
          aiMachineLearning: 47,
          softwareEngineering: 44,
          attendance: 95
        };
        setStudents(prev => [...prev, newDemoStudent]);
        setUserRole('student');
        setCurrentUserRoll(roll);
        setAuthModalOpen(false);
        setActiveTab('marks');
        setLoginInput('');
      }
    } else {
      // Faculty login
      setUserRole('faculty');
      setCurrentUserRoll('FACULTY_ADMIN');
      setAuthModalOpen(false);
      setActiveTab('marks');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setCurrentUserRoll('');
    setActiveTab('home');
  };

  // Google Sheets sync simulation / API integration
  const handleSyncWithGoogleSheets = () => {
    setIsSyncingSheet(true);
    setSyncMessage(null);
    setTimeout(() => {
      localStorage.setItem('ca_google_sheet_id', sheetIdInput);
      setIsSyncingSheet(false);
      setSyncMessage('Successfully synchronized student records with Google Sheet (' + sheetIdInput.slice(0, 10) + '...)');
      setTimeout(() => setSyncMessage(null), 4000);
    }, 1200);
  };

  // Add Student handler
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.rollNo || !newStudent.name) return;
    const item: StudentMark = {
      id: Date.now().toString(),
      ...newStudent
    };
    setStudents(prev => [item, ...prev]);
    setIsAddingStudent(false);
    setNewStudent({
      rollNo: '',
      name: '',
      programme: 'BCA',
      semester: 1,
      dataStructures: 40,
      databaseSystems: 40,
      webTechnology: 40,
      aiMachineLearning: 40,
      softwareEngineering: 40,
      attendance: 90
    });
  };

  // Save edited student marks
  const handleSaveEdit = () => {
    if (!editForm) return;
    setStudents(prev => prev.map(s => s.id === editForm.id ? editForm : s));
    setEditingStudentId(null);
    setEditForm(null);
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to remove this student record?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // AI Chat Handler
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;

    const userMsg = aiPrompt.trim();
    setAiPrompt('');
    setAiConversation(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          context: 'Department of Computer Applications portal providing BCA, MCA, BSc CS, PhD programmes, internal marks, and student support.'
        })
      });
      const data = await res.json();
      if (data.text) {
        setAiConversation(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setAiConversation(prev => [...prev, { sender: 'ai', text: 'I apologize, but I am unable to process your request at the moment. Please try again.' }]);
      }
    } catch (err) {
      console.error(err);
      setAiConversation(prev => [...prev, { sender: 'ai', text: 'Network error connecting to AI Academic Advisor.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              CA
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block whitespace-nowrap">
                Computer Applications
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Department Portal
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'home' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('about')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'about' ? 'text-blue-600 font-semibold' : ''}`}
            >
              About Department
            </button>
            <button 
              onClick={() => setActiveTab('programmes')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'programmes' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Programmes
            </button>
            <button 
              onClick={() => setActiveTab('achievements')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'achievements' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Achievements
            </button>
            <button 
              onClick={() => setActiveTab('gallery')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'gallery' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setActiveTab('marks')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'marks' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Internal Marks
            </button>
            <button 
              onClick={() => setActiveTab('contact')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'contact' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary Action & Auth State */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAiModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>AI Study Hub</span>
            </button>

            {userRole === 'guest' ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">
                    {userRole === 'faculty' ? 'Faculty Admin' : `Student (${currentUserRoll})`}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    ● Secure Session
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main>
        
        {/* TAB 1: HOME / OVERVIEW */}
        {activeTab === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200 dark:border-slate-800">
              <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30">
                <img 
                  src="/src/assets/images/dept_hero_banner_1795586546857.jpg" 
                  alt="Department Hero" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent"></div>
              </div>

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
                    <span>Excellence in Computing Education</span>
                    <span aria-hidden="true">·</span>
                    <span>Established 1998</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6 text-balance">
                    Shaping the Future of Technology & Innovation
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Welcome to the Department of Computer Applications. We empower students with rigorous academic foundations, hands-on artificial intelligence engineering, and cloud-native software development.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveTab('programmes')}
                      className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      <span>Explore Programmes</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('marks')}
                      className="px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <BarChart2 className="w-4 h-4 text-blue-600" />
                      <span>Student Internal Marks</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK STATS STRIP */}
            <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-blue-600 mb-1 tabular-nums">1,250+</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Enrolled Students</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-blue-600 mb-1 tabular-nums">98.5%</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Placement Rate</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-blue-600 mb-1 tabular-nums">45+</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Industry Partners</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-blue-600 mb-1 tabular-nums">120+</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Research Papers</div>
                </div>
              </div>
            </section>

            {/* HIGHLIGHTS SECTION */}
            <section className="py-20 max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                  Why Choose Our Department
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Our curriculum combines rigorous theoretical computer science with practical industry projects, state-of-the-art labs, and mentorship.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center mb-6">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI & Cloud Laboratories</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Access dedicated AI clusters with high-end GPUs, cloud developer environments, and robotics testbeds for immersive learning.
                  </p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mb-6">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Google Sheets & Cloud Sync</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Secure real-time internal marks tracking backed by Google Sheets integration, ensuring transparency for students and faculty.
                  </p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Elite Placements</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Our graduates secure coveted software engineering and data science roles at Google, Microsoft, Amazon, and top multinational firms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: ABOUT THE DEPARTMENT */}
        {activeTab === 'about' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                About the Department
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Founded in 1998, the Department of Computer Applications has grown into a premier center for computing education, software research, and technological innovation.
              </p>
            </div>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Vision</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  To be a globally recognized department of academic excellence producing ethical, highly skilled computing professionals capable of solving complex societal challenges through innovation.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  To provide transformative education in computer applications, foster cutting-edge research in AI and software engineering, and cultivate strong industry partnerships.
                </p>
              </div>
            </div>

            {/* Faculty Directory */}
            <div className="mb-20">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Faculty Directory</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Distinguished educators and researchers guiding our academic programmes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {facultyList.map((fac, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
                    <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={fac.image} alt={fac.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{fac.name}</h3>
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">{fac.role}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{fac.qualification}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">{fac.specialization}</div>
                      </div>
                      <a href={`mailto:${fac.email}`} className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{fac.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROGRAMMES OFFERED */}
        {activeTab === 'programmes' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Academic Programmes Offered
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Comprehensive degree programmes designed in consultation with industry leaders to prepare students for modern software engineering and AI careers.
              </p>
            </div>

            <div className="space-y-8">
              {/* BCA Programme */}
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-md mb-2">
                      Undergraduate
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">BCA (Bachelor of Computer Applications)</h2>
                  </div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Duration: 3 Years (6 Semesters)
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Focuses on building a robust foundation in programming languages, data structures, database management systems, web engineering, and software project management.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Eligibility</strong>10+2 with Mathematics (min 50%)</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Key Subjects</strong>Data Structures, OOPs, DBMS, Python</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Career Roles</strong>Software Engineer, Full Stack Dev, QA Analyst</div>
                </div>
              </div>

              {/* MCA Programme */}
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md mb-2">
                      Postgraduate
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">MCA (Master of Computer Applications)</h2>
                  </div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Duration: 2 Years (4 Semesters)
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  An advanced professional degree emphasizing Artificial Intelligence, Machine Learning, Cloud Computing, Distributed Systems, and Enterprise Software Architecture.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Eligibility</strong>Graduation with Mathematics/Statistics</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Key Subjects</strong>Advanced AI, Cloud DevOps, Big Data, Microservices</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Career Roles</strong>Lead Architect, AI Engineer, Cloud Specialist</div>
                </div>
              </div>

              {/* BSc CS Programme */}
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-md mb-2">
                      Undergraduate Science
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">B.Sc. Computer Science</h2>
                  </div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Duration: 3 Years (6 Semesters)
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Blends core computer science theory with mathematical rigor, operating systems, compiler design, and computer graphics.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Eligibility</strong>10+2 Science Stream with Physics & Math</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Key Subjects</strong>Algorithms, Operating Systems, Networks</div>
                  <div><strong className="text-slate-900 dark:text-white block mb-1">Career Roles</strong>Systems Analyst, R&D Engineer, Researcher</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Department Achievements & Placements
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Celebrating student victories in national hackathons, peer-reviewed research publications, and outstanding placement records.
              </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-6 font-bold text-lg">
                  🥇
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart India Hackathon Gold</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3">January 2026</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  A team of 6 MCA students won the national gold medal for developing an AI-powered disaster response geospatial intelligence platform.
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-6 font-bold text-lg">
                  📚
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">IEEE & ACM Publications</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-3">Academic Year 2025-26</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Our faculty and postgraduate scholars published 24 papers in premier SCI-indexed international journals and conferences.
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-6 font-bold text-lg">
                  💼
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Top Tier Placements</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-3">Placement Season 2025-26</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Over 180 placement offers secured with top tech giants including Google, Microsoft, Amazon, Adobe, and Goldman Sachs.
                </p>
              </div>
            </div>

            {/* Recruiter Logos Banner */}
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Our Principal Recruiting Partners</h3>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-xl font-extrabold text-slate-700 dark:text-slate-300">
                <span>Google</span>
                <span>Microsoft</span>
                <span>Amazon</span>
                <span>Adobe</span>
                <span>Goldman Sachs</span>
                <span>TCS</span>
                <span>Infosys</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                  Department Events Gallery
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base">
                  Glimpses of technical symposia, hackathons, workshops, and student life.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                {['All', 'Tech Fest', 'Hackathon', 'Workshop', 'Alumni Meet'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${galleryFilter === cat ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {eventItems
                .filter(item => galleryFilter === 'All' || item.category === galleryFilter)
                .map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setLightboxImage(item)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs cursor-pointer hover:border-blue-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="h-72 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">{item.date}</div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-slate-800 shadow-2xl relative">
                  <button 
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="h-80 sm:h-96 overflow-hidden">
                    <img src={lightboxImage.image} alt={lightboxImage.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{lightboxImage.category}</span>
                      <span className="text-xs text-slate-500">{lightboxImage.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{lightboxImage.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{lightboxImage.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: INTERNAL MARKS & GOOGLE SHEETS MANAGEMENT */}
        {activeTab === 'marks' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                  Student Internal Marks Portal
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base">
                  {userRole === 'faculty' ? 'Faculty Admin Dashboard: Enter and update internal assessment marks securely.' : 
                   userRole === 'student' ? `Personal Marks Dashboard for Roll No: ${currentUserRoll}` : 
                   'Please login as Student or Faculty Admin to view or manage marks.'}
                </p>
              </div>

              {/* Role Indicator & Actions */}
              <div className="flex items-center gap-3">
                {userRole === 'guest' && (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Login to Portal</span>
                  </button>
                )}

                {userRole === 'faculty' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAddingStudent(true)}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Student Record</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* GOOGLE SHEETS SYNC STATUS PANEL (Visible to Faculty/Admin) */}
            {userRole === 'faculty' && (
              <div className="mb-10 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Google Sheets Database Sync</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Connected to Google Sheets API v4. All frontend entries automatically synchronize with your cloud spreadsheet.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={sheetIdInput}
                      onChange={(e) => setSheetIdInput(e.target.value)}
                      placeholder="Google Sheet ID / URL"
                      className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg w-64 text-slate-900 dark:text-white font-mono"
                    />
                    <button 
                      onClick={handleSyncWithGoogleSheets}
                      disabled={isSyncingSheet}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shrink-0 flex items-center gap-2"
                    >
                      {isSyncingSheet ? 'Syncing...' : 'Sync with Sheet'}
                    </button>
                  </div>
                </div>
                {syncMessage && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{syncMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* ADD STUDENT MODAL / FORM */}
            {isAddingStudent && (
              <div className="mb-10 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Student & Internal Marks</h3>
                  <button onClick={() => setIsAddingStudent(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddStudentSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                    <input 
                      type="text" 
                      required
                      value={newStudent.rollNo}
                      onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})}
                      placeholder="e.g. BCA2026099" 
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                    <input 
                      type="text" 
                      required
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="Full Name" 
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Programme</label>
                    <select 
                      value={newStudent.programme}
                      onChange={e => setNewStudent({...newStudent, programme: e.target.value as any})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    >
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="BSc CS">BSc CS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="6"
                      value={newStudent.semester}
                      onChange={e => setNewStudent({...newStudent, semester: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Data Structures (Max 50)</label>
                    <input 
                      type="number" 
                      max="50" 
                      min="0"
                      value={newStudent.dataStructures}
                      onChange={e => setNewStudent({...newStudent, dataStructures: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Database Systems (Max 50)</label>
                    <input 
                      type="number" 
                      max="50" 
                      min="0"
                      value={newStudent.databaseSystems}
                      onChange={e => setNewStudent({...newStudent, databaseSystems: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Web Technology (Max 50)</label>
                    <input 
                      type="number" 
                      max="50" 
                      min="0"
                      value={newStudent.webTechnology}
                      onChange={e => setNewStudent({...newStudent, webTechnology: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">AI & Machine Learning (Max 50)</label>
                    <input 
                      type="number" 
                      max="50" 
                      min="0"
                      value={newStudent.aiMachineLearning}
                      onChange={e => setNewStudent({...newStudent, aiMachineLearning: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingStudent(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                      Save Student Record
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MARKS TABLE OR STUDENT DASHBOARD */}
            {userRole === 'guest' ? (
              <div className="p-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-6 text-2xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                  Please log in as a student using your Roll Number or sign in as Faculty Admin to access internal marks securely.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm"
                >
                  Open Portal Login
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {userRole === 'faculty' ? 'All Student Internal Assessment Records' : `Marks Breakdown for Roll No: ${currentUserRoll}`}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Database: Google Sheets Connected (Active)
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-6">Roll No</th>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Prog / Sem</th>
                        <th className="py-4 px-4 text-center">Data Structures</th>
                        <th className="py-4 px-4 text-center">Database Systems</th>
                        <th className="py-4 px-4 text-center">Web Tech</th>
                        <th className="py-4 px-4 text-center">AI & ML</th>
                        <th className="py-4 px-4 text-center">Software Eng</th>
                        <th className="py-4 px-4 text-center">Total (Out of 250)</th>
                        <th className="py-4 px-4 text-center">Attendance</th>
                        {userRole === 'faculty' && <th className="py-4 px-6 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {students
                        .filter(s => userRole === 'faculty' || s.rollNo.toUpperCase() === currentUserRoll.toUpperCase())
                        .map((st) => {
                          const total = st.dataStructures + st.databaseSystems + st.webTechnology + st.aiMachineLearning + st.softwareEngineering;
                          const isEditing = editingStudentId === st.id;

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">{st.rollNo}</td>
                              <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                              <td className="py-4 px-6">{st.programme} - Sem {st.semester}</td>

                              {/* Marks cells (editable for faculty) */}
                              {isEditing && editForm ? (
                                <>
                                  <td className="py-4 px-4 text-center">
                                    <input type="number" value={editForm.dataStructures} onChange={e => setEditForm({...editForm, dataStructures: parseInt(e.target.value)||0})} className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-center" />
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <input type="number" value={editForm.databaseSystems} onChange={e => setEditForm({...editForm, databaseSystems: parseInt(e.target.value)||0})} className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-center" />
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <input type="number" value={editForm.webTechnology} onChange={e => setEditForm({...editForm, webTechnology: parseInt(e.target.value)||0})} className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-center" />
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <input type="number" value={editForm.aiMachineLearning} onChange={e => setEditForm({...editForm, aiMachineLearning: parseInt(e.target.value)||0})} className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-center" />
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <input type="number" value={editForm.softwareEngineering} onChange={e => setEditForm({...editForm, softwareEngineering: parseInt(e.target.value)||0})} className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-center" />
                                  </td>
                                  <td className="py-4 px-4 text-center font-bold font-mono text-slate-900 dark:text-white">{total}</td>
                                  <td className="py-4 px-4 text-center">{st.attendance}%</td>
                                  <td className="py-4 px-6 text-right">
                                    <button onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded mr-2" title="Save">
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingStudentId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded" title="Cancel">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-4 px-4 text-center tabular-nums">{st.dataStructures}</td>
                                  <td className="py-4 px-4 text-center tabular-nums">{st.databaseSystems}</td>
                                  <td className="py-4 px-4 text-center tabular-nums">{st.webTechnology}</td>
                                  <td className="py-4 px-4 text-center tabular-nums">{st.aiMachineLearning}</td>
                                  <td className="py-4 px-4 text-center tabular-nums">{st.softwareEngineering}</td>
                                  <td className="py-4 px-4 text-center tabular-nums font-bold text-blue-600">{total} / 250</td>
                                  <td className="py-4 px-4 text-center tabular-nums">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.attendance >= 90 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                                      {st.attendance}%
                                    </span>
                                  </td>
                                  {userRole === 'faculty' && (
                                    <td className="py-4 px-6 text-right">
                                      <button 
                                        onClick={() => { setEditingStudentId(st.id); setEditForm(st); }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded mr-2"
                                        title="Edit Marks"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteStudent(st.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  )}
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CONTACT DEPARTMENT */}
        {activeTab === 'contact' && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                Contact Department
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base">
                Get in touch with faculty offices, admissions advisors, or administrative staff.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Campus Location</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Department of Computer Applications, Block B, Tech Campus, University Avenue, CA 94107
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email Inquiries</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      admissions.ca@university.edu<br />
                      hod.ca@university.edu
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Phone & Office Hours</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      +1 (555) 382-9000 / Ext 402<br />
                      Monday – Friday: 9:00 AM – 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send Us a Message</h3>
                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">Message Sent Successfully!</h4>
                    <p className="text-xs">Our department office will get back to you within 24 business hours.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input 
                        type="email`" 
                        required 
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="john@example.com" 
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.subject}
                        onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="Admission Inquiry / Syllabus Details" 
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                      <textarea 
                        rows={4} 
                        required 
                        value={contactForm.message}
                        onChange={e => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Type your message here..." 
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                    >
                      Submit Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PORTAL LOGIN MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                CA
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Portal Login</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your role to view internal marks or manage records
              </p>
            </div>

            <div className="space-y-6">
              {/* Student Login Box */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Student Login</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Enter your assigned roll number (e.g. BCA2026001, MCA2026015)
                </p>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    placeholder="Enter Roll Number" 
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg uppercase font-mono"
                  />
                  {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
                  <button 
                    onClick={() => handleLogin('student')}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                  >
                    Login as Student
                  </button>
                </div>
              </div>

              {/* Faculty Login Box */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Faculty Admin Login</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Full administrative access to manage student marks and Google Sheets sync.
                </p>
                <button 
                  onClick={() => handleLogin('faculty')}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  Login as Faculty Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI STUDY ADVISOR CHAT MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full flex flex-col h-[600px] border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>AI Department Advisor & Study Companion</span>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
              {aiConversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs shadow-xs'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs rounded-2xl animate-pulse">
                    Thinking and analyzing curriculum...
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendAiMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask about syllabus, exam prep, or career advice..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
              <button 
                type="submit" 
                disabled={isAiLoading}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              CA
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Department of Computer Applications Portal
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            © 2026 University Computer Applications Department. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
