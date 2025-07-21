import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FloatingShapes from '../shared/FloatingShapes';

const LearningWorld = () => {
  const navigate = useNavigate();
  const { worldId, lessonId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden kid-interface">
      <FloatingShapes />
      
      <div className="relative z-10 max-w-6xl mx-auto pt-8 px-4">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
            🌟 Learning World 
          </h2>
          <p className="text-xl text-white/90 font-semibold">
            Learning {lessonId} in {worldId}!
          </p>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate(`/lessons/${worldId}`)}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30"
          >
            ← Back to Lessons
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningWorld;