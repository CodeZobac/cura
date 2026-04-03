import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Confetti, CelebrationConfetti } from "@/components/Confetti";
import { getOracao, getDayType, getDateForDay, formatDatePt, TOTAL_DAYS } from "@/lib/cycle";
import { Check, Lock, PartyPopper, Heart } from "lucide-react";

interface DayViewProps {
  dayNumber: number;
  startDate: string;
  isCompleted: boolean;
  canCompleteDay: boolean;
  canView: boolean;
  photo: string;
  message: string;
  onComplete: () => void;
}

export function DayView({
  dayNumber,
  startDate,
  isCompleted,
  canCompleteDay,
  canView,
  photo,
  message,
  onComplete,
}: DayViewProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  // Track whether the reveal should be shown (true from start if already completed)
  const [revealPhoto, setRevealPhoto] = useState(isCompleted);
  const photoRef = useRef<HTMLDivElement>(null);

  // Sync revealPhoto when navigating to a different day (isCompleted changes)
  useEffect(() => {
    setRevealPhoto(isCompleted);
    setShowConfetti(false);
  }, [dayNumber, isCompleted]);

  const type = getDayType(dayNumber);
  const date = getDateForDay(startDate, dayNumber);
  const dateStr = formatDatePt(date);
  const oracao = getOracao(type);
  const isFinalDay = dayNumber === TOTAL_DAYS;

  const handleComplete = () => {
    onComplete();
    setShowConfetti(true);
    setRevealPhoto(true);
    // Give React time to render the photo section before scrolling
    requestAnimationFrame(() => {
      setTimeout(() => {
        photoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    });
  };

  // ── Locked state ────────────────────────────────────────────────────────────
  if (!canView) {
    return (
      <Card className="day-card locked">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Dia {dayNumber} — {type.toUpperCase()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Lock className="size-16 text-muted-foreground/40" />
          <p className="text-muted-foreground text-center">
            Complete o dia anterior primeiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Final day full celebration (already completed) ──────────────────────────
  if (isFinalDay && isCompleted) {
    return (
      <Card className="day-card celebration-card">
        {showConfetti && <CelebrationConfetti duration={8000} />}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <PartyPopper className="inline size-8 mr-2 text-yellow-500" />
            Parabéns!
            <PartyPopper className="inline size-8 ml-2 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="celebration-message text-center">
            <p className="text-xl font-semibold mb-4">
              Você completou o Ciclo dos 90 Dias de Perdão!
            </p>
            <p className="text-muted-foreground mb-6">
              A sua jornada de cura e perdão foi extraordinária. Cada dia trouxe-lhe mais perto
              da paz interior e do amor incondicional. Continue a honrar este caminho.
            </p>
            <Heart className="inline size-12 text-red-400 animate-pulse mx-auto" />
          </div>
          <div className="photo-reveal">
            <img
              src={`/familia/${encodeURIComponent(photo)}`}
              alt="Foto da família"
              className="day-photo"
            />
          </div>
          <p className="afirmacao text-center italic">"{message}"</p>
        </CardContent>
      </Card>
    );
  }

  // ── Normal day ──────────────────────────────────────────────────────────────
  return (
    <Card className="day-card">
      {showConfetti && <Confetti duration={isFinalDay ? 8000 : 4000} />}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Dia {dayNumber} — {type.toUpperCase()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{dateStr}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Prayer text — renders fully, no scroll */}
        <div className="oracao-container">
          {oracao.split("\n").map((line, i) => (
            <p key={i} className={line.trim() === "" ? "oracao-spacer" : "oracao-line"}>
              {line || "\u00A0"}
            </p>
          ))}
        </div>

        {/* Completion button — always the last element before the reveal */}
        {!isCompleted && canCompleteDay && (
          <Button onClick={handleComplete} className="complete-btn mx-auto" size="lg">
            <Check className="size-5 mr-2" />
            Marcar como concluído
          </Button>
        )}

        {!isCompleted && !canCompleteDay && (
          <div className="text-center text-muted-foreground text-sm py-4">
            Este dia ainda não chegou. Volte em breve.
          </div>
        )}

        {isCompleted && !revealPhoto && (
          <div className="text-center text-green-600 font-medium py-2 flex items-center justify-center gap-2">
            <Check className="size-4" /> Concluído
          </div>
        )}

        {/* Photo + affirmation — revealed after completion, smooth scroll target */}
        {revealPhoto && (
          <div ref={photoRef} className={`completed-reveal ${showConfetti ? "animate-in" : ""}`}>
            <div className="photo-reveal">
              <img
                src={`/familia/${encodeURIComponent(photo)}`}
                alt="Foto da família"
                className="day-photo"
              />
            </div>
            <p className="afirmacao text-center italic">"{message}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
