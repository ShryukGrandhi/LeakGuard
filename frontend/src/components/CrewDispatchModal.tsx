import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, MapPin, Phone, Award } from 'lucide-react';

interface Crew {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  distance: string;
  eta: string;
}

interface CrewDispatchModalProps {
  wellName: string;
  onComplete: () => void;
}

export function CrewDispatchModal({ wellName, onComplete }: CrewDispatchModalProps) {
  const [stage, setStage] = useState<'searching' | 'found' | 'contacting' | 'accepted' | 'dispatched'>('searching');
  const [progress, setProgress] = useState(0);

  const crews: Crew[] = [
    {
      id: 1,
      name: 'Mike Rodriguez',
      role: 'Lead Technician',
      avatar: '👨‍🔧',
      rating: 4.9,
      distance: '12.3 mi',
      eta: '18 min'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Safety Specialist',
      avatar: '👩‍🔧',
      rating: 4.8,
      distance: '12.3 mi',
      eta: '18 min'
    }
  ];

  useEffect(() => {
    let mounted = true;
    let hasRun = false;
    
    if (hasRun) return;
    hasRun = true;

    const timeline = [
      { stage: 'searching', duration: 1500 },
      { stage: 'found', duration: 1000 },
      { stage: 'contacting', duration: 2000 },
      { stage: 'accepted', duration: 1500 },
      { stage: 'dispatched', duration: 1000 }
    ];

    let currentIndex = 0;
    let currentProgress = 0;

    const runStage = () => {
      if (!mounted || currentIndex >= timeline.length) {
        if (mounted) setTimeout(onComplete, 1000);
        return;
      }

      const current = timeline[currentIndex];
      setStage(current.stage as any);
      
      // Animate progress
      const progressInterval = setInterval(() => {
        if (!mounted) {
          clearInterval(progressInterval);
          return;
        }
        currentProgress += 2;
        setProgress(Math.min(currentProgress, (currentIndex + 1) * 20));
      }, current.duration / 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        currentIndex++;
        runStage();
      }, current.duration);
    };

    runStage();

    return () => { mounted = false; };
  }, []); // EMPTY DEPS - Run only once on mount

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-xl shadow-2xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Crew Dispatch System</h2>
              <p className="text-blue-100 text-sm">{wellName}</p>
            </div>
          </div>
          {stage === 'dispatched' && (
            <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-400">
              <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                EN ROUTE
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Dispatch Progress</span>
              <span className="text-white font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stage Display */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            {stage === 'searching' && (
              <div className="text-center space-y-4 animate-pulse">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                </div>
                <p className="text-blue-400 font-semibold text-lg">Searching for available crews...</p>
                <p className="text-slate-400 text-sm">Scanning qualified technicians within 20-mile radius</p>
              </div>
            )}

            {stage === 'found' && (
              <div className="space-y-4 animate-slideIn">
                <div className="flex items-center justify-center gap-2 text-green-400 font-semibold text-lg">
                  <CheckCircle className="w-6 h-6" />
                  Crew Found!
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {crews.map((crew) => (
                    <div key={crew.id} className="bg-slate-700/50 rounded-lg p-4 border-2 border-green-500/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl">{crew.avatar}</div>
                        <div>
                          <p className="text-white font-bold">{crew.name}</p>
                          <p className="text-slate-400 text-xs">{crew.role}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Award className="w-3 h-3" />
                          <span>{crew.rating} ⭐ rating</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span>{crew.distance} away</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>ETA: {crew.eta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stage === 'contacting' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Phone className="w-16 h-16 text-blue-400 animate-bounce" />
                </div>
                <p className="text-blue-400 font-semibold text-lg">Contacting crew members...</p>
                <p className="text-slate-400 text-sm">Sending contract terms and location details</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            {stage === 'accepted' && (
              <div className="space-y-4 animate-slideIn">
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-xl">
                  <CheckCircle className="w-8 h-8" />
                  Crew Accepted Mission!
                </div>
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                  {crews.map((crew, idx) => (
                    <div key={crew.id} className={`flex items-center justify-between py-2 ${idx > 0 ? 'border-t border-slate-700 mt-2 pt-2' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{crew.avatar}</div>
                        <div>
                          <p className="text-white font-semibold">{crew.name}</p>
                          <p className="text-green-400 text-sm flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Confirmed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">ETA</p>
                        <p className="text-white font-bold">{crew.eta}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-slate-400 text-sm">Preparing equipment and route to site...</p>
              </div>
            )}

            {stage === 'dispatched' && (
              <div className="space-y-4 animate-slideIn">
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-xl">
                  <CheckCircle className="w-8 h-8 animate-pulse" />
                  Crew Dispatched!
                </div>
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-center text-white font-semibold mb-4">Live Tracking Active</p>
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-slate-400 text-xs">Current Status</p>
                      <p className="text-green-400 font-bold">En Route</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Distance</p>
                      <p className="text-white font-bold">12.3 mi</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">ETA</p>
                      <p className="text-blue-400 font-bold">18 min</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 text-center">
                      GPS tracking enabled • Real-time updates • Emergency contact available
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

