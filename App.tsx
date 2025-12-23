import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import { Button, Card, ProgressBar, CircularScore, Modal, XPOverlay, Mascot } from './components/UIComponents';
import { AppView, UserProfile, NICHES, GOALS, ScriptAnalysisResult, VideoAnalysisResult, ScriptHistoryItem, Lesson } from './types';
import { analyzeScriptWithGemini, analyzeVideoWithGemini } from './services/geminiService';

// --- Static Data ---
const LESSONS: Lesson[] = [
    { 
      id: 'l1', 
      title: "Hook Mastery", 
      icon: "🪝", 
      color: "bg-scout-red", 
      xpReward: 50, 
      minLevel: 1, 
      duration: "2 min",
      content: "The first 3 seconds of your video are crucial. A viral hook creates an 'Information Gap'.\n\n**Bad Hook:** 'Hello guys, today I will show you...'\n\n**Viral Hook:** 'Stop scrolling if you want to save ₹5000 today!'\n\n**Action Step:** Review your last 3 videos. Did you start with a bang?" 
    },
    { 
      id: 'l2', 
      title: "Trending Audio 101", 
      icon: "🎵", 
      color: "bg-scout-blue", 
      xpReward: 30, 
      minLevel: 1, 
      duration: "3 min",
      content: "Trending audio isn't just about dancing. Use trending sounds as background music at low volume (5-10%) to signal the algorithm.\n\n**Tip:** Look for the 'Up Arrow' ↗️ icon next to audio names on Reels." 
    },
    { 
      id: 'l3', 
      title: "Camera Confidence", 
      icon: "🎥", 
      color: "bg-scout-purple", 
      xpReward: 100, 
      minLevel: 5, 
      duration: "5 min",
      content: "Locked content." 
    },
    { 
      id: 'l4', 
      title: "Monetization Secrets", 
      icon: "💰", 
      color: "bg-scout-yellow", 
      xpReward: 150, 
      minLevel: 10, 
      duration: "10 min",
      content: "Locked content." 
    },
];

// --- Sub-Components ---

// 1. Onboarding
const Onboarding: React.FC<{ onComplete: (name: string, niche: string, goal: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  return (
    <div className="p-6 h-screen flex flex-col justify-between max-w-md mx-auto bg-scout-dark">
      <div className="mt-8 flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-3 rounded-full mb-8 overflow-hidden">
          <div className="bg-scout-red h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step/4)*100}%` }}></div>
        </div>

        <div className="text-center mb-8 animate-pop">
           <Mascot emotion="happy" className="mb-4 mx-auto" />
           <h1 className="text-3xl font-black mb-2 text-white">Scout</h1>
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Viral Coach</p>
        </div>

        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-black mb-2 text-center">What should we call you?</h2>
            <p className="text-zinc-500 text-center mb-6 font-medium">We'll customize your dashboard.</p>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-zinc-800 border-2 border-zinc-700 p-5 rounded-2xl text-xl font-bold text-center outline-none focus:border-scout-red transition-colors text-white placeholder-zinc-600"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-black mb-6 text-center">Choose your niche</h2>
            <div className="grid grid-cols-2 gap-3">
              {NICHES.map(niche => (
                <button
                  key={niche}
                  onClick={() => setSelectedNiche(niche)}
                  className={`p-4 rounded-2xl font-bold text-sm border-2 transition-all duration-200 active:scale-95 ${selectedNiche === niche ? 'bg-scout-red text-white border-scout-red shadow-[0_4px_0_#D93232]' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500'}`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-black mb-6 text-center">Your main goal?</h2>
            <div className="flex flex-col gap-3">
              {GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-5 rounded-2xl font-bold text-left border-2 transition-all duration-200 active:scale-95 flex items-center justify-between ${selectedGoal === goal ? 'bg-scout-yellow text-black border-scout-yellow shadow-[0_4px_0_#E5C035]' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                >
                  {goal}
                  {selectedGoal === goal && <span>✨</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 4 && (
            <div className="animate-pop text-center bg-scout-card p-8 rounded-3xl border-2 border-zinc-700 shadow-2xl">
               <div className="text-6xl mb-6 animate-bounce-slow">🎉</div>
               <h3 className="text-3xl font-black text-white mb-3">You're all set!</h3>
               <p className="text-zinc-400 mb-2 font-medium">We've customized your AI coach.</p>
               <p className="text-scout-blue font-bold">Let's get viral!</p>
            </div>
        )}
      </div>

      <div className="mb-6 pt-4">
        <Button 
            disabled={(step === 1 && !name) || (step === 2 && !selectedNiche) || (step === 3 && !selectedGoal)}
            onClick={() => {
                if (step < 4) setStep(step + 1);
                else onComplete(name, selectedNiche, selectedGoal);
            }}
            variant={step === 4 ? 'success' : 'primary'}
        >
            {step === 4 ? "Enter Dashboard" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

// 2. Dashboard
const HomeDashboard: React.FC<{ user: UserProfile, onAnalyzeClick: () => void, history: ScriptHistoryItem[] }> = ({ user, onAnalyzeClick, history }) => {
  const latestScript = history.length > 0 ? history[0] : null;

  return (
    <div className="p-5 space-y-6 pt-8 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl border-2 border-scout-yellow">
               😎
             </div>
             <div>
               <h2 className="text-lg font-black leading-tight">Hi, {user.name}</h2>
               <div className="flex items-center gap-1">
                 <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-scout-blue" style={{ width: '45%' }}></div>
                 </div>
                 <span className="text-[10px] font-bold text-scout-blue uppercase">Lvl {user.level}</span>
               </div>
             </div>
         </div>
         <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl">
              <span className="text-lg">🔥</span>
              <span className="font-black text-scout-red">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl">
              <span className="text-lg">💎</span>
              <span className="font-black text-scout-blue">{user.xp}</span>
            </div>
         </div>
      </div>

      {/* Daily Mission - "Duolingo style banner" */}
      <div className="bg-gradient-to-r from-scout-red to-orange-600 rounded-3xl p-5 relative overflow-hidden shadow-lg transform transition-transform active:scale-95 cursor-pointer">
         <div className="relative z-10 w-2/3">
             <h3 className="font-black text-white text-lg mb-1">Daily Streak!</h3>
             <p className="text-white/90 text-sm font-bold mb-3">Analyze 1 script to keep your {user.streak} day streak alive.</p>
             <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
               +50 XP Reward
             </div>
         </div>
         <div className="absolute right-[-10px] bottom-[-10px] text-8xl transform rotate-12 opacity-90 drop-shadow-lg">
           🎯
         </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
         <button onClick={onAnalyzeClick} className="bg-scout-card p-5 rounded-3xl border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 group hover:bg-zinc-800">
             <div className="w-14 h-14 bg-scout-blue/10 text-scout-blue rounded-2xl flex items-center justify-center text-3xl mb-1 group-hover:scale-110 transition-transform">
               📝
             </div>
             <span className="font-bold text-white">Script Doctor</span>
         </button>
         <button onClick={() => {}} className="bg-scout-card p-5 rounded-3xl border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-2 group hover:bg-zinc-800">
             <div className="w-14 h-14 bg-scout-purple/10 text-scout-purple rounded-2xl flex items-center justify-center text-3xl mb-1 group-hover:scale-110 transition-transform">
               📹
             </div>
             <span className="font-bold text-white">Video Roast</span>
         </button>
      </div>

      {/* Recent History or Chart */}
      <Card title="Latest Analysis" icon="🕒">
         {latestScript ? (
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-500 mb-1">{latestScript.date}</div>
                  <div className="font-bold text-white line-clamp-1 w-40">"{latestScript.scriptSnippet}"</div>
                </div>
                <div className={`text-xl font-black ${latestScript.score > 70 ? 'text-scout-green' : latestScript.score > 50 ? 'text-scout-yellow' : 'text-scout-red'}`}>
                   {latestScript.score}
                </div>
            </div>
         ) : (
            <div className="text-center py-6 text-zinc-500 font-bold">
               No history yet. Start creating!
            </div>
         )}
      </Card>
    </div>
  );
};

// 3. Script Analyzer
const ScriptAnalyzer: React.FC<{ user: UserProfile, onAnalyzeComplete: (result: ScriptAnalysisResult, script: string) => void, history: ScriptHistoryItem[] }> = ({ user, onAnalyzeComplete, history }) => {
  const [script, setScript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScriptAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!script.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate thinking time for UX polish
    await new Promise(r => setTimeout(r, 1500));
    
    const analysis = await analyzeScriptWithGemini(script, user.niche, user.goal);
    setResult(analysis);
    setIsAnalyzing(false);
    onAnalyzeComplete(analysis, script);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Hook copied to clipboard!");
  };

  return (
    <div className="p-4 pt-8 pb-24 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Script Doctor</h2>
          <button className="text-xs font-bold bg-zinc-800 px-3 py-1 rounded-full text-zinc-400" onClick={() => setScript('')}>Clear</button>
      </div>
      
      {!result ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea 
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script here... \n\nTip: Include the hook, body, and CTA."
              className="w-full bg-zinc-800 text-white p-5 rounded-3xl h-64 resize-none outline-none border-2 border-zinc-700 focus:border-scout-blue transition-colors placeholder-zinc-500 font-bold text-lg leading-relaxed shadow-inner"
            />
            <div className="absolute bottom-4 right-4 text-xs font-bold text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-lg">
                {script.length} chars
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            loading={isAnalyzing}
            disabled={!script.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
          </Button>

          {isAnalyzing && (
             <div className="flex flex-col items-center mt-8 animate-pulse">
                <Mascot emotion="thinking" className="mb-2" />
                <p className="text-scout-yellow font-bold text-sm uppercase tracking-wide">AI Coach is thinking...</p>
             </div>
          )}

          {/* Mini History List */}
          {history.length > 0 && (
             <div className="mt-8">
                <h3 className="font-bold text-zinc-500 mb-3 ml-1 uppercase text-xs tracking-wider">Recent Analyses</h3>
                <div className="space-y-2">
                   {history.slice(0, 3).map(item => (
                       <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                           <span className="text-sm font-bold truncate w-2/3">"{item.scriptSnippet}"</span>
                           <span className={`font-black ${item.score > 70 ? 'text-scout-green' : 'text-scout-yellow'}`}>{item.score}</span>
                       </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-pop">
          {/* Result Header */}
          <div className="bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-800 shadow-xl flex flex-col items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-scout-red via-scout-yellow to-scout-green"></div>
             <CircularScore score={result.overallScore} />
             <p className="mt-4 font-black text-center text-zinc-100 text-lg leading-snug px-2">
                "{result.suggestion}"
             </p>
          </div>

          {/* The Improved Hook - Key Feature */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 rounded-3xl border border-zinc-700 relative group">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-scout-green font-black uppercase text-xs tracking-wider flex items-center gap-1">
                    ✨ AI Viral Hook
                 </h3>
                 <button onClick={() => copyToClipboard(result.improvedHook)} className="text-xs bg-black/30 hover:bg-black/50 px-2 py-1 rounded text-white font-bold">Copy</button>
             </div>
             <p className="text-xl font-bold text-white italic">"{result.improvedHook}"</p>
          </div>

          {/* Breakdown */}
          <Card title="Score Card">
             {result.metrics.map((m, i) => (
                 <div key={i} className="mb-4 last:mb-0">
                     <div className="flex justify-between text-xs font-bold uppercase mb-1 text-zinc-400">
                        <span>{m.name}</span>
                        <span style={{ color: m.color }}>{m.score}%</span>
                     </div>
                     <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.score}%`, backgroundColor: m.color }}></div>
                     </div>
                 </div>
             ))}
          </Card>

          <div className="flex gap-3">
             <Button variant="outline" onClick={() => setResult(null)}>Analyze Another</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Video Analyzer
const VideoAnalyzer: React.FC<{ user: UserProfile }> = ({ user }) => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<VideoAnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                alert("File too large! Max 20MB for this demo.");
                return;
            }
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the Data-URI prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!videoFile) return;
        setIsAnalyzing(true);

        try {
            const base64 = await convertToBase64(videoFile);
            const analysis = await analyzeVideoWithGemini(base64, videoFile.type);
            setResult(analysis);
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Try a smaller video.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 pt-8 pb-24 animate-slide-up">
            <h2 className="text-2xl font-black mb-6">Video Roast 🔥</h2>
            
            <div className={`bg-zinc-900 rounded-3xl overflow-hidden border-2 transition-all ${videoFile ? 'border-zinc-800' : 'border-dashed border-zinc-700 hover:border-scout-blue'}`}>
                {!previewUrl ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center mb-4 text-4xl shadow-lg">
                            📤
                        </div>
                        <p className="font-bold text-zinc-300 text-lg">Upload Reel / TikTok</p>
                        <p className="text-xs font-bold text-zinc-600 mt-2 uppercase tracking-wide">Max 20MB • MP4/MOV</p>
                    </div>
                ) : (
                    <div className="relative group">
                        <video src={previewUrl} controls className="w-full max-h-[400px] object-contain bg-black" />
                        <button 
                            onClick={() => { setVideoFile(null); setPreviewUrl(null); setResult(null); }}
                            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/*" 
                    onChange={handleFileChange} 
                />
            </div>

            {videoFile && !result && (
                <div className="mt-6 animate-slide-up">
                    <Button onClick={handleAnalyze} loading={isAnalyzing}>
                        {isAnalyzing ? "Watching..." : "Analyze Video"}
                    </Button>
                </div>
            )}

            {isAnalyzing && (
                 <div className="mt-8 p-4 text-center">
                     <Mascot emotion="waiting" className="mb-2" />
                     <p className="animate-pulse text-scout-purple font-bold">Checking pacing, hook & vibes...</p>
                 </div>
            )}

            {result && (
                <div className="mt-6 space-y-4 animate-pop">
                    <Card className="border-scout-purple/50 bg-gradient-to-br from-scout-card to-purple-900/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-white">Verdict</h3>
                                <p className="text-scout-purple font-bold text-sm bg-purple-900/30 px-2 py-0.5 rounded-lg inline-block mt-1">{result.prediction}</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-2xl flex flex-col items-center">
                                <span className="font-black text-2xl text-white">{result.overallScore}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Score</span>
                            </div>
                        </div>
                        <p className="text-zinc-300 font-medium leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                            "{result.feedback}"
                        </p>
                    </Card>

                    <div className="grid grid-cols-3 gap-3">
                         {[
                           { l: 'Visuals', s: result.visualScore, c: 'text-green-400' },
                           { l: 'Pacing', s: result.pacingScore, c: 'text-scout-yellow' },
                           { l: 'Hook', s: result.hookScore, c: 'text-scout-red' }
                         ].map((stat, i) => (
                           <div key={i} className="bg-zinc-900 py-4 rounded-2xl text-center border border-zinc-800 shadow-lg">
                               <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-1">{stat.l}</div>
                               <div className={`text-2xl font-black ${stat.c}`}>{stat.s}</div>
                           </div>
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// 5. Learn Component
const Learn: React.FC<{ user: UserProfile, onLessonComplete: (id: string, xp: number) => void }> = ({ user, onLessonComplete }) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const handleComplete = () => {
        if (selectedLesson) {
            onLessonComplete(selectedLesson.id, selectedLesson.xpReward);
            setSelectedLesson(null);
        }
    };

    return (
        <div className="p-4 pt-8 pb-24 animate-slide-up">
            <div className="flex justify-between items-end mb-6">
               <h2 className="text-2xl font-black">Viral School 🎓</h2>
               <span className="text-xs font-bold text-scout-blue bg-scout-blue/10 px-2 py-1 rounded-lg">Level {user.level}</span>
            </div>
            
            <div className="space-y-4">
                {LESSONS.map((lesson, i) => {
                    const isLocked = user.level < lesson.minLevel;
                    const isCompleted = user.completedLessons.includes(lesson.id);
                    
                    return (
                    <button 
                        key={i} 
                        disabled={isLocked}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-4 p-4 rounded-3xl border-b-4 transition-all relative overflow-hidden group 
                            ${isLocked 
                                ? 'bg-zinc-900 border-zinc-800 opacity-60 cursor-not-allowed' 
                                : 'bg-scout-card border-zinc-800 active:border-b-0 active:translate-y-1 hover:bg-zinc-800'
                            }`}
                    >
                        {isCompleted && (
                            <div className="absolute top-2 right-2 text-green-500 bg-green-500/10 rounded-full p-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        )}

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-105 ${isLocked ? 'bg-zinc-800 grayscale' : lesson.color}`}>
                            {lesson.icon}
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-black text-lg text-white">{lesson.title}</h3>
                            <p className="text-xs font-bold text-zinc-500 mt-1 flex items-center gap-2">
                                <span>{lesson.duration}</span>
                                {!isCompleted && !isLocked && <span className="text-scout-yellow">+{lesson.xpReward} XP</span>}
                            </p>
                        </div>
                        {isLocked && <span className="text-xl opacity-50">🔒</span>}
                    </button>
                )})}
            </div>

            {/* Lesson Modal */}
            <Modal isOpen={!!selectedLesson} onClose={() => setSelectedLesson(null)} title={selectedLesson?.title}>
                {selectedLesson && (
                    <div className="text-center">
                        <div className={`w-20 h-20 mx-auto ${selectedLesson.color} rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl`}>
                            {selectedLesson.icon}
                        </div>
                        <div className="text-left bg-zinc-800 p-4 rounded-xl text-zinc-300 text-sm leading-relaxed whitespace-pre-line mb-6 border border-zinc-700">
                            {selectedLesson.content}
                        </div>
                        <Button variant="success" onClick={handleComplete} disabled={user.completedLessons.includes(selectedLesson.id)}>
                            {user.completedLessons.includes(selectedLesson.id) ? "Completed" : "Complete Lesson"}
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [user, setUser] = useState<UserProfile>({
    name: 'Creator',
    niche: '',
    goal: '',
    level: 1,
    xp: 0,
    streak: 1,
    badges: [],
    isOnboarded: false,
    completedLessons: []
  });
  
  // Script History State
  const [scriptHistory, setScriptHistory] = useState<ScriptHistoryItem[]>([]);
  // XP Overlay State
  const [gainedXp, setGainedXp] = useState<number | null>(null);

  const handleOnboardingComplete = (name: string, niche: string, goal: string) => {
    setUser(prev => ({ ...prev, name, niche, goal, isOnboarded: true }));
    setCurrentView(AppView.HOME);
  };

  const handleAddXp = (amount: number) => {
      setGainedXp(amount);
      // Play sound effect here if possible (simulated visually)
      setUser(prev => {
          const newXp = prev.xp + amount;
          const newLevel = Math.floor(newXp / 100) + 1; // Simple level logic
          return { ...prev, xp: newXp, level: newLevel };
      });
  };

  const handleScriptAnalyzed = (result: ScriptAnalysisResult, scriptContent: string) => {
      // Save to history
      const newItem: ScriptHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          scriptSnippet: scriptContent.substring(0, 30) + "...",
          score: result.overallScore,
          hook: result.improvedHook
      };
      setScriptHistory(prev => [newItem, ...prev]);
      
      // Award XP randomly for demo excitement
      handleAddXp(20);
  };

  const handleLessonComplete = (id: string, xp: number) => {
      if (!user.completedLessons.includes(id)) {
          setUser(prev => ({ ...prev, completedLessons: [...prev.completedLessons, id] }));
          handleAddXp(xp);
      }
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppView.HOME:
        return <HomeDashboard user={user} onAnalyzeClick={() => setCurrentView(AppView.SCRIPT_ANALYZER)} history={scriptHistory} />;
      case AppView.SCRIPT_ANALYZER:
        return <ScriptAnalyzer user={user} onAnalyzeComplete={handleScriptAnalyzed} history={scriptHistory} />;
      case AppView.VIDEO_ANALYZER:
        return <VideoAnalyzer user={user} />;
      case AppView.LEARN:
        return <Learn user={user} onLessonComplete={handleLessonComplete} />;
      default:
        return <HomeDashboard user={user} onAnalyzeClick={() => setCurrentView(AppView.SCRIPT_ANALYZER)} history={scriptHistory} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
      <XPOverlay xp={gainedXp} onComplete={() => setGainedXp(null)} />
    </Layout>
  );
};

export default App;
