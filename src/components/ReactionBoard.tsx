import React from 'react';
import { Sparkles, Sun, Droplet, Wind, ShieldAlert, Zap } from 'lucide-react';

interface ReactionBoardProps {
  lightCount: number;
  waterCount: number;
  co2Count: number;
  glucose: number;
  targetGlucose: number;
  oxygen: number;
  temperature: number;
  canPhotosynthesize: boolean;
  onSynthesizeManual?: () => void;
  efficiency: number; // 0.2 ~ 1.2
}

export const ReactionBoard: React.FC<ReactionBoardProps> = ({
  lightCount,
  waterCount,
  co2Count,
  glucose,
  targetGlucose,
  oxygen,
  temperature,
  canPhotosynthesize,
  onSynthesizeManual,
  efficiency,
}) => {
  const isOptimal = temperature >= 20 && temperature <= 28;
  const isOverheated = temperature > 30;
  const glucoseProgress = Math.min(100, (glucose / targetGlucose) * 100);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 text-white shadow-xl flex flex-col gap-3">
      {/* Title & Science Formula Heading */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-emerald-300">
              엽록체 광합성 반응기 (Photosynthesis Reactor)
            </h3>
            <p className="text-[11px] text-slate-400">
              빛, 물(H₂O), 이산화탄소(CO₂)를 모아 포도당과 산소(O₂)를 합성합니다.
            </p>
          </div>
        </div>

        {/* Efficiency Gauge */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400">광합성 효율:</span>
          <span
            className={`font-black font-mono ${
              efficiency >= 1.0 ? 'text-emerald-400' : efficiency >= 0.7 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {Math.round(efficiency * 100)}%
          </span>
          {isOverheated && (
            <span className="text-[10px] text-rose-300 font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              고온 저하
            </span>
          )}
        </div>
      </div>

      {/* Visual Reaction Equation Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
        {/* Reactants: 3 Ingredients */}
        <div className="md:col-span-6 flex items-center justify-around gap-1.5 bg-slate-900/70 p-2 rounded-lg border border-slate-800">
          {/* Light */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-amber-300 mb-0.5">
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50" />
              <span>빛에너지</span>
            </div>
            <div className="text-base font-black font-mono text-amber-200">
              {lightCount} <span className="text-[10px] font-normal text-slate-400">광자</span>
            </div>
          </div>

          <span className="text-slate-500 font-bold text-base">+</span>

          {/* Water */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-cyan-300 mb-0.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/50" />
              <span>물 (H₂O)</span>
            </div>
            <div className="text-base font-black font-mono text-cyan-200">
              {waterCount} <span className="text-[10px] font-normal text-slate-400">분자</span>
            </div>
          </div>

          <span className="text-slate-500 font-bold text-base">+</span>

          {/* CO2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-purple-300 mb-0.5">
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              <span>이산화탄소</span>
            </div>
            <div className="text-base font-black font-mono text-purple-200">
              {co2Count} <span className="text-[10px] font-normal text-slate-400">분자</span>
            </div>
          </div>
        </div>

        {/* Reaction arrow / Synthesize trigger */}
        <div className="md:col-span-1 flex justify-center py-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canPhotosynthesize
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 animate-bounce'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Zap className="w-4 h-4" />
          </div>
        </div>

        {/* Products: Glucose & Oxygen */}
        <div className="md:col-span-5 flex items-center justify-around gap-2 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
          {/* Glucose */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-amber-300 text-[11px]">포도당 (성장 에너지)</span>
            <div className="text-sm font-black font-mono text-amber-200">
              {glucose} <span className="text-[10px] text-slate-400">/ {targetGlucose}</span>
            </div>
          </div>

          <span className="text-emerald-500 font-bold text-base">+</span>

          {/* Oxygen */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-cyan-300 text-[11px]">산소 (방어 자원 O₂)</span>
            <div className="text-sm font-black font-mono text-cyan-200">
              {oxygen} <span className="text-[10px] text-slate-400">방울</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-bold">
            오늘의 목표 포도당 달성도 (낮 제한 시간 내에 채워야 밤에 성장합니다)
          </span>
          <span className="font-mono font-black text-amber-300">
            {glucose} / {targetGlucose} ({Math.round(glucoseProgress)}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-amber-900/40">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${glucoseProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
