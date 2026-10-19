import React from 'react';
import { X, Trophy, Medal, Clock, Calendar, Sparkles } from 'lucide-react';
import { RankingRecord } from '../types/game';

interface RankingModalProps {
  rankings: RankingRecord[];
  currentNickname: string;
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  rankings,
  currentNickname,
  onClose,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}분 ${s}초`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                명예의 전당: 전체 순위판
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  최고 점수 & 최단 시간 순
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                생태계 평형 점수(100점 만점)와 클리어 시간을 종합하여 실시간 정렬됩니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ranking List Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {rankings.map((item, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const isCurrent = item.nickname === currentNickname || item.isPlayer;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/80 border-emerald-400/90 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                      : isTop3
                      ? 'bg-slate-800/80 border-amber-500/40'
                      : 'bg-slate-950/50 border-slate-800/80'
                  }`}
                >
                  {/* Left: Rank & Nickname */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-slate-400">{rank}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{item.nickname}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                            나
                          </span>
                        )}
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                          Day {item.dayReached}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTime(item.clearTimeSec)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & Grade */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-lg font-black text-amber-300">
                        {item.totalScore}
                        <span className="text-xs text-slate-400 font-normal">점</span>
                      </div>
                      <div className="text-[10px] text-slate-400">생태계 평형도</div>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${
                        item.grade.startsWith('S')
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                          : item.grade === 'A'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.grade}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
