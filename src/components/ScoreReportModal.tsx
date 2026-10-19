import React from 'react';
import { Trophy, Award, Thermometer, Sparkles, Droplets, RotateCcw, ListOrdered, CheckCircle, Trees } from 'lucide-react';
import { EcoScoreReport } from '../types/game';

interface ScoreReportModalProps {
  isVictory: boolean;
  nickname: string;
  report: EcoScoreReport;
  rank: number;
  totalParticipants: number;
  clearTimeSec: number;
  onOpenRanking: () => void;
  onRestart: () => void;
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({
  isVictory,
  nickname,
  report,
  rank,
  totalParticipants,
  clearTimeSec,
  onOpenRanking,
  onRestart,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}분 ${s}초`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header Badge */}
        <div className="text-center flex flex-col items-center gap-2">
          {isVictory ? (
            <>
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-xl shadow-emerald-500/30 animate-bounce">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
                  <Trees className="w-9 h-9" />
                </div>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                생태계 수호 완수 · 세계수로의 완숙 각성!
              </span>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                《녹색 구호자: 새싹 디펜스!》 클리어
              </h2>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <Thermometer className="w-8 h-8" />
              </div>
              <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-full">
                생태 위기 도달
              </span>
              <h2 className="text-2xl font-black text-white">생태계 평형 분석 보고서</h2>
            </>
          )}
          <p className="text-xs text-slate-400">
            구호자 <strong className="text-emerald-400">{nickname}</strong> 학생의 생태계 보전 활동 종합
            결과입니다.
          </p>
        </div>

        {/* Big Eco-Score Display */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              최종 생태계 평형 점수 (100점 만점)
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black font-mono text-emerald-300 tracking-tight">
                {report.totalScore}
              </span>
              <span className="text-sm text-slate-400 font-bold">/ 100점</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              총 플레이 시간: <strong className="text-white font-mono">{formatTime(clearTimeSec)}</strong>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl font-black text-amber-300 shadow-lg shadow-amber-500/20">
              {report.grade}
            </div>
            <span className="text-[11px] font-bold text-amber-300 mt-1">
              {rank > 0 ? `전체 순위 ${rank}위` : '순위권 진입'}
            </span>
          </div>
        </div>

        {/* 3 Core Criteria Breakdown (100점 산출 항목) */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            생태계 평형 점수 세부 평가표 (중학교 과학 평가 기준)
          </h3>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {/* 1. Temperature */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">온도 유지율 (적정 20~28°C)</div>
                  <div className="text-[11px] text-slate-400">
                    전체 시간 중 적정 체온 유지 비율: {report.tempOptimalRatio}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-emerald-300 text-sm">
                  {report.tempScore}
                </span>
                <span className="text-[10px] text-slate-500"> / 35점</span>
              </div>
            </div>

            {/* 2. Glucose */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">포도당 생산량 (광합성 효율)</div>
                  <div className="text-[11px] text-slate-400">
                    누적 합성 양분: {report.totalGlucoseProduced} 포도당
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-amber-300 text-sm">
                  {report.glucoseScore}
                </span>
                <span className="text-[10px] text-slate-500"> / 35점</span>
              </div>
            </div>

            {/* 3. Stomata Purification */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">기공 정화 & 오염 차단 횟수</div>
                  <div className="text-[11px] text-slate-400">
                    미세먼지 청소: {report.stomaCleanCount}회 | 퇴치 해충: {report.pestsDefeated}마리
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-cyan-300 text-sm">
                  {report.stomaScore}
                </span>
                <span className="text-[10px] text-slate-500"> / 30점</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Evaluation Comment */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl flex flex-col gap-1.5 text-xs">
          <div className="font-black text-emerald-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            과학 교사 종합 총평: {report.evaluationText}
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">{report.scienceTip}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onOpenRanking}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition active:scale-95 border border-slate-700 cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-amber-400" />
            전체 순위판 보기
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            다시 도전하기
          </button>
        </div>
      </div>
    </div>
  );
};
