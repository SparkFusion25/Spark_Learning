import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ParentProvider } from './context/ParentContext';

// Components
import LoginScreen from './components/auth/LoginScreen';
import ChildSelect from './components/child/ChildSelect';
import WorldSelect from './components/child/WorldSelect';
import SubjectLessons from './components/child/SubjectLessons';
import LearningWorld from './components/child/LearningWorld';
import LessonComplete from './components/child/LessonComplete';
import ParentDashboard from './components/parent/ParentDashboard';
import AdminPanel from './components/admin/AdminPanel';
import ShareModal from './components/shared/ShareModal';

// Styles
import './index.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <LearningProvider>
          <ParentProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400">
                <Routes>
                  {/* Authentication Routes */}
                  <Route path="/" element={<LoginScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  
                  {/* Child Learning Routes */}
                  <Route path="/child-select" element={<ChildSelect />} />
                  <Route path="/world-select" element={<WorldSelect />} />
                  <Route path="/lessons/:worldId" element={<SubjectLessons />} />
                  <Route path="/learning/:worldId/:lessonId" element={<LearningWorld />} />
                  <Route path="/lesson-complete" element={<LessonComplete />} />
                  
                  {/* Parent Routes */}
                  <Route path="/parent" element={<ParentDashboard />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminPanel />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Global Components */}
                <ShareModal />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#fff',
                      color: '#333',
                      borderRadius: '24px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    },
                    success: {
                      iconTheme: {
                        primary: '#43e97b',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#f5576c',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </ParentProvider>
        </LearningProvider>
      </AuthProvider>
    </div>
  );
}

export default App;