import React, { useState, useEffect } from 'react';
import { GameState, Role, Turn, Project } from './types';
import { INITIAL_GAME_STATE, GROUP_ORDER } from './constants';
import StudentView from './components/StudentView';
import TeacherDashboard from './components/TeacherDashboard';
import { Users, GraduationCap, ArrowRight, MonitorPlay } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  
  // Local User Role (Simulating different devices)
  const [userRole, setUserRole] = useState<Role | null>(null);

  // Check for API Key
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Teacher Auth State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  // Handler for when a group finishes their turn
  const handleTurnComplete = (projectId: string, prompt: string, image: string) => {
    if (!userRole) return;

    const newTurn: Turn = {
      groupId: userRole,
      prompt,
      generatedImage: image,
      timestamp: Date.now(),
    };

    setGameState(prev => {
      const updatedProjects = prev.projects.map(p => {
        if (p.id === projectId) {
          const newTurns = [...p.turns, newTurn];
          return {
            ...p,
            turns: newTurns,
            isComplete: newTurns.length >= 5
          };
        }
        return p;
      });

      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the class? All images will be lost.")) {
      setGameState(INITIAL_GAME_STATE);
    }
  };

  const handleTeacherLogin = () => {
    if (passwordInput === '2025') {
      setUserRole('TEACHER');
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // --- Logic to determine what the current user should be doing ---
  
  const getActiveTask = (role: Role, currentState: GameState) => {
    const groupIndex = GROUP_ORDER.indexOf(role);
    if (groupIndex === -1) return null;

    for (let round = 1; round <= 5; round++) {
      let initiatorIndex = (groupIndex - (round - 1)) % 5;
      if (initiatorIndex < 0) initiatorIndex += 5;
      
      const project = currentState.projects[initiatorIndex];
      
      if (project.turns.length >= round) {
        continue; // Task complete
      }

      const isBlocked = project.turns.length < round - 1;

      if (isBlocked) {
        return { status: 'WAITING', round, project };
      } else {
        return { status: 'ACTIVE', round, project };
      }
    }

    return { status: 'COMPLETE' };
  };


  // --- Render Logic ---

  if (apiKeyMissing) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
              <div className="bg-fuchsia-50 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-fuchsia-100">
                  <h2 className="text-xl font-bold text-[#CC0000] mb-4">API Key Missing</h2>
                  <p className="text-slate-600">Please provide a valid Google Gemini API Key in the environment variables to start the application.</p>
              </div>
          </div>
      )
  }

  // 1. Role Selection Screen (Styled like bucomdesign site)
  if (!userRole) {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans">
        <div className="max-w-[1120px] mx-auto px-10 py-20">
          
          <div className="text-center mb-16">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#111]">
               AI Visual Telephone
             </h1>
             <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
               An interactive collaborative game where groups translate visuals back into language using Generative AI.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Student Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#CC0000]" />
                Student Groups
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {GROUP_ORDER.map((group, index) => (
                  <button
                    key={group}
                    onClick={() => setUserRole(group)}
                    className="student-card hover-card bg-[#f9f9f9] rounded-xl p-6 text-center border border-transparent hover:border-gray-200 flex flex-col items-center justify-center h-48 w-full group"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
                      <span className="text-2xl font-bold text-[#111] group-hover:text-[#CC0000] transition-colors">{index + 1}</span>
                    </div>
                    <p className="font-semibold text-[#111]">Group {index + 1}</p>
                    <span className="text-xs text-slate-400 mt-2 font-medium">Join Workspace</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher Section */}
            <div className="bg-[#f9f9f9] p-8 rounded-2xl border border-slate-100 shadow-sm text-center lg:text-left h-full flex flex-col justify-center">
               <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 justify-center lg:justify-start">
                 <MonitorPlay className="w-6 h-6 text-[#CC0000]" />
                 Instructor
               </h2>
               <p className="mb-8 text-slate-600 leading-relaxed">
                 Access the centralized dashboard to monitor progress in real-time, view side-by-side comparisons, and facilitate the final class discussion.
               </p>
               <button 
                onClick={() => setShowPasswordModal(true)}
                className="btn-primary py-4 px-8 rounded-xl font-bold text-lg w-full lg:w-auto flex items-center justify-center gap-2 self-start"
              >
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-400 text-sm">
            <p>CM501 • Fall 2025 • Visual Communication Design</p>
          </div>

        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
              <h3 className="text-xl font-bold text-[#111] mb-2">Instructor Access</h3>
              <p className="text-sm text-gray-500 mb-6">Enter passcode to view dashboard.</p>
              
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                className={`w-full p-4 border rounded-xl mb-4 outline-none transition-all font-medium text-lg ${passwordError ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300' : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111] focus:border-transparent'}`}
                placeholder="Passcode"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleTeacherLogin()}
              />
              
              {passwordError && (
                <p className="text-[#CC0000] text-sm font-bold mb-4 animate-pulse">Incorrect passcode.</p>
              )}
              
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(false); }} 
                  className="flex-1 py-3 font-bold text-gray-500 hover:text-[#111] hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTeacherLogin} 
                  className="flex-1 py-3 bg-[#111] hover:bg-[#CC0000] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // 2. Teacher View
  if (userRole === 'TEACHER') {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
             <button onClick={() => setUserRole(null)} className="text-sm font-semibold text-slate-400 hover:text-[#CC0000] underline decoration-2 decoration-transparent hover:decoration-[#CC0000] transition-all">Exit Role</button>
        </div>
        <TeacherDashboard gameState={gameState} onReset={handleReset} />
      </>
    );
  }

  // 3. Student View Logic
  const task = getActiveTask(userRole, gameState);

  if (task?.status === 'WAITING') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
         <div className="fixed top-6 right-6 z-50">
             <button onClick={() => setUserRole(null)} className="text-sm font-semibold text-slate-400 hover:text-[#CC0000] underline">Exit Role</button>
        </div>
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[#CC0000] rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-bold text-[#111] tracking-tight mb-4">Transmission Pending</h2>
        <p className="text-slate-500 max-w-md leading-relaxed text-lg">
          Please wait. <strong>{task.project?.initiator === userRole ? 'Setup' : 'The previous group'}</strong> is still working on Round {task.round - 1}.
        </p>
        <div className="mt-8 px-4 py-2 bg-[#f9f9f9] rounded text-sm font-mono text-slate-500 border border-slate-200">
          INCOMING: PROJECT {task.project?.id.toUpperCase()}
        </div>
      </div>
    );
  }

  if (task?.status === 'COMPLETE') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
         <div className="fixed top-6 right-6 z-50">
             <button onClick={() => setUserRole(null)} className="text-sm font-semibold text-slate-400 hover:text-[#CC0000] underline">Exit Role</button>
        </div>
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8">
            <GraduationCap className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold text-[#111] mb-4">All Rounds Complete</h2>
        <p className="text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">
          Excellent work. Your group has contributed to all 5 visual chains. Please return to the main display for the class discussion.
        </p>
      </div>
    );
  }

  // Render Active Game View
  return (
    <>
      <div className="fixed top-6 right-6 z-50">
             <button onClick={() => setUserRole(null)} className="text-sm font-semibold text-slate-400 hover:text-[#CC0000] underline">Exit Role</button>
      </div>
      {task?.project && (
        <StudentView 
            key={`${userRole}-${task.round}`} // Force re-mount on round change
            currentGroup={userRole}
            roundNumber={task.round}
            projectId={task.project.id}
            previousTurn={task.round > 1 ? task.project.turns[task.round - 2] : null}
            onTurnComplete={(prompt, image) => handleTurnComplete(task.project!.id, prompt, image)}
        />
      )}
    </>
  );
};

export default App;