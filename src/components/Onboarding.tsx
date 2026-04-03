import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feather, RefreshCw } from "lucide-react";

interface OnboardingProps {
  failed: boolean;
  previousName?: string;
  onStart: (name: string) => void;
}

export function Onboarding({ failed, previousName, onStart }: OnboardingProps) {
  const [name, setName] = useState(previousName ?? "");
  const [touched, setTouched] = useState(false);

  const trimmed = name.trim();
  const isValid = trimmed.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onStart(trimmed);
  };

  return (
    <div className="onboarding-wrapper">
      <Card className="onboarding-card">
        {failed ? (
          <>
            <CardHeader className="text-center gap-3">
              <div className="onboarding-icon failed-icon">
                <RefreshCw className="size-8 text-amber-500" />
              </div>
              <CardTitle className="text-2xl">O ciclo foi interrompido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="onboarding-fail-message">
                <p>
                  Não conseguiste completar um dia a tempo e o teu progresso foi reiniciado.
                </p>
                <p>
                  Não te culpes — cada recomeço é um novo passo de cura. A jornada do perdão
                  pede-te apenas que continues a tentar, com compaixão por ti mesmo(a).
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name-input">Como te chamas?</Label>
                  <Input
                    id="name-input"
                    placeholder="O teu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    autoFocus
                    className={touched && !isValid ? "border-destructive" : ""}
                  />
                  {touched && !isValid && (
                    <p className="text-sm text-destructive">Por favor, introduz o teu nome.</p>
                  )}
                </div>
                <Button type="submit" className="complete-btn w-full" size="lg">
                  <RefreshCw className="size-4 mr-2" />
                  Recomeçar o ciclo
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center gap-3">
              <div className="onboarding-icon">
                <Feather className="size-8 text-violet-500" />
              </div>
              <CardTitle className="text-2xl">Ciclo dos 90 Dias de Perdão</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="onboarding-welcome">
                Bem-vindo(a) a esta jornada de cura. Durante 90 dias, vais dedicar cada dia
                a uma oração de perdão — ora ao teu Pai, ora à tua Mãe — libertando o que
                já não te serve e abrindo espaço para a paz interior.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name-input">Qual é o teu nome?</Label>
                  <Input
                    id="name-input"
                    placeholder="O teu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    autoFocus
                    className={touched && !isValid ? "border-destructive" : ""}
                  />
                  {touched && !isValid && (
                    <p className="text-sm text-destructive">Por favor, introduz o teu nome.</p>
                  )}
                </div>
                <Button type="submit" className="complete-btn w-full" size="lg">
                  <Feather className="size-4 mr-2" />
                  Começar o ciclo
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
