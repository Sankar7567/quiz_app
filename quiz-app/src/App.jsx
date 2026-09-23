import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  Moon, 
  Sun, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Trophy,
  BookOpen
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "What does the 'M' stand for in the MERN stack?",
    options: ["MySQL", "MongoDB", "MariaDB", "MemoryDB"],
    correct: 1,
    explanation: "MongoDB is the document-based NoSQL database in the MERN stack."
  },
  {
    id: 2,
    question: "Which React hook is designed to manage side effects in functional components?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correct: 2,
    explanation: "`useEffect` handles lifecycle tasks like fetching data, subscriptions, and DOM updates."
  },
  {
    id: 3,
    question: "In Express.js, which method registers global or path-specific middleware?",
    options: ["app.use()", "app.get()", "app.listen()", "app.route()"],
    correct: 0,
    explanation: "`app.use()` mounts middleware functions to the Express request processing pipeline."
  },
  {
    id: 4,
    question: "What file in a Node.js project defines dependencies and script configurations?",
    options: ["package.xml", "package.json", "package.yaml", "package.config"],
    correct: 1,
    explanation: "`package.json` holds metadata, dependencies, and execution scripts for Node projects."
  },
  {
    id: 5,
    question: "Which MongoDB method retrieves documents from a database collection?",
    options: ["db.collection.search()", "db.collection.find()", "db.collection.get()", "db.collection.select()"],
    correct: 1,
    explanation: "`db.collection.find()` queries and returns matching documents from a collection."
  },
  {
    id: 6,
    question: "What does JSX stand for in React development?",
    options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java Serialized XML"],
    correct: 0,
    explanation: "JSX stands for JavaScript XML, allowing HTML-like templates inside JavaScript."
  },
  {
    id: 7,
    question: "Which core Node.js module handles local file system operations?",
    options: ["path", "fs", "http", "os"],
    correct: 1,
    explanation: "The `fs` (File System) module provides methods for reading, writing, and updating files."
  },
  {
    id: 8,
    question: "Which keyword declares a block-scoped variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    correct: 2,
    explanation: "`const` creates a read-only reference to a value within its enclosing block."
  },
  {
    id: 9,
    question: "In Express.js, where are named route parameters accessed?",
    options: ["req.query", "req.params", "req.body", "req.headers"],
    correct: 1,
    explanation: "`req.params` contains route parameters defined as placeholder segments in URL paths."
  },
  {
    id: 10,
    question: "Which HTTP method is conventionally used to replace or update an existing resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct: 2,
    explanation: "HTTP `PUT` is used to update or completely replace an existing target resource."
  },
  {
    id: 11,
    question: "What is Mongoose in a Node.js & MongoDB application?",
    options: ["Frontend UI Library", "Object Data Modeling (ODM) Library", "Database Server Engine", "Testing Framework"],
    correct: 1,
    explanation: "Mongoose is an ODM library that manages relationships, validation, and schemas for MongoDB."
  },
  {
    id: 12,
    question: "Which prop is required when rendering dynamic lists in React to assist reconciliation?",
    options: ["id", "key", "index", "ref"],
    correct: 1,
    explanation: "The `key` prop gives elements a stable identity so React can efficiently track list changes."
  },
  {
    id: 13,
    question: "Which CLI command starts a standard React development server using Vite?",
    options: ["npm build", "npm run dev", "npm test", "npm compile"],
    correct: 1,
    explanation: "`npm run dev` executes Vite's local development server script."
  },
  {
    id: 14,
    question: "Which status code represents a successful standard HTTP request?",
    options: ["200 OK", "404 Not Found", "500 Internal Error", "301 Redirect"],
    correct: 0,
    explanation: "Status `200 OK` indicates that an HTTP request was processed successfully by the server."
  },
  {
    id: 15,
    question: "What default field name does MongoDB assign as the primary key for documents?",
    options: ["_id", "id", "uuid", "key"],
    correct: 0,
    explanation: "MongoDB automatically generates a unique 12-byte ObjectId assigned to `_id`."
  },
  {
    id: 16,
    question: "Which React hook holds a persistent mutable object across re-renders without causing updates?",
    options: ["useMemo", "useRef", "useCallback", "useState"],
    correct: 1,
    explanation: "`useRef` returns a mutable ref object whose `.current` property persists without triggering re-renders."
  },
  {
    id: 17,
    question: "Which Express middleware is required to parse incoming requests with JSON payloads?",
    options: ["express.json()", "express.static()", "express.router()", "express.urlencoded()"],
    correct: 0,
    explanation: "`express.json()` parses incoming requests containing JSON payloads into `req.body`."
  },
  {
    id: 18,
    question: "What does CORS stand for in browser web security?",
    options: ["Cross-Origin Resource Sharing", "Core Online Request Security", "Centralized Origin Request System", "Cross-Order Response Standard"],
    correct: 0,
    explanation: "CORS (Cross-Origin Resource Sharing) allows servers to specify who can load their resources."
  },
  {
    id: 19,
    question: "Which HTTP header carries bearer authentication tokens (like JWTs)?",
    options: ["Content-Type", "Authorization", "Accept", "User-Agent"],
    correct: 1,
    explanation: "The `Authorization` header carries credentials (e.g., `Bearer <token>`) to authenticate requests."
  },
  {
    id: 20,
    question: "What is the primary benefit of React's Virtual DOM?",
    options: ["Direct access to native OS windows", "Optimizing UI updates by minimizing expensive real DOM operations", "Replacing backend API calls", "Compiling JavaScript to WebAssembly"],
    correct: 1,
    explanation: "Virtual DOM computes minimal diffs to minimize direct manipulations of the actual browser DOM."
  }
];

export default function App() {
  const QUESTIONS_PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [missingQuestions, setMissingQuestions] = useState([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSelectOption = (questionIndex, optionIndex) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return QUESTIONS.slice(start, start + QUESTIONS_PER_PAGE);
  }, [currentPage]);

  const answeredCount = useMemo(() => {
    return answers.filter(a => a !== null).length;
  }, [answers]);

  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAttemptSubmit = () => {
    const unselected = [];
    answers.forEach((ans, idx) => {
      if (ans === null) unselected.push(idx + 1);
    });

    if (unselected.length > 0) {
      setMissingQuestions(unselected);
      setShowWarningModal(true);
    } else {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleForceSubmit = () => {
    setShowWarningModal(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setCurrentPage(0);
    setIsSubmitted(false);
    setShowWarningModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scoreMetrics = useMemo(() => {
    if (!isSubmitted) return { score: 0, percentage: 0 };
    let correctCount = 0;
    answers.forEach((ans, idx) => {
      if (ans === QUESTIONS[idx].correct) correctCount++;
    });
    const percentage = Math.round((correctCount / QUESTIONS.length) * 100);
    return { score: correctCount, percentage };
  }, [isSubmitted, answers]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} flex flex-col justify-between font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
      
      {}
      <header className={`sticky top-0 z-30 border-b transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} `}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 relative overflow-hidden">
          <img
            src="/assets/quiz-header.png"
            alt="Quiz Header Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              // Create a gradient fallback if image fails to load
              e.target.style.background = `linear-gradient(to right, ${isDarkMode ? '#4f46e5' : '#3b82f6'}, ${isDarkMode ? '#7c3aed' : '#1d4ed8'})`;
            }}
          />

          {/* Overlay for better text readability in both themes */}
          <div className={`absolute inset-0 bg-${isDarkMode ? 'black/40' : 'white/30'} `}></div>

          <div className="relative flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">DevQuiz</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>MERN & Web Development</p>
            </div>
          </div>

          <div className="relative flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode
                  ? 'border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300 hover:border-slate-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-slate-300'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isSubmitted && (
              <button
                onClick={handleRestart}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Unanswered Questions</h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                You have remaining unanswered question(s):
              </p>
              <div className="mt-2 text-sm font-semibold text-amber-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 max-h-24 overflow-y-auto">
                Questions: {missingQuestions.join(', ')}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Review Quiz
              </button>
              <button
                onClick={handleForceSubmit}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all shadow-sm"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        {!isSubmitted ? (
          <>
            {}
            <div className={`mb-6 p-4 sm:p-5 rounded-2xl border shadow-sm transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    Page {currentPage + 1} of {TOTAL_PAGES}
                  </span>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    • Questions {currentPage * QUESTIONS_PER_PAGE + 1} to {(currentPage + 1) * QUESTIONS_PER_PAGE}
                  </span>
                </div>
                <div className="text-xs font-medium flex items-center gap-1">
                  <span>Answered:</span>
                  <strong className="text-indigo-500 font-bold">{answeredCount}</strong>
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>/ {QUESTIONS.length}</span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {}
            <div className="space-y-6 flex-1">
              {currentQuestions.map((q, relativeIdx) => {
                const globalIndex = currentPage * QUESTIONS_PER_PAGE + relativeIdx;
                const selectedOption = answers[globalIndex];

                return (
                  <div 
                    key={q.id} 
                    className={`p-5 sm:p-6 rounded-2xl border shadow-sm transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {globalIndex + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold leading-snug pt-0.5">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-11">
                      {q.options.map((optionText, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        const optionLabels = ['A', 'B', 'C', 'D'];

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(globalIndex, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between group focus:outline-none ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-500/10 text-indigo-500 ring-2 ring-indigo-500/20 font-medium'
                                : isDarkMode 
                                  ? 'border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300' 
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-semibold ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white' 
                                  : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {optionLabels[optIdx]}
                              </span>
                              <span className="text-sm">{optionText}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
                              isSelected 
                                ? 'border-indigo-600 bg-indigo-600 text-white' 
                                : isDarkMode ? 'border-slate-700' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div className={`mt-8 pt-4 border-t flex items-center justify-between gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentPage < TOTAL_PAGES - 1 ? (
                <button
                  onClick={handleNextPage}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAttemptSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            
            {/* Score Overview Banner */}
            <div className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden shadow-sm ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
              
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                <Trophy className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                Quiz Summary
              </h2>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {scoreMetrics.percentage >= 80 
                  ? "Excellent job! You have a strong command of MERN stack fundamentals."
                  : scoreMetrics.percentage >= 50
                  ? "Good effort! Review the detailed breakdown below to sharpen your knowledge."
                  : "Keep practicing! Review the explanations below and try again."}
              </p>

              <div className={`inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl border mb-6 ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-4xl font-extrabold text-indigo-500">
                  {scoreMetrics.score} / {QUESTIONS.length}
                </span>
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({scoreMetrics.percentage}%)
                </span>
              </div>

              <div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>

            {/* Detailed Questions List */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span>Question Breakdown & Explanations</span>
              </h3>
            </div>

            {}
            <div className="space-y-4">
              {QUESTIONS.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.correct;
                const isSkipped = userAns === null;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
                      isCorrect 
                        ? isDarkMode ? 'border-emerald-800/80 bg-slate-900' : 'border-emerald-200 bg-white'
                        : isDarkMode ? 'border-rose-800/80 bg-slate-900' : 'border-rose-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`font-bold text-xs px-2.5 py-1 rounded-lg ${
                          isCorrect 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          Q{idx + 1}
                        </span>
                        <h4 className="font-semibold text-base leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${
                        isCorrect 
                          ? 'text-emerald-500 bg-emerald-500/10' 
                          : 'text-rose-500 bg-rose-500/10'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-sm pt-1">
                      {isSkipped ? (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-2">
                          <span><strong>Your Answer:</strong> Not Answered</span>
                        </div>
                      ) : (
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isCorrect 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          <span><strong>Your Answer:</strong> {q.options[userAns]}</span>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                      )}

                      {!isCorrect && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-between">
                          <span><strong>Correct Answer:</strong> {q.options[q.correct]}</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Explanation:</strong> {q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleRestart}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {}
      <footer className={`border-t py-4 text-center text-xs ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <p>DevQuiz App • React Single Component & Tailwind CSS</p>
      </footer>
    </div>
  );
}
