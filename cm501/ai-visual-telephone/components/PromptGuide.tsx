import React from 'react';
import { PROMPT_RECIPE } from '../constants';

const PromptGuide: React.FC = () => {
  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="p-8">
        <h3 className="text-xl font-bold text-[#111] mb-6 tracking-tight">Prompt Recipe Formula</h3>
        
        <div className="p-5 bg-[#fafafa] border border-gray-100 rounded-xl mb-10">
          <p className="text-sm font-bold text-[#111] mb-2">Instructions:</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Brainstorm one item from each of the four categories below to construct your prompt description.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200 font-mono text-xs text-[#CC0000] font-bold tracking-wide">
            Subject + Art Style + Material/Texture + Lighting/Vibe
          </div>
        </div>
        
        <div className="space-y-10">
          {PROMPT_RECIPE.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-[#111] uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
                <span>{idx + 1}. {category.name}</span>
                <span className="text-gray-400 font-medium normal-case text-xs">{category.description}</span>
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-100">
                {category.examples.join(', ')}, etc.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptGuide;