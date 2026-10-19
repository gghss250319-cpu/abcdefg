import React from 'react';
import { Volume2, VolumeX, BookOpen, AlertTriangle, ShieldCheck, Thermometer, Droplets, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderHUDProps {
  day: number;
  dayDuration: number;
  dayTimeRemaining: number;
  health: number;
  maxHealth: number;
  water: number;
  maxWater: number;
  temperature: number;
  isHeatwave: boolean;
  heatwaveTimeLeft: number;
  nickname: string;
  onOpenEncyclopedia: () => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  day,
  dayDuration,
  dayTimeRemaining,
  health,
  maxHealth,
  water,
  maxWater,
  temperature,
  isHeatwave,
  heatwaveTimeLeft,
  nickname,
  onOpenEncyclopedia,
  isMuted,
  setIsMuted,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const waterPercent = Math.max(0, Math.min(100, (water / maxWater) * 100));
  const isOptimalTemp = temperature >= 20 && temperature <= 28;
  const isOverheat = temperature > 30;

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  return (
    <div className="w-full flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 text-white shadow-xl">
      {/* Top row: Identity, Day Progress, Utilities */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white font-black px-3 py-1 rounded-xl shadow-md text-sm tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            DAY {day} / 5
          </div>
          <div className="text-xs text-slate-300 font-medium">
            구호자: <span className="text-emerald-400 font-bold">{nickname || '학생 구호자'}</span>
          </div>
        </div>

        {/* Day sunset timer */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400 font-medium">일몰까지:</span>
          <span className="text-sm font-extrabold text-amber-300 font-mono">
            {Math.ceil(dayTimeRemaining)}초
          </span>
          <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${(dayTimeRemaining / dayDuration) * 100}%` }}
            />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEncyclopedia}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 transition active:scale-95 cursor-pointer"
            title="중학교 과학 도감 열기"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            과학 도감
          </button>
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Vital Gauges: HP, Water, Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* 1. Health Bar */}
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 font-bold text-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/80" />
              새싹 생명력 (HP)
            </span>
            <span className="font-mono text-xs text-rose-200">
              {Math.round(health)} / {maxHealth}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-rose-900/40">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                hpPercent < 25 ? 'bg-rose-600 animate-pulse' : 'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Water / Moisture Bar */}
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/80" />
              수분량 (H₂O · 쿨링 자원)
            </span>
            <span className="font-mono text-xs text-cyan-200">
              {Math.round(water)} / {maxWater}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-900/40">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Temperature Thermometer */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-colors ${
            isHeatwave
              ? 'bg-rose-950/60 border-rose-600/80 animate-pulse'
              : isOverheat
              ? 'bg-amber-950/40 border-amber-500/60'
              : isOptimalTemp
              ? 'bg-emerald-950/40 border-emerald-500/60'
              : 'bg-slate-800/60 border-slate-700/60'
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Thermometer
                className={`w-3.5 h-3.5 ${
                  isHeatwave ? 'text-rose-400' : isOverheat ? 'text-amber-400' : 'text-emerald-400'
                }`}
              />
              식물 체온
              {isOptimalTemp && (
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  최적 (20~28°C)
                </span>
              )}
            </span>
            <span
              className={`font-mono text-xs font-black ${
                isHeatwave ? 'text-rose-300' : isOverheat ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {temperature.toFixed(1)}°C
            </span>
          </div>

          {/* Temperature visual scale */}
          <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div className="w-1/4 h-full bg-blue-500/40" title="저온 (<18°C)" />
            <div className="w-1/2 h-full bg-emerald-500/60 border-x border-emerald-400" title="최적 광합성 (20-28°C)" />
            <div className="w-1/4 h-full bg-rose-500/60" title="고온 위험 (>30°C)" />

            {/* Indicator pin */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-md transition-all duration-200 transform -translate-x-1"
              style={{
                left: `${Math.max(5, Math.min(95, ((temperature - 10) / 35) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Heatwave Countdown Banner */}
      {isHeatwave && (
        <div className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white px-4 py-2 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-300 animate-bounce" />
            <span className="font-black text-sm">
              [폭염 경보 발령!] 기온 급상승 중! 쿨링 스킬(SPACE)을 쓰지 않으면 새싹 체력이 깎입니다!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-yellow-200">제한 시간:</span>
            <span className="font-mono text-base font-black bg-black/40 px-2.5 py-0.5 rounded-lg border border-yellow-300/40">
              {heatwaveTimeLeft.toFixed(1)}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
