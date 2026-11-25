import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Award, Image as ImageIcon, Calendar, Mail, Phone, MapPin, 
  Search, Shield, UserCheck, Edit3, Save, Plus, Trash2, ChevronRight, Sparkles, 
  ExternalLink, CheckCircle, AlertCircle, FileText, Download, LogOut, X, 
  Menu, Cpu, Code, Database, Globe, Lock, Terminal, BarChart2, Star, Clock, MessageSquare, AlertTriangle
} from 'lucide-react';

// Types
interface StudentMark {
  id: string;
  registerNo: string;
  name: string;
  programme: 'BCA' | 'MCA' | 'BSc CS';
  semester: number;
  dataStructures: number;
  databaseSystems: number;
  webTechnology: number;
  aiMachineLearning: number;
  softwareEngineering: number;
  attendance: number;
}

interface DiscrepancyTicket {
  id: string;
  registerNo: string;
  studentName: string;
  subject: string;
  currentMark: number;
  disputeReason: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  dateSubmitted: string;
}

// Initial mock student data
const initialStudents: StudentMark[] = [
  {
    id: '1',
    registerNo: 'CA2026BCA01',
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
    registerNo: 'CA2026BCA02',
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
    registerNo: 'CA2026MCA15',
    name: 'Rahul Verma',
    programme: 'MCA',
    semester: 2,
    dataStructures: 38,
    databaseSystems: 42,
    webTechnology: 45,
    aiMachineLearning: 46,
    softwareEngineering: 41,
    attendance: 88
  }
];

const initialTickets: DiscrepancyTicket[] = [
  {
    id: 't1',
    registerNo: 'CA2026BCA01',
    studentName: 'Aarav Sharma',
    subject: 'AI & Machine Learning',
    currentMark: 39,
    disputeReason: 'Mid-term assignment score of 12 marks was not added to the final internal total.',
    status: 'Pending',
    dateSubmitted: '2026-11-24'
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'marks' | 'discrepancies' | 'about' | 'contact'>('marks');
  
  // Auth & Role State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'faculty'>('guest');
  const [currentRegisterNo, setCurrentRegisterNo] = useState<string>('');
  const [loginInput, setLoginInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Marks Management State
  const [students, setStudents] = useState<StudentMark[]>(() => {
    const saved = localStorage.getItem('ca_dept_students_v2');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Discrepancy Tickets State
  const [tickets, setTickets] = useState<DiscrepancyTicket[]>(() => {
    const saved = localStorage.getItem('ca_dept_tickets_v2');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  // Faculty editing state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StudentMark | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<StudentMark, 'id'>>({
    registerNo: '',
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

  // Student Discrepancy Modal state
  const [discrepancyModalOpen, setDiscrepancyModalOpen] = useState(false);
  const [disputeSubject, setDisputeSubject] = useState('Data Structures');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // AI Advisor State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiConversation, setAiConversation] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Department & Marks Assistant. Ask me about your internal marks breakdown, exam regulations, or course syllabi.' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ca_dept_students_v2', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ca_dept_tickets_v2', JSON.stringify(tickets));
  }, [tickets]);

  // Handle Login
  const handleLogin = (role: 'student' | 'faculty') => {
    setLoginError('');
    if (role === 'student') {
      const regNo = loginInput.trim().toUpperCase();
      if (!regNo) {
        setLoginError('Please enter your Register Number (e.g. CA2026BCA01)');
        return;
      }
      const found = students.find(s => s.registerNo.toUpperCase() === regNo);
      if (found) {
        setUserRole('student');
        setCurrentRegisterNo(found.registerNo);
        setAuthModalOpen(false);
        setActiveTab('marks');
        setLoginInput('');
      } else {
        // Create demo student record if not found so user can test immediately
        const newDemoStudent: StudentMark = {
          id: Date.now().toString(),
          registerNo: regNo,
          name: 'Student ' + regNo,
          programme: regNo.includes('MCA') ? 'MCA' : regNo.includes('BSC') ? 'BSc CS' : 'BCA',
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
        setCurrentRegisterNo(regNo);
        setAuthModalOpen(false);
        setActiveTab('marks');
        setLoginInput('');
      }
    } else {
      setUserRole('faculty');
      setCurrentRegisterNo('FACULTY_ADMIN');
      setAuthModalOpen(false);
      setActiveTab('marks');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setCurrentRegisterNo('');
    setActiveTab('marks');
  };

  // Add Student handler
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.registerNo || !newStudent.name) return;
    const item: StudentMark = {
      id: Date.now().toString(),
      ...newStudent
    };
    setStudents(prev => [item, ...prev]);
    setIsAddingStudent(false);
    setNewStudent({
      registerNo: '',
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

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to remove this student record?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // Submit Discrepancy Ticket
  const handleDiscrepancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    const currentStudent = students.find(s => s.registerNo.toUpperCase() === currentRegisterNo.toUpperCase());
    const markMap: Record<string, number> = {
      'Data Structures': currentStudent?.dataStructures || 0,
      'Database Systems': currentStudent?.databaseSystems || 0,
      'Web Technology': currentStudent?.webTechnology || 0,
      'AI & Machine Learning': currentStudent?.aiMachineLearning || 0,
      'Software Engineering': currentStudent?.softwareEngineering || 0
    };

    const newTicket: DiscrepancyTicket = {
      id: Date.now().toString(),
      registerNo: currentRegisterNo,
      studentName: currentStudent?.name || 'Student',
      subject: disputeSubject,
      currentMark: markMap[disputeSubject] || 0,
      disputeReason: disputeReason.trim(),
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    setTickets(prev => [newTicket, ...prev]);
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setDiscrepancyModalOpen(false);
      setDisputeReason('');
    }, 2000);
  };

  // Resolve / Update ticket status (Faculty action)
  const handleResolveTicket = (ticketId: string, newStatus: 'Resolved' | 'Rejected') => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
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
          context: 'Department of Computer Applications internal marks and discrepancy portal. Students can view marks and report discrepancies for faculty review.'
        })
      });
      const data = await res.json();
      if (data.text) {
        setAiConversation(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setAiConversation(prev => [...prev, { sender: 'ai', text: 'I am here to help with your internal marks and department queries.' }]);
      }
    } catch (err) {
      console.error(err);
      setAiConversation(prev => [...prev, { sender: 'ai', text: 'AI assistant is currently offline.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 text-left shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
              CA
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block whitespace-nowrap">
                Computer Applications
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Internal Marks & Discrepancy Portal
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => setActiveTab('marks')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'marks' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Internal Marks Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('discrepancies')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 flex items-center gap-1.5 ${activeTab === 'discrepancies' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <span>Discrepancy Portal</span>
              {tickets.filter(t => t.status === 'Pending').length > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px]">
                  {tickets.filter(t => t.status === 'Pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('about')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${activeTab === 'about' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Department Info
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
              <span>AI Assistant</span>
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
                    {userRole === 'faculty' ? 'Faculty Admin' : `Student (${currentRegisterNo})`}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    ● Active Session
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
      <main className="py-12 max-w-7xl mx-auto px-6">
        
        {/* INTERNAL MARKS TAB */}
        {activeTab === 'marks' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Student Internal Marks Portal
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {userRole === 'faculty' ? 'Faculty Mode: Enter and update student names, register numbers, and subject marks.' : 
                   userRole === 'student' ? `Viewing marks for Register No: ${currentRegisterNo}` : 
                   'Please login as Faculty or Student to view or manage internal marks.'}
                </p>
              </div>

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
                  <button
                    onClick={() => setIsAddingStudent(true)}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Student</span>
                  </button>
                )}

                {userRole === 'student' && (
                  <button
                    onClick={() => setDiscrepancyModalOpen(true)}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Mark Discrepancy</span>
                  </button>
                )}
              </div>
            </div>

            {/* ADD STUDENT MODAL / FORM */}
            {isAddingStudent && (
              <div className="mb-10 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Student & Internal Marks</h3>
                  <button onClick={() => setIsAddingStudent(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddStudentSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Register Number</label>
                    <input 
                      type="text" 
                      required
                      value={newStudent.registerNo}
                      onChange={e => setNewStudent({...newStudent, registerNo: e.target.value})}
                      placeholder="e.g. CA2026BCA99" 
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg uppercase"
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
                      Save Record
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MARKS TABLE */}
            {userRole === 'guest' ? (
              <div className="p-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-6 text-2xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Portal Login Required</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                  Please log in as a student with your Register Number or log in as Faculty Admin to enter and view internal marks.
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
                    {userRole === 'faculty' ? 'All Student Internal Marks (Faculty Management View)' : `Internal Marks Record: ${currentRegisterNo}`}
                  </h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ● Database Synchronized
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-6">Register No</th>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Prog / Sem</th>
                        <th className="py-4 px-4 text-center">Data Structures</th>
                        <th className="py-4 px-4 text-center">Database Systems</th>
                        <th className="py-4 px-4 text-center">Web Tech</th>
                        <th className="py-4 px-4 text-center">AI & ML</th>
                        <th className="py-4 px-4 text-center">Software Eng</th>
                        <th className="py-4 px-4 text-center">Total (250)</th>
                        <th className="py-4 px-4 text-center">Attendance</th>
                        {userRole === 'faculty' && <th className="py-4 px-6 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {students
                        .filter(s => userRole === 'faculty' || s.registerNo.toUpperCase() === currentRegisterNo.toUpperCase())
                        .map((st) => {
                          const total = st.dataStructures + st.databaseSystems + st.webTechnology + st.aiMachineLearning + st.softwareEngineering;
                          const isEditing = editingStudentId === st.id;

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">{st.registerNo}</td>
                              <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                              <td className="py-4 px-6">{st.programme} - Sem {st.semester}</td>

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

        {/* DISCREPANCY PORTAL TAB */}
        {activeTab === 'discrepancies' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Mark Discrepancy & Correction Portal
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {userRole === 'faculty' ? 'Review student dispute tickets and resolve/update marks accordingly.' : 
                   userRole === 'student' ? 'Submit discrepancy requests if you notice any error in your internal scores.' : 
                   'Please login to submit or review mark discrepancy tickets.'}
                </p>
              </div>

              {userRole === 'student' && (
                <button
                  onClick={() => setDiscrepancyModalOpen(true)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Raise New Discrepancy</span>
                </button>
              )}
            </div>

            {/* Tickets Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Discrepancy & Dispute Tickets</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <th className="py-4 px-6">Ticket ID</th>
                      <th className="py-4 px-6">Student / Register No</th>
                      <th className="py-4 px-6">Subject</th>
                      <th className="py-4 px-4 text-center">Current Mark</th>
                      <th className="py-4 px-6">Discrepancy Reason</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      {userRole === 'faculty' && <th className="py-4 px-6 text-right">Faculty Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {tickets
                      .filter(t => userRole === 'faculty' || t.registerNo.toUpperCase() === currentRegisterNo.toUpperCase())
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">#{t.id.slice(-4)}</td>
                          <td className="py-4 px-6">
                            <span className="font-bold block text-slate-900 dark:text-white">{t.studentName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{t.registerNo}</span>
                          </td>
                          <td className="py-4 px-6 font-semibold">{t.subject}</td>
                          <td className="py-4 px-4 text-center tabular-nums font-bold">{t.currentMark}</td>
                          <td className="py-4 px-6 max-w-xs text-slate-600 dark:text-slate-400">{t.disputeReason}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                              t.status === 'Rejected' ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400' :
                              'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          {userRole === 'faculty' && (
                            <td className="py-4 px-6 text-right">
                              {t.status === 'Pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleResolveTicket(t.id, 'Resolved')}
                                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500"
                                  >
                                    Resolve & Approve
                                  </button>
                                  <button 
                                    onClick={() => handleResolveTicket(t.id, 'Rejected')}
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-500"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs italic">Closed</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    {tickets.filter(t => userRole === 'faculty' || t.registerNo.toUpperCase() === currentRegisterNo.toUpperCase()).length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No discrepancy tickets found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DEPARTMENT INFO TAB */}
        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Department of Computer Applications</h1>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
              The Department offers premier undergraduate (BCA, BSc CS) and postgraduate (MCA) programmes focusing on software engineering, cloud architecture, and artificial intelligence.
            </p>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Internal Assessment Guidelines</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Internal marks are calculated based on mid-term examinations, programming lab assignments, quizzes, and attendance. Students can verify their scores in real-time and submit discrepancy tickets through this secure portal.
              </p>
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Contact Department Office</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              For administrative support or marks verification inquiries, reach out to the department office.
            </p>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>exams.ca@university.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+1 (555) 382-9010</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Block B, Computer Applications Wing</span>
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
                Select your role to access internal marks & discrepancy system
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
                  Enter your Register Number (e.g. CA2026BCA01)
                </p>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    placeholder="Enter Register Number" 
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
                  Manage student names, register numbers, marks, and resolve discrepancies.
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

      {/* DISCREPANCY SUBMISSION MODAL */}
      {discrepancyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setDiscrepancyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Report Mark Discrepancy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Submit a correction request to faculty for review.
            </p>

            {disputeSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold mb-1">Discrepancy Reported Successfully!</h4>
                <p className="text-xs">Faculty will review your ticket and update your mark.</p>
              </div>
            ) : (
              <form onSubmit={handleDiscrepancySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Subject</label>
                  <select 
                    value={disputeSubject}
                    onChange={e => setDisputeSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Web Technology">Web Technology</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discrepancy Details / Reason</label>
                  <textarea 
                    rows={4} 
                    required
                    value={disputeReason}
                    onChange={e => setDisputeReason(e.target.value)}
                    placeholder="Describe why you believe there is a discrepancy in your marks..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setDiscrepancyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-500"
                  >
                    Submit Dispute
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI ASSISTANT MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full flex flex-col h-[600px] border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>AI Department Assistant</span>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendAiMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask about your marks or discrepancy process..."
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
              Internal Marks & Discrepancy Portal
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            © 2026 Department of Computer Applications. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
