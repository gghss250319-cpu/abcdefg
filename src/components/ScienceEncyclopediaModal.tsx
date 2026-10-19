import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, HelpCircle, Award, Sparkles } from 'lucide-react';
import { SCIENCE_CARDS } from '../data/scienceData';
import { sound } from '../utils/audio';

interface ScienceEncyclopediaModalProps {
  onClose: () => void;
  onRewardBonus?: () => void;
}

const QUIZZES = [
  {
    question: '식물이 광합성을 통해 만들어내는 최종 유기 양분과 방출 기체는 무엇일까요?',
    options: ['포도당과 산소', '녹말과 이산화탄소', '단백질과 질소', '물과 수소'],
    correctIndex: 0,
    explanation: '광합성은 이산화탄소와 물, 빛에너지를 이용해 포도당(양분)과 산소(기체)를 합성합니다.',
  },
  {
    question: '잎의 기공을 통해 물이 수증기로 증발하여 식물의 체온을 낮춰주는 현상은?',
    options: ['모세관 현상', '증산 작용', '동화 작용', '분해 작용'],
    correctIndex: 1,
    explanation: '증산작용은 물이 기화하면서 열을 빼앗아 가므로 뙤약볕 폭염에서도 식물 체온을 알맞게 식혀줍니다.',
  },
  {
    question: '빛이 없는 밤에 식물 세포 안에서 주로 일어나는 기체 교환 작용은 무엇일까요?',
    options: ['광합성만 일어난다', '세포 호흡만 일어난다', '아무 작용도 안 한다', '증산작용만 일어난다'],
    correctIndex: 1,
    explanation: '밤에는 빛이 없어 광합성이 중단되고, 산소를 흡수하여 포도당을 분해하는 세포 호흡만 일어납니다.',
  },
];

export const ScienceEncyclopediaModal: React.FC<ScienceEncyclopediaModalProps> = ({
  onClose,
  onRewardBonus,
}) => {
  const [activeTab, setActiveTab] = useState<'CARDS' | 'QUIZ'>('CARDS');
  const [selectedCardId, setSelectedCardId] = useState(SCIENCE_CARDS[0].id);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const activeCard = SCIENCE_CARDS.find((c) => c.id === selectedCardId) || SCIENCE_CARDS[0];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === QUIZZES[quizIndex].correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      sound.playPhotosynthesis();
    } else {
      sound.playHit();
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < QUIZZES.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      if (score >= 2 && onRewardBonus) {
        onRewardBonus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                중학교 1-2학년 과학 교과 도감
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  식물의 생활과 생태계
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                광합성, 호흡, 증산작용의 핵심 원리와 기후 변화의 영향을 탐구하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setActiveTab('CARDS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'CARDS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                원리 사전
              </button>
              <button
                onClick={() => setActiveTab('QUIZ')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'QUIZ' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                도전 과학 퀴즈
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Encyclopedia Cards */}
        {activeTab === 'CARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
            {/* Sidebar list */}
            <div className="md:col-span-4 flex flex-col gap-1.5 overflow-y-auto pr-1">
              {SCIENCE_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedCardId === card.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[10px] text-emerald-400 font-bold mb-0.5">{card.category}</div>
                  <div className="text-xs font-black">{card.title}</div>
                </button>
              ))}
            </div>

            {/* Main content display */}
            <div className="md:col-span-8 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 overflow-y-auto flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {activeCard.category}
                </span>
                <span className="text-xs text-slate-400">교과 필수 개념</span>
              </div>

              <h3 className="text-base font-black text-white">{activeCard.title}</h3>

              {activeCard.formula && (
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center font-mono text-emerald-200 text-xs font-bold">
                  {activeCard.formula}
                </div>
              )}

              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeCard.summary}
              </p>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-300">세부 탐구 내용:</h4>
                <ul className="flex flex-col gap-1.5">
                  {activeCard.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">중학교 시험 & 게임 공략 팁:</strong>
                  <div className="mt-0.5 text-amber-100">{activeCard.middleSchoolTip}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Quiz */}
        {activeTab === 'QUIZ' && (
          <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            {!isQuizComplete ? (
              <div className="w-full max-w-lg flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-400">
                    문제 {quizIndex + 1} / {QUIZZES.length}
                  </span>
                  <span>현재 정답: {score}개</span>
                </div>

                <h3 className="text-base font-black text-white leading-snug">
                  {QUIZZES[quizIndex].question}
                </h3>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {QUIZZES[quizIndex].options.map((opt, idx) => {
                    let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';
                    if (isAnswered) {
                      if (idx === QUIZZES[quizIndex].correctIndex) {
                        btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-lg';
                      } else if (idx === selectedAnswer) {
                        btnStyle = 'bg-rose-600 border-rose-400 text-white font-bold';
                      } else {
                        btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>
                          {idx + 1}. {opt}
                        </span>
                        {isAnswered && idx === QUIZZES[quizIndex].correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs flex flex-col gap-2 animate-fadeIn">
                    <div className="text-slate-300">
                      <strong className="text-emerald-300">과학 해설: </strong>
                      {QUIZZES[quizIndex].explanation}
                    </div>
                    <button
                      onClick={handleNextQuiz}
                      className="self-end bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      {quizIndex < QUIZZES.length - 1 ? '다음 문제' : '퀴즈 결과 보기'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-3 p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-white">과학 퀴즈 도전 완료!</h3>
                <p className="text-sm text-slate-300">
                  총 {QUIZZES.length}문제 중 <strong className="text-emerald-400 font-bold">{score}문제</strong>를
                  맞혔습니다.
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  광합성과 증산작용의 원리를 게임 속에서 직접 체험하며 체득해 보세요!
                </p>
                <button
                  onClick={() => {
                    setIsQuizComplete(false);
                    setQuizIndex(0);
                    setSelectedAnswer(null);
                    setIsAnswered(false);
                    setScore(0);
                    setActiveTab('CARDS');
                  }}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  원리 사전으로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
