import React, { useState } from 'react';
import { Sprout, Sun, Droplets, Wind, ShieldAlert, Sparkles, Trophy, BookOpen, Play, Dices } from 'lucide-react';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  nickname: string;
  setNickname: (val: string) => void;
  onStartGame: () => void;
  onOpenEncyclopedia: () => void;
  onOpenRanking: () => void;
}

const RANDOM_NICKNAMES = [
  '초록새싹_민우',
  '광합성마스터',
  '햇빛지킴이',
  '생태학자_하은',
  '기공수호대',
  '클린포레스트',
  '숲의아이',
  '푸른지구탐사대',
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  nickname,
  setNickname,
  onStartGame,
  onOpenEncyclopedia,
  onOpenRanking,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const handleRandomize = () => {
    const picked = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    setNickname(picked);
    setErrorMsg('');
  };

  const handleStart = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setErrorMsg('구호자 닉네임을 입력해 주세요!');
      return;
    }
    sound.playPhotosynthesis();
    onStartGame();
  };

  return (
    <div className="relative w-full min-h-[640px] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col gap-6">
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Sprout className="w-4 h-4 text-emerald-400" />
            중학교 1-2학년 과학 문제 해결 게임
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 tracking-tight">
            《녹색 구호자: 새싹 디펜스!》
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            무분별한 해충과 미세먼지 오염으로 위기에 처한 식물을 구하라! 광합성으로 양분을 만들고,
            증산 쿨링으로 폭염을 식히며 새싹을 거대한 세계수로 키워내세요.
          </p>
        </div>

        {/* 3 Core Scientific Concepts Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>1. 광합성 합성</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              빛, 물(H₂O), CO₂를 모아 포도당(성장)과 산소(방어탄)를 만듭니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>2. 증산작용 쿨링</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              무더위 경보 발생 시 쿨링 스킬(SPACE)로 기온 20~28°C를 사수합니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>3. 밤의 세포 호흡</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              달밤에 포도당과 산소를 소모해 체력을 회복하고 거목으로 진화합니다.
            </p>
          </div>
        </div>

        {/* Nickname Input Section */}
        <div className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>구호자 닉네임 입력 (순위판에 등록됩니다)</span>
            <button
              onClick={handleRandomize}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition"
            >
              <Dices className="w-3.5 h-3.5" />
              랜덤 추천
            </button>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart();
              }}
              maxLength={12}
              placeholder="예: 과학부장_민우"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-bold"
            />
          </div>

          {errorMsg && <p className="text-xs text-rose-400 font-bold">{errorMsg}</p>}
        </div>

        {/* Buttons: Start Game, Science Encyclopedia, Leaderboard */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleStart}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/30 transition transform active:scale-95 cursor-pointer text-base"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>숲으로 입장하기 (새싹 구호 작전 개시!)</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-800/80 pt-4">
          <button
            onClick={onOpenEncyclopedia}
            className="flex items-center gap-1.5 hover:text-emerald-300 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            과학 원리 교과 도감
          </button>
          <span>•</span>
          <button
            onClick={onOpenRanking}
            className="flex items-center gap-1.5 hover:text-amber-300 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            명예의 전당 (실시간 순위판)
          </button>
        </div>
      </div>
    </div>
  );
};
