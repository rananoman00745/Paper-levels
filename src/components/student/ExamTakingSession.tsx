import React, { useState, useEffect } from 'react';
import { ExamPaper, User, ExamSubmission, StudentResponse, OptionLetter } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Send,
} from 'lucide-react';

interface ExamTakingSessionProps {
  paper: ExamPaper;
  currentUser: User;
  onFinishExam: (submission: ExamSubmission) => void;
  onExit: () => void;
}

export const ExamTakingSession: React.FC<ExamTakingSessionProps> = ({
  paper,
  currentUser,
  onFinishExam,
  onExit,
}) => {
  const { t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionLetter | null>(null);
  
  // Track whether the current question has been submitted for immediate answer verification
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [responses, setResponses] = useState<Record<string, StudentResponse>>({});
  
  // Timer state
  const totalSeconds = paper.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const currentQ = paper.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === paper.questions.length - 1;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit and verify current question immediately
  const handleVerifyQuestion = () => {
    if (!selectedOption || !currentQ) return;

    const isCorrect = selectedOption === currentQ.correctOption;
    const pointsEarned = isCorrect ? currentQ.points : 0;

    const newResponse: StudentResponse = {
      questionId: currentQ.id,
      selectedOption,
      isCorrect,
      pointsEarned,
      answeredAt: new Date().toISOString(),
    };

    setResponses(prev => ({
      ...prev,
      [currentQ.id]: newResponse,
    }));

    setIsQuestionSubmitted(true);
  };

  // Move to next question or finish exam
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitEntireExam();
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQ = paper.questions[nextIndex];
      const existing = responses[nextQ.id];
      if (existing) {
        setSelectedOption(existing.selectedOption);
        setIsQuestionSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsQuestionSubmitted(false);
      }
    }
  };

  const handleSubmitEntireExam = () => {
    const allResponsesList: StudentResponse[] = paper.questions.map(q => {
      return (
        responses[q.id] || {
          questionId: q.id,
          selectedOption: 'A',
          isCorrect: false,
          pointsEarned: 0,
          answeredAt: new Date().toISOString(),
        }
      );
    });

    const totalPoints = paper.questions.reduce((sum, q) => sum + q.points, 0);
    const score = allResponsesList.reduce((sum, r) => sum + r.pointsEarned, 0);
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= paper.passPercentage;
    const timeSpentSeconds = totalSeconds - secondsRemaining;

    const finalSubmission: ExamSubmission = {
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      paperId: paper.id,
      paperTitle: paper.title,
      paperLevel: paper.level,
      paperKey: paper.key,
      studentId: currentUser.studentId || 'STU-' + currentUser.id.slice(0, 4),
      studentUsername: currentUser.username,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      score,
      totalPoints,
      percentage,
      passed,
      startedAt,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds,
      responses: allResponsesList,
      verifiedByAdmin: false,
    };

    storageService.saveSubmission(finalSubmission);
    onFinishExam(finalSubmission);
  };

  const currentResponse = currentQ ? responses[currentQ.id] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Exam Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-900 text-white rounded-md">
              GER {paper.level}
            </span>
            <div className="max-w-[190px] sm:max-w-md">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                {paper.title}
              </h1>
              <p className="text-[11px] text-slate-500 font-mono">
                {paper.key} · {currentUser.name}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
            secondsRemaining < 300
              ? 'border-red-300 bg-red-50 text-red-700 animate-pulse'
              : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-slate-900 h-1 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / paper.questions.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Main Question Body */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center">
        
        {/* Step Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>{t.question} {currentQuestionIndex + 1} {t.of} {paper.questions.length}</span>
          <span className="font-semibold text-slate-700">{t.worthPoints}: {currentQ.points} {t.pointsLabel}</span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Question context note */}
          {currentQ.contextNote && (
            <div className="inline-block text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
              {currentQ.contextNote}
            </div>
          )}

          {/* German Question Prompt */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Options List (Supports 3, 4, or 5 options) */}
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option.label;
              const isCorrectAnswer = option.label === currentQ.correctOption;

              let optionStyle = 'border-slate-200 hover:border-slate-400 bg-white text-slate-900';
              if (!isQuestionSubmitted) {
                if (isSelected) {
                  optionStyle = 'border-slate-900 ring-2 ring-slate-900 bg-slate-50 text-slate-900 font-semibold';
                }
              } else {
                if (isCorrectAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'border-red-400 bg-red-50 text-red-950 ring-1 ring-red-400 line-through';
                } else {
                  optionStyle = 'border-slate-100 bg-slate-50/50 text-slate-400';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isQuestionSubmitted}
                  onClick={() => setSelectedOption(option.label)}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isQuestionSubmitted
                        ? isCorrectAnswer
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                        : isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {option.label}
                    </span>
                    <span className="text-sm sm:text-base font-medium">
                      {option.text}
                    </span>
                  </div>

                  {isQuestionSubmitted && (
                    <div>
                      {isCorrectAnswer && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {t.correctSolution}
                        </span>
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          {t.yourChoice}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Banner (Displayed right after submitting question!) */}
          {isQuestionSubmitted && currentResponse && (
            <div className={`p-5 rounded-xl border space-y-3 transition-all ${
              currentResponse.isCorrect
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2">
                {currentResponse.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h3 className="text-sm font-bold text-emerald-900">
                      {t.correctAnswerBanner} (+{currentResponse.pointsEarned} {t.pointsLabel})
                    </h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-700 shrink-0" />
                    <h3 className="text-sm font-bold text-amber-900">
                      {t.wrongAnswerBanner} {currentQ.correctOption}
                    </h3>
                  </>
                )}
              </div>

              {/* Grammar explanation */}
              <div className="bg-white/80 p-3.5 rounded-lg border border-slate-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">
                  {t.explanationTitle}
                </span>
                {currentQ.explanation}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-slate-500 hover:text-slate-800 underline order-2 sm:order-1"
            >
              {t.exitExam}
            </button>

            <div className="flex items-center gap-3 order-1 sm:order-2">
              {!isQuestionSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleVerifyQuestion}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t.submitAndVerify}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isLastQuestion ? t.finishExamAndSeeResults : t.nextQuestion}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
