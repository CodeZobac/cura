import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DayView } from "@/components/DayView";
import { Onboarding } from "@/components/Onboarding";
import {
  type CycleState,
  TOTAL_DAYS,
  initCycle,
  loadCycle,
  saveCycle,
  clearCycle,
  checkReset,
  getCurrentDayNumber,
  canNavigateTo,
  canComplete,
  getFirstUncompletedDay,
} from "@/lib/cycle";
import { getCurrentUser, saveUser } from "@/lib/user";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./index.css";

type AppState =
  | { status: "loading" }
  | { status: "onboarding"; failed: boolean; previousName?: string }
  | { status: "ready"; cycle: CycleState; viewDay: number; userName: string }
  | { status: "error"; message: string };

export function App() {
  const [state, setState] = useState<AppState>({ status: "loading" });

  const initOrLoad = useCallback(async () => {
    const user = getCurrentUser();
    const cycle = loadCycle();

    // Detect reset: cycle exists but deadline passed
    if (cycle && checkReset(cycle)) {
      clearCycle();
      setState({
        status: "onboarding",
        failed: true,
        previousName: user?.name,
      });
      return;
    }

    // No user yet — show onboarding
    if (!user) {
      setState({ status: "onboarding", failed: false });
      return;
    }

    // User exists but no cycle — init one
    if (!cycle) {
      try {
        const res = await fetch("/photos.json");
        const photos: string[] = await res.json();
        if (photos.length === 0) {
          setState({ status: "error", message: "Nenhuma foto encontrada na pasta Familia." });
          return;
        }
        const newCycle = initCycle(photos);
        saveCycle(newCycle);
        setState({ status: "ready", cycle: newCycle, viewDay: 1, userName: user.name });
      } catch {
        setState({ status: "error", message: "Erro ao carregar fotos." });
      }
      return;
    }

    // All good
    const firstUncompleted = getFirstUncompletedDay(cycle.completedDays);
    const currentDay = getCurrentDayNumber(cycle.startDate);
    const viewDay = Math.min(Math.max(1, currentDay), firstUncompleted, TOTAL_DAYS);
    setState({ status: "ready", cycle, viewDay, userName: user.name });
  }, []);

  useEffect(() => {
    initOrLoad();
  }, [initOrLoad]);

  const handleOnboardingStart = useCallback(async (name: string) => {
    saveUser(name);
    try {
      const res = await fetch("/photos.json");
      const photos: string[] = await res.json();
      if (photos.length === 0) {
        setState({ status: "error", message: "Nenhuma foto encontrada na pasta Familia." });
        return;
      }
      const newCycle = initCycle(photos);
      saveCycle(newCycle);
      setState({ status: "ready", cycle: newCycle, viewDay: 1, userName: name });
    } catch {
      setState({ status: "error", message: "Erro ao iniciar o ciclo." });
    }
  }, []);

  const handleComplete = useCallback(() => {
    setState(prev => {
      if (prev.status !== "ready") return prev;
      const { cycle, viewDay, userName } = prev;
      const updated: CycleState = {
        ...cycle,
        completedDays: {
          ...cycle.completedDays,
          [viewDay]: new Date().toISOString(),
        },
      };
      saveCycle(updated);
      return { status: "ready", cycle: updated, viewDay, userName };
    });
  }, []);

  const navigate = useCallback((direction: -1 | 1) => {
    setState(prev => {
      if (prev.status !== "ready") return prev;
      const newDay = prev.viewDay + direction;
      if (newDay < 1 || newDay > TOTAL_DAYS) return prev;
      return { ...prev, viewDay: newDay };
    });
  }, []);

  if (state.status === "loading") {
    return (
      <div className="app-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="app-container">
        <div className="error-state">{state.message}</div>
      </div>
    );
  }

  if (state.status === "onboarding") {
    return (
      <Onboarding
        failed={state.failed}
        previousName={state.previousName}
        onStart={handleOnboardingStart}
      />
    );
  }

  const { cycle, viewDay, userName } = state;
  const completedCount = Object.keys(cycle.completedDays).length;
  const progress = (completedCount / TOTAL_DAYS) * 100;
  const canGoLeft = viewDay > 1;
  const canGoRightLoose = viewDay < TOTAL_DAYS;

  return (
    <div className="app-container">
      {/* Progress bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">
        {completedCount} de {TOTAL_DAYS} dias completos
      </p>

      {/* Title + greeting */}
      <h1 className="app-title">Ciclo dos 90 Dias de Perdão</h1>
      <p className="app-subtitle">Olá, {userName} 🕊️</p>

      {/* Navigation */}
      <div className="navigation">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          disabled={!canGoLeft}
          aria-label="Dia anterior"
        >
          <ChevronLeft className="size-6" />
        </Button>

        <span className="nav-counter">
          Dia {viewDay} de {TOTAL_DAYS}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(1)}
          disabled={!canGoRightLoose}
          aria-label="Próximo dia"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>

      {/* Day view */}
      <DayView
        dayNumber={viewDay}
        startDate={cycle.startDate}
        isCompleted={!!cycle.completedDays[viewDay]}
        canCompleteDay={canComplete(viewDay, cycle.startDate, cycle.completedDays)}
        canView={canNavigateTo(viewDay, cycle.completedDays)}
        photo={cycle.photoAssignments[viewDay]!}
        message={cycle.messageAssignments[viewDay]!}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default App;
