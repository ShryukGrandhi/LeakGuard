import React, { useEffect, useState } from 'react';
import { FileText, Check, X, Clock, DollarSign, Zap, Code, Database, CheckCircle2 } from 'lucide-react';

interface ContractModalProps {
  wellName: string;
  wellId: number;
  onApprove: () => void;
  onReject: () => void;
}

export function ContractModal({ wellName, wellId, onApprove, onReject }: ContractModalProps) {
  const [contractCode, setContractCode] = useState('');
  const [analysisData, setAnalysisData] = useState<string[]>([]);
  const [calculations, setCalculations] = useState<any[]>([]);
  const [showApproval, setShowApproval] = useState(false);
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'calculating' | 'generating' | 'compiling' | 'ready'>('analyzing');

  const fullContractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmergencyResponse_${wellId} {
    address public pytheas = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0;
    uint256 public bountyAmount = 5000 ether;
    uint256 public createdAt = ${Math.floor(Date.now() / 1000)};
    string public location = "${wellName}";
    
    enum Status { CREATED, CREW_DISPATCHED, COMPLETED }
    Status public status = Status.CREATED;
    
    event CrewDispatched(address indexed crew, uint256 timestamp);
    event RepairCompleted(address indexed crew, uint256 payment);
    
    function dispatchCrew(address _crew) external {
        require(msg.sender == pytheas, "Only Pytheas HQ");
        status = Status.CREW_DISPATCHED;
        emit CrewDispatched(_crew, block.timestamp);
    }
    
    function completeRepair() external payable {
        require(status == Status.CREW_DISPATCHED, "No crew");
        status = Status.COMPLETED;
        payable(msg.sender).transfer(bountyAmount);
        emit RepairCompleted(msg.sender, bountyAmount);
    }
}`;

  useEffect(() => {
    let mounted = true;
    let hasRun = false;
    
    if (hasRun) return;
    hasRun = true;
    
    // Step 1: Show analysis data coming in
    const showAnalysis = async () => {
      if (!mounted) return;
      setCurrentStep('analyzing');
      const analysisSteps = [
        `✓ Methane level: ${(2.3 + Math.random() * 0.5).toFixed(2)} PPM (CRITICAL)`,
        `✓ Duration: ${Math.floor(Math.random() * 10 + 5)} minutes`,
        `✓ Risk level: HIGH - Immediate response required`,
        `✓ Historical data: No previous incidents at this well`,
        `✓ Weather conditions: Clear, wind 5 mph`,
        `✓ Crew availability: 2 teams within 15 miles`
      ];

      for (let i = 0; i < analysisSteps.length; i++) {
        if (!mounted) return;
        await new Promise(resolve => setTimeout(resolve, 300));
        setAnalysisData(prev => [...prev, analysisSteps[i]]);
      }
    };

    // Step 2: Show calculations
    const showCalculations = async () => {
      if (!mounted) return;
      setCurrentStep('calculating');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const calcs = [
        { label: 'Base crew cost', value: '$3,500', formula: '2 technicians × 4 hours × $175/hr' },
        { label: 'Equipment rental', value: '$800', formula: 'Leak detection + repair tools' },
        { label: 'Emergency premium', value: '$500', formula: 'Immediate response surcharge' },
        { label: 'Insurance escrow', value: '$200', formula: 'Liability coverage deposit' },
        { label: 'TOTAL BOUNTY', value: '$5,000', formula: 'Sum of all costs', highlight: true }
      ];

      for (let i = 0; i < calcs.length; i++) {
        if (!mounted) return;
        await new Promise(resolve => setTimeout(resolve, 400));
        setCalculations(prev => [...prev, calcs[i]]);
      }
    };

    // Step 3: Type out contract code
    const typeContract = async () => {
      if (!mounted) return;
      setCurrentStep('generating');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const lines = fullContractCode.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!mounted) return;
        await new Promise(resolve => setTimeout(resolve, 80));
        setContractCode(lines.slice(0, i + 1).join('\n'));
      }
    };

    // Step 4: Compile
    const compile = async () => {
      if (!mounted) return;
      setCurrentStep('compiling');
      await new Promise(resolve => setTimeout(resolve, 800));
    };

    // Step 5: Ready
    const finalize = async () => {
      if (!mounted) return;
      setCurrentStep('ready');
      setShowApproval(true);
    };

    // Run the sequence ONCE
    (async () => {
      await showAnalysis();
      await showCalculations();
      await typeContract();
      await compile();
      await finalize();
    })();

    return () => { mounted = false; };
  }, []); // EMPTY DEPS - Run only once on mount

  const contractAmount = 5000;
  const estimatedTime = 45;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Contract Generation</h2>
              <p className="text-blue-100 text-sm">Emergency Response Protocol</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-white font-bold text-sm">LIVE</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Well Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Target Asset</p>
                <p className="text-white font-bold text-lg">{wellName}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Incident Level</p>
                <p className="text-red-400 font-bold text-lg">CRITICAL</p>
              </div>
            </div>
          </div>

          {/* Step 1: Analysis Data */}
          {analysisData.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-blue-400" />
                <p className="text-blue-400 font-semibold text-sm">ANALYZING INCIDENT DATA</p>
              </div>
              <div className="space-y-1 font-mono text-xs">
                {analysisData.map((data, i) => (
                  <div key={i} className="text-green-400 animate-slideInUp">
                    {data}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Calculations */}
          {calculations.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-yellow-700/50">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-400 font-semibold text-sm">CALCULATING COSTS</p>
              </div>
              <div className="space-y-2">
                {calculations.map((calc, i) => (
                  <div key={i} className={`animate-slideInUp ${calc.highlight ? 'bg-yellow-900/30 border border-yellow-700/50 p-2 rounded' : ''}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${calc.highlight ? 'font-bold text-yellow-400' : 'text-slate-300'}`}>
                        {calc.label}
                      </span>
                      <span className={`font-bold ${calc.highlight ? 'text-yellow-400 text-lg' : 'text-white'}`}>
                        {calc.value}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{calc.formula}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Contract Code Generation */}
          {contractCode && (
            <div className="bg-slate-950 rounded-lg p-4 border border-green-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-green-400" />
                <p className="text-green-400 font-semibold text-sm">
                  {currentStep === 'generating' ? 'GENERATING SMART CONTRACT...' : 'SMART CONTRACT CODE'}
                </p>
              </div>
              <div className="bg-black rounded p-3 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
                <pre className="text-green-400 leading-relaxed">
                  {contractCode}
                  {currentStep === 'generating' && <span className="animate-pulse">_</span>}
                </pre>
              </div>
            </div>
          )}

          {/* Step 4: Compiling */}
          {currentStep === 'compiling' && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-700/50 animate-pulse">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400 animate-spin" />
                <p className="text-purple-400 font-semibold text-sm">COMPILING CONTRACT...</p>
              </div>
              <div className="mt-2 space-y-1 text-xs font-mono">
                <div className="text-purple-300">→ Checking syntax... <span className="text-green-400">✓</span></div>
                <div className="text-purple-300">→ Optimizing gas usage... <span className="text-green-400">✓</span></div>
                <div className="text-purple-300">→ Generating bytecode... <span className="text-green-400">✓</span></div>
              </div>
            </div>
          )}

          {/* Step 5: Ready for Approval */}
          {showApproval && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-green-900/20 border-2 border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <p className="text-green-400 font-bold text-lg">CONTRACT COMPILED & READY</p>
                </div>
                
                <div className="bg-green-950/50 rounded p-3 mb-3 border border-green-700/30">
                  <div className="text-xs font-mono space-y-1">
                    <div className="text-green-300">Contract Address: <span className="text-white">0x{Math.random().toString(16).slice(2, 42)}</span></div>
                    <div className="text-green-300">Gas Estimate: <span className="text-white">157,234 gas</span></div>
                    <div className="text-green-300">Deploy Cost: <span className="text-white">~$12.45 USD</span></div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Contract Type:</span>
                    <span className="text-white font-semibold">Emergency Repair & Response</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Bounty Amount:
                    </span>
                    <span className="text-green-400 font-bold text-lg">${contractAmount.toLocaleString()} USD</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Response Time:
                    </span>
                    <span className="text-white font-semibold">{estimatedTime} minutes</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Crew Required:</span>
                    <span className="text-white font-semibold">2-person repair team</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-slate-400">Drone Inspection:</span>
                    <span className="text-white font-semibold">Included ($500)</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Insurance Coverage:</span>
                    <span className="text-blue-400 font-semibold">Automated release on completion</span>
                  </div>
                </div>
              </div>

              {/* Contract Summary */}
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <p className="font-semibold text-slate-300 mb-3 text-sm">AUTOMATED EXECUTION STEPS:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">1</div>
                    <div>
                      <div className="text-white font-semibold">Deploy Contract to Blockchain</div>
                      <div className="text-slate-400">Immutable record of incident & response</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">2</div>
                    <div>
                      <div className="text-white font-semibold">Escrow $5,000 in Smart Contract</div>
                      <div className="text-slate-400">Funds locked until repair verified</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">3</div>
                    <div>
                      <div className="text-white font-semibold">Dispatch Crew via OpsBounty Contract</div>
                      <div className="text-slate-400">Automated crew finding & acceptance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">4</div>
                    <div>
                      <div className="text-white font-semibold">Release Payment on Completion</div>
                      <div className="text-slate-400">Automatic transfer when repair verified</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">5</div>
                    <div>
                      <div className="text-white font-semibold">Mint 50 ESG Credits</div>
                      <div className="text-slate-400">Tokenize avoided emissions ($2,500 value)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onReject}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all border-2 border-slate-600"
                >
                  <X className="w-5 h-5" />
                  Reject Contract
                </button>
                <button
                  onClick={onApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold transition-all border-2 border-green-500 shadow-lg shadow-green-500/30 animate-pulse-glow"
                >
                  <Check className="w-5 h-5" />
                  Approve & Deploy
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 mt-2">
                Approval will trigger blockchain transaction and immediate crew dispatch
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
          }
        }
      `}</style>
    </div>
  );
}

