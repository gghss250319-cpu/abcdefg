import React from 'react';
import { Snowflake, Wind, Droplets, Crosshair, Shield } from 'lucide-react';

interface DefenseSkillsProps {
  water: number;
  oxygen: number;
  temperature: number;
  isCoolingActive: boolean;
  coolingCooldown: number; // 0 to 1
  onActivateCooling: () => void;
  onActivateOxygenBlast: () => void;
  onCleanAllStomata: () => void;
  onClearClouds: () => void;
}

export const DefenseSkills: React.FC<DefenseSkillsProps> = ({
  water,
  oxygen,
  temperature,
  isCoolingActive,
  coolingCooldown,
  onActivateCooling,
  onActivateOxygenBlast,
  onCleanAllStomata,
  onClearClouds,
}) => {
  const canCool = water >= 12 && coolingCooldown <= 0;
  const canShootOxygen = oxygen >= 1;
  const canCleanAll = water >= 10;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-emerald-500/30 text-white shadow-xl flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <span className="flex items-center gap-1.5 text-emerald-300">
          <Shield className="w-4 h-4 text-emerald-400" />
          생태 방어 & 쿨링 스킬 컨트롤러
        </span>
        <span className="text-[11px] text-slate-400">단축키: [SPACE], [Q], [E], [W]</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* 1. Cooling Skill (Transpiration) */}
        <button
          onClick={onActivateCooling}
          disabled={!canCool}
          className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
            canCool
              ? 'bg-gradient-to-b from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border-cyan-400 shadow-lg shadow-cyan-600/30 active:scale-95'
              : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
          }`}
        >
          {coolingCooldown > 0 && (
            <div
              className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center font-mono font-black text-cyan-300 text-xs"
              style={{ backdropFilter: 'blur(2px)' }}
            >
              {(coolingCooldown * 4).toFixed(1)}s
            </div>
          )}
          <div className="flex items-center gap-1.5 mb-1">
            <Snowflake className={`w-4 h-4 ${isCoolingActive ? 'animate-spin text-white' : 'text-cyan-200'}`} />
            <span className="font-black text-xs text-white">증산 쿨링 [SPACE]</span>
          </div>
          <span className="text-[10px] text-cyan-100 leading-tight text-center">
            기화열 냉각 (-7°C) & 폭염 해제
          </span>
          <span className="text-[9px] text-cyan-300/80 mt-1 font-mono">소모: 물 12</span>
        </button>

        {/* 2. Oxygen Blast */}
        <button
          onClick={onActivateOxygenBlast}
          disabled={!canShootOxygen}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
            canShootOxygen
              ? 'bg-gradient-to-b from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 border-sky-400 shadow-lg shadow-sky-600/30 active:scale-95'
              : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Crosshair className="w-4 h-4 text-sky-200" />
            <span className="font-black text-xs text-white">산소포 발사 [Q]</span>
          </div>
          <span className="text-[10px] text-sky-100 leading-tight text-center">
            해충 타격 & 접근 차단
          </span>
          <span className="text-[9px] text-sky-300/80 mt-1 font-mono">소모: 산소 1 / 잔여: {oxygen}</span>
        </button>

        {/* 3. Stomata Flush */}
        <button
          onClick={onCleanAllStomata}
          disabled={!canCleanAll}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
            canCleanAll
              ? 'bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-emerald-400 shadow-lg shadow-emerald-600/30 active:scale-95'
              : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Droplets className="w-4 h-4 text-teal-200" />
            <span className="font-black text-xs text-white">기공 워터 세척 [E]</span>
          </div>
          <span className="text-[10px] text-teal-100 leading-tight text-center">
            모든 잎의 미세먼지 일괄 정화
          </span>
          <span className="text-[9px] text-teal-300/80 mt-1 font-mono">소모: 물 10</span>
        </button>

        {/* 4. Wind Gust */}
        <button
          onClick={onClearClouds}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-400/80 bg-gradient-to-b from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-600/30 active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Wind className="w-4 h-4 text-amber-200" />
            <span className="font-black text-xs text-white">바람 일으키기 [W]</span>
          </div>
          <span className="text-[10px] text-amber-100 leading-tight text-center">
            먹구름 날리기 & 햇빛 100% 회복
          </span>
          <span className="text-[9px] text-amber-300/80 mt-1 font-mono">쿨다운 없음</span>
        </button>
      </div>
    </div>
  );
};
