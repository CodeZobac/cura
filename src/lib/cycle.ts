// ─── Types ───────────────────────────────────────────────────────────────────

export interface CycleState {
  startDate: string; // ISO date string (YYYY-MM-DD)
  completedDays: Record<number, string>; // dayNumber → ISO timestamp of completion
  photoAssignments: Record<number, string>; // dayNumber → filename
  messageAssignments: Record<number, string>; // dayNumber → affirmation message
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const TOTAL_DAYS = 90;

export const AFIRMACOES: string[] = [
  "Todo o meu Eu, todo o meu corpo, todas as minhas células vibram amor",
  "Eu sei o que é viver a minha versão mais elevada",
  "Eu sei o que é sentir-me amado(a)",
  "Eu sei o que é sentir-me belo(a)",
  "Eu sei o que é sentir-me cuidado(a)",
  "Tudo é sobre mim, nada é sobre o outro",
  "Eu conecto-me ao meu curador interno",
  "Eu sei o que é sentir-me seguro(a)",
  "Eu sei o que é viver o meu potencial máximo",
  "Eu sou o meu melhor e único curador",
  "Eu liberto a vítima que há em mim",
  "Eu liberto os ganhos que a minha mente criou das mais diversas situações às quais me aprisiono",
  "Eu tenho clareza sobre o momento do meu processo",
  "Eu liberto a doença em mim e através de mim",
  "Eu honro e agradeço cada obstáculo, cada desafio que me trouxe à minha mais elevada versão",
  "Eu regresso a mim mesmo(a)",
  "Eu liberto o julgamento em mim e através de mim",
  "Eu sei o que é viver livre de julgamento",
  "Eu liberto a condenação em mim e através de mim",
  "Eu sei o que é viver livre da condenação",
  "Eu liberto o controlo",
  "Eu liberto-me",
  "Eu sei o que é viver livremente a minha própria história",
  "Eu crio a minha realidade",
  "Eu sei o que é estar comigo mesmo(a), cuidar de mim",
  "Eu sei o que é viver em plena atenção",
  "Eu sei o que é estar em estado de presença",
  "Eu liberto a dependência emocional do outro, relembrando-me que a nutrição e o amor vêm de dentro",
  "Eu sei como me auto nutrir e cuidar",
  "Eu amo-me, muito",
  "Eu honro o meu corpo em todas as suas marcas, histórias e imperfeições",
  "Eu honro cada uma das minhas escolhas, pois hoje sei que foram para o meu crescimento e evolução",
  "Eu honro e agradeço a todos aqueles que passaram na minha história, todos os papéis que tiveram que desempenhar para que visse tanto sobre mim",
  "Eu estou pronto(a)",
  "Eu sou capaz",
  "Eu escrevo a minha própria história",
  "Eu estou no comando da minha jornada",
  "Eu valorizo-me",
  "Eu sei o que é sentir-me valorizado(a)",
  "Eu sei o que é sentir-me acolhido(a)",
  "Eu sei o que é sentir-me amparado(a)",
  "Eu sou suficiente",
  "Eu curo-me",
  "O meu propósito é curar-me",
  "Eu ultrapasso os limites que a minha mente reptiliana conta-me que tenho",
  "Eu ultrapasso-me",
  "Eu desperto",
];

const ORACAO_TEMPLATE = `

Eu perdoo você, por favor, me perdoe.

Você nunca teve culpa,

Eu também nunca tive culpa,

Eu perdoo você, me perdoe, por favor.

A vida nos ensina através das discórdias [...]

E eu aprendi a amá-lo(a) e a deixá-lo(a) ir de minha mente.

Você precisa viver suas próprias lições e eu também.

Eu perdoo você [...] me perdoe em nome de Deus.

Agora, vá ser feliz, para que eu seja também.

Que Deus o(a) proteja e perdoe os nossos mundos,

As mágoas desapareceram do meu coração e só há luz e paz em minha vida.

Quero você alegre, sorrindo, onde quer que você esteja [...]

É tão bom soltar, parar de resistir e deixar fluir novos sentimentos!

Eu perdoei você do fundo de minha alma, porque sei que você nunca fez nada por mal,

E sim, porque acreditou que era a melhor maneira de ser feliz [...]

Me perdoe por ter nutrido ódio e mágoa por tanto tempo em meu coração. Eu não sabia como era bom perdoar e soltar; eu não sabia como era bom deixar ir, o que nunca me pertenceu.

Agora sei que só podemos ser felizes quando soltamos as vidas, para que sigam seus próprios sonhos e seus próprios erros. Não quero mais controlar nada, nem ninguém. Por isso, peço que me perdoe e me solte também, para que seu coração se encha de amor, assim como o meu.`;

// ─── Prayer Generator ────────────────────────────────────────────────────────

export function getOracao(type: "pai" | "mãe"): string {
  const isPai = type === "pai";
  const greeting = isPai ? "Pai que me trouxe ao mundo" : "Mãe que me trouxe ao mundo";

  let text = ORACAO_TEMPLATE;

  // Replace [...] with pai/mãe
  text = text.replace(/\[\.\.\.]/g, isPai ? "pai" : "mãe");

  // Resolve gendered pronouns
  if (isPai) {
    text = text.replace(/amá-lo\(a\)/g, "amá-lo");
    text = text.replace(/deixá-lo\(a\)/g, "deixá-lo");
    text = text.replace(/o\(a\) proteja/g, "o proteja");
  } else {
    text = text.replace(/amá-lo\(a\)/g, "amá-la");
    text = text.replace(/deixá-lo\(a\)/g, "deixá-la");
    text = text.replace(/o\(a\) proteja/g, "a proteja");
  }

  return `${greeting}\n\n${text}`;
}

// ─── Day Helpers ─────────────────────────────────────────────────────────────

/** Odd days = PAI, even days = MÃE */
export function getDayType(dayNumber: number): "pai" | "mãe" {
  return dayNumber % 2 === 1 ? "pai" : "mãe";
}

/** Get today's date as YYYY-MM-DD */
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns the date for a given day number in the cycle */
export function getDateForDay(startDate: string, dayNumber: number): Date {
  const start = new Date(startDate + "T00:00:00");
  const d = new Date(start);
  d.setDate(d.getDate() + (dayNumber - 1));
  return d;
}

/** Get which day number today corresponds to (1-based). Returns 0 if before start, >90 if after end. */
export function getCurrentDayNumber(startDate: string): number {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

/** Can the user navigate to this day? All previous days must be completed. */
export function canNavigateTo(dayNumber: number, completedDays: Record<number, string>): boolean {
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return false;
  for (let i = 1; i < dayNumber; i++) {
    if (!completedDays[i]) return false;
  }
  return true;
}

/** Can the user complete this day? Must be the current day or earlier AND navigable. */
export function canComplete(dayNumber: number, startDate: string, completedDays: Record<number, string>): boolean {
  if (completedDays[dayNumber]) return false; // already completed
  if (!canNavigateTo(dayNumber, completedDays)) return false;
  const currentDay = getCurrentDayNumber(startDate);
  return dayNumber <= currentDay;
}

/** Get the first uncompleted day number */
export function getFirstUncompletedDay(completedDays: Record<number, string>): number {
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    if (!completedDays[i]) return i;
  }
  return TOTAL_DAYS; // all completed
}

// ─── Reset Detection ─────────────────────────────────────────────────────────

/**
 * Check if the cycle should be reset.
 * Rule: if the first uncompleted day N's deadline has passed, reset.
 * Deadline = start of day (N+1) + 6 hours = startDate + N days at 06:00 AM.
 */
export function checkReset(state: CycleState): boolean {
  const firstUncompleted = getFirstUncompletedDay(state.completedDays);
  if (firstUncompleted > TOTAL_DAYS) return false; // cycle complete, no reset
  if (Object.keys(state.completedDays).length === 0) {
    // No days completed yet — deadline is day 2 at 06:00 AM
    // (user has until 6AM of the next day after day 1 to complete day 1)
  }

  // Deadline: the day AFTER dayN at 06:00 AM
  const start = new Date(state.startDate + "T00:00:00");
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + firstUncompleted); // day after dayN
  deadline.setHours(6, 0, 0, 0);

  return new Date() > deadline;
}

// ─── Cycle Init ──────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function initCycle(photos: string[]): CycleState {
  const shuffledPhotos = shuffle(photos);
  const photoAssignments: Record<number, string> = {};
  const messageAssignments: Record<number, string> = {};

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    // Assign photos — cycle through if not enough (but we have ~93 > 90)
    photoAssignments[i] = shuffledPhotos[(i - 1) % shuffledPhotos.length]!;
    // Assign messages — random with possible repeats
    messageAssignments[i] = AFIRMACOES[Math.floor(Math.random() * AFIRMACOES.length)]!;
  }

  return {
    startDate: todayStr(),
    completedDays: {},
    photoAssignments,
    messageAssignments,
  };
}

// ─── Persistence (localStorage) ──────────────────────────────────────────────

const CYCLE_KEY = "perdao-cycle";

export function loadCycle(): CycleState | null {
  const raw = localStorage.getItem(CYCLE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CycleState;
  } catch {
    return null;
  }
}

export function saveCycle(state: CycleState): void {
  localStorage.setItem(CYCLE_KEY, JSON.stringify(state));
}

export function clearCycle(): void {
  localStorage.removeItem(CYCLE_KEY);
}

/** Format a date in Portuguese */
export function formatDatePt(date: Date): string {
  const dias = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado",
  ];
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${dias[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
}
