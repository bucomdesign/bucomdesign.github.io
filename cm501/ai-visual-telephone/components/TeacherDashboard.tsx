import React, { useState } from 'react';
import { GameState, Project, Turn } from '../types';
import { RefreshCw, ZoomIn, X, Clock, CheckCircle2, ArrowRight, Maximize2, MoveRight } from 'lucide-react';

interface TeacherDashboardProps {
  gameState: GameState;
  onReset: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ gameState, onReset }) => {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string, caption: string } | null>(null);

  // Calculate overall progress
  const totalTurns = 5 * 5; 
  const currentTurns = gameState.projects.reduce((acc, p) => acc + p.turns.length, 0);
  const progressPercentage = Math.round((currentTurns / totalTurns) * 100);

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans pb-20">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#111] text-white flex items-center justify-center font-bold rounded-lg text-lg">
              T
            </div>
            <h1 className="font-bold text-xl tracking-tight">Teacher Dashboard</h1>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex flex-col items-end">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Class Progress</div>
                <div className="flex items-center gap-3">
                    <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#CC0000] transition-all duration-1000" style={{ width: `${progressPercentage}%`}}></div>
                    </div>
                    <div className="text-base font-bold text-[#CC0000]">{progressPercentage}%</div>
                </div>
             </div>
            <button 
              onClick={onReset}
              className="text-sm px-5 py-2.5 text-gray-600 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-bold bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Activity
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-10">
        {/* Main Grid: Comparison Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {gameState.projects.map((project, idx) => (
            <ProjectSummaryCard 
              key={project.id} 
              project={project} 
              index={idx}
              onExpand={() => setExpandedProject(project)}
              onZoom={(src, caption) => setZoomedImage({ src, caption })}
            />
          ))}
        </div>
      </main>

      {/* Expanded Project View Modal */}
      {expandedProject && (
        <ProjectDetailModal 
            project={expandedProject} 
            onClose={() => setExpandedProject(null)}
            onZoom={(src, caption) => setZoomedImage({ src, caption })}
        />
      )}

      {/* Lightbox Modal (Zoomed Image) */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111]/95 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-[#CC0000] transition-colors"
          >
            <X className="w-12 h-12" />
          </button>
          <div className="max-w-7xl w-full flex flex-col items-center gap-8">
             <div className="relative h-[80vh] w-full">
                <img src={zoomedImage.src} alt="Full size" className="w-full h-full object-contain" />
             </div>
             <p className="text-white text-center text-lg md:text-xl font-medium bg-[#222] px-8 py-4 rounded-xl shadow-2xl max-w-4xl border border-white/10">
                {zoomedImage.caption}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

// 1. Project Summary Card (Side-by-Side View)
const ProjectSummaryCard: React.FC<{ 
    project: Project, 
    index: number,
    onExpand: () => void,
    onZoom: (src: string, caption: string) => void
}> = ({ project, index, onExpand, onZoom }) => {
    
    const firstTurn = project.turns[0];
    const lastTurn = project.turns.length > 0 ? project.turns[project.turns.length - 1] : null;
    const isStarted = !!firstTurn;
    const isComplete = project.turns.length === 5;

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            {/* Header */}
            <div className="bg-[#fcfcfc] px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-[#111] text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                    </span>
                    <div>
                        <h3 className="font-bold text-[#111] text-sm uppercase tracking-wide">
                            {project.initiator.replace('_', ' ')}'s Chain
                        </h3>
                    </div>
                </div>
                {isComplete ? (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETE
                     </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full border border-gray-200">
                        STEP {project.turns.length} / 5
                    </span>
                )}
            </div>

            {/* Side by Side Content */}
            <div className="flex-1 p-8 flex items-center gap-6 md:gap-10">
                
                {/* Start */}
                <div className="flex-1 space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Original Input</div>
                    {firstTurn ? (
                        <div 
                            className="aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative group cursor-pointer"
                            onClick={() => onZoom(firstTurn.generatedImage!, `Origin Prompt: ${firstTurn.prompt}`)}
                        >
                            <img src={firstTurn.generatedImage!} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Start" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transform scale-75 group-hover:scale-100 transition-all" />
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-sm font-medium">
                            Waiting...
                        </div>
                    )}
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex flex-col items-center justify-center text-gray-300">
                    <MoveRight className="w-8 h-8" />
                </div>

                {/* End */}
                <div className="flex-1 space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                        {isComplete ? 'Final Result' : 'Current State'}
                    </div>
                    {lastTurn ? (
                         <div 
                            className="aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative group cursor-pointer"
                            onClick={() => onZoom(lastTurn.generatedImage!, `Latest Prompt: ${lastTurn.prompt}`)}
                         >
                            <img src={lastTurn.generatedImage!} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Current" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transform scale-75 group-hover:scale-100 transition-all" />
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-sm font-medium">
                            Pending...
                        </div>
                    )}
                </div>

            </div>

            {/* Footer Action */}
            <div className="px-8 py-5 bg-[#fcfcfc] border-t border-gray-100">
                <button 
                    onClick={onExpand}
                    disabled={!isStarted}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#111] border border-gray-200 hover:border-[#111] text-[#111] hover:text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                >
                    <Maximize2 className="w-4 h-4" />
                    Inspect Full Journey
                </button>
            </div>
        </div>
    );
};


// 2. Project Detail Modal (The "Step-In" View)
const ProjectDetailModal: React.FC<{ 
    project: Project, 
    onClose: () => void,
    onZoom: (src: string, caption: string) => void
}> = ({ project, onClose, onZoom }) => {

    const firstTurn = project.turns[0];
    const lastTurn = project.turns[project.turns.length - 1];
    
    // Fill empty slots so we always render 5 columns
    const steps = Array(5).fill(null).map((_, i) => project.turns[i] || null);

    return (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-6 flex items-center justify-between z-10 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold text-[#111] tracking-tight">Project Analysis: {project.initiator.replace('_', ' ')}</h2>
                    <p className="text-gray-500 text-base mt-1">Visual telephone evolution from start to finish.</p>
                </div>
                <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500 hover:text-[#CC0000]" />
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto p-10 space-y-16">
                
                {/* 1. The Transformation (Big Compare) */}
                <section>
                    <h3 className="text-xl font-bold text-[#111] mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-[#CC0000] text-white flex items-center justify-center text-sm">1</span>
                        The Transformation
                    </h3>
                    <div className="grid grid-cols-2 gap-10 bg-[#f9f9f9] p-10 rounded-3xl border border-gray-100">
                         {/* Original */}
                         <div className="space-y-4">
                            <div className="aspect-video bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group cursor-zoom-in"
                                 onClick={() => firstTurn && onZoom(firstTurn.generatedImage!, `Original Prompt: ${firstTurn.prompt}`)}>
                                {firstTurn ? (
                                    <img src={firstTurn.generatedImage!} className="w-full h-full object-contain" alt="First" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Data</div>
                                )}
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs font-bold text-[#CC0000] uppercase mb-2 block tracking-wider">Original Prompt</span>
                                <p className="text-base text-gray-800 leading-relaxed">"{firstTurn?.prompt || '...'}"</p>
                            </div>
                         </div>

                         {/* Result */}
                         <div className="space-y-4">
                            <div className="aspect-video bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group cursor-zoom-in"
                                 onClick={() => lastTurn && onZoom(lastTurn.generatedImage!, `Final Prompt: ${lastTurn.prompt}`)}>
                                {lastTurn ? (
                                    <img src={lastTurn.generatedImage!} className="w-full h-full object-contain" alt="Last" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Data</div>
                                )}
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs font-bold text-[#111] uppercase mb-2 block tracking-wider">Latest Interpretation</span>
                                <p className="text-base text-gray-800 leading-relaxed">"{lastTurn?.prompt || '...'}"</p>
                            </div>
                         </div>
                    </div>
                </section>

                {/* 2. The Journey (Step by Step) */}
                <section>
                    <h3 className="text-xl font-bold text-[#111] mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-[#111] text-white flex items-center justify-center text-sm">2</span>
                        The Evolution Steps
                    </h3>
                    
                    <div className="grid grid-cols-5 gap-8">
                        {steps.map((turn, i) => {
                             const groupNum = ((parseInt(project.id.split('-')[1]) - 1 + i) % 5) + 1;
                             return (
                                <div key={i} className={`flex flex-col ${turn ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}>
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase text-gray-400 tracking-wider">Step {i + 1}</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">Group {groupNum}</span>
                                    </div>
                                    
                                    <div 
                                        className="aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative group cursor-zoom-in mb-4 shadow-sm"
                                        onClick={() => turn && onZoom(turn.generatedImage!, `Step ${i+1} Prompt: ${turn.prompt}`)}
                                    >
                                        {turn ? (
                                            <>
                                                <img src={turn.generatedImage!} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={`Step ${i+1}`} />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-sm" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Clock className="w-8 h-8 text-gray-200" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-gray-100 h-full shadow-sm">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {turn ? turn.prompt : 'Waiting for input...'}
                                        </p>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </section>

                <div className="h-12"></div>
            </div>
        </div>
    );
};

export default TeacherDashboard;