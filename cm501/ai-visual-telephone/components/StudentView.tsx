import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Role, Turn } from '../types';
import PromptGuide from './PromptGuide';
import { INITIATOR_THEMES } from '../constants';
import { Loader2, Send, Image as ImageIcon, AlertCircle, Edit3, Lightbulb } from 'lucide-react';

interface StudentViewProps {
  currentGroup: Role;
  roundNumber: number; // 1 to 5
  previousTurn: Turn | null; // Null if Round 1 (Initiator)
  projectId: string; // To know which chain we are working on
  onTurnComplete: (prompt: string, image: string) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ currentGroup, roundNumber, previousTurn, projectId, onTurnComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If Round > 1, they see the image from the previous group.
  const referenceImage = previousTurn?.generatedImage;
  const isInitiator = roundNumber === 1;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const base64Image = await generateImage(prompt);
      setGeneratedImage(base64Image);
    } catch (err) {
      setError("Failed to generate image. Please try again. " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (generatedImage && prompt) {
      onTurnComplete(prompt, generatedImage);
      setPrompt('');
      setGeneratedImage(null);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans text-[#111]">
      {/* Left Panel: Context & Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-10">
          
          {/* Header */}
          <div className="space-y-4 border-b border-gray-200 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-[#111] text-white flex items-center justify-center text-xl font-bold">
                  {currentGroup.replace('GROUP_', '')}
                </span>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-[#111]">
                    {isInitiator ? 'The Initiator' : 'The Interpreter'}
                  </h1>
                  <span className="text-sm font-bold text-[#CC0000] uppercase tracking-wider">
                    Round {roundNumber} / 5
                  </span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                 <div className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-widest">Project ID</div>
                 <div className="text-base font-bold text-gray-700">{projectId.toUpperCase()}</div>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              {isInitiator
                ? 'Your group is starting a new visual chain. Collaborate to write a detailed prompt based on your assigned theme.' 
                : 'Analyze the incoming image below. Do not look at the original prompt. Recreate this image by writing a new prompt.'}
            </p>
          </div>

          {/* Theme Assignment (Initiator Only) */}
          {isInitiator && (
             <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                   <Lightbulb className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                   <h3 className="font-bold text-amber-900 text-lg mb-2">Your Starting Theme: "The Last Day"</h3>
                   <p className="text-amber-900 text-xl font-semibold leading-relaxed font-serif">
                      "{INITIATOR_THEMES[currentGroup]}"
                   </p>
                   <p className="text-amber-800/80 text-sm mt-3 font-medium">Use this creative spark to decide your Subject, Style, Material, and Vibe.</p>
                </div>
             </div>
          )}

          {/* Reference Image (For Rounds 2+) */}
          {referenceImage && (
            <div className="bg-[#f9f9f9] p-8 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <ImageIcon className="w-4 h-4" />
                <span>Incoming Transmission</span>
              </div>
              <div className="w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                <img src={referenceImage} alt="Reference" className="w-full max-h-[500px] object-contain mx-auto" />
              </div>
            </div>
          )}

          {/* Workspace */}
          <div className="bg-white rounded-xl">
            <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#CC0000]" />
              Draft Your Prompt
            </h2>
            
            <div className="space-y-6">
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isInitiator
                    ? "Combine your assigned theme with the recipe (Subject + Style + Material + Vibe) to describe your image..." 
                    : "Describe the image above in detail (Subject + Style + Material + Vibe)..."}
                  className="w-full p-6 rounded-xl bg-[#fafafa] border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#111] focus:border-transparent min-h-[160px] text-[#111] placeholder:text-gray-400 transition-all font-medium text-lg leading-relaxed resize-y"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-[#CC0000] rounded-lg flex items-start gap-3 text-sm border border-red-100 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {!generatedImage ? (
                   <button
                   onClick={handleGenerate}
                   disabled={isGenerating || !prompt}
                   className="btn-primary w-full py-4 px-8 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                 >
                   {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   {isGenerating ? 'GENERATING...' : 'GENERATE IMAGE'}
                 </button>
                ) : (
                  <button
                  onClick={() => setGeneratedImage(null)}
                  className="btn-secondary flex-1 py-3 px-6 rounded-xl font-bold transition-colors"
                >
                  Discard & Try Again
                </button>
                )}
               
              </div>

              {generatedImage && (
                <div className="mt-10 pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[#111]">Generated Result</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Ready to submit</span>
                   </div>
                   
                   <div className="w-full border border-gray-200 bg-[#fafafa] mb-8 rounded-lg overflow-hidden shadow-sm">
                      <img src={generatedImage} alt="Generated" className="w-full max-h-[500px] object-contain mx-auto" />
                   </div>
                   
                   <button
                      onClick={handleSubmit}
                      className="w-full bg-[#111] hover:bg-[#CC0000] text-white py-5 px-8 rounded-xl font-bold tracking-wide shadow-xl hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
                   >
                      <Send className="w-5 h-5" />
                      TRANSMIT TO NEXT GROUP
                   </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="h-20"></div> {/* Spacer */}
        </div>
      </div>

      {/* Right Panel: Prompt Guide (Passive) */}
      <div className="hidden xl:block w-[400px] shrink-0 h-full border-l border-gray-100">
        <PromptGuide />
      </div>
    </div>
  );
};

export default StudentView;