import { useState, useEffect, useDeferredValue } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  FileCode,
  BookOpen,
  Sparkles,
  Network,
  Terminal,
  Edit2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CodeBlock } from "./CodeBlock";
import { DownloadButton } from "./DownloadButton";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { TECHNOLOGIES } from "../../constants/technologies";
import type { WizardState } from "../../types/wizard.types";

interface ResultViewProps {
  yaml: string;
  readme: string;
  onReset: () => void;
  state: WizardState;
}

type ActiveTab = "yaml" | "readme" | "diagram";

export function ResultView({ yaml, readme, onReset, state }: ResultViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("yaml");
  const [customProjectName, setCustomProjectName] = useState("");

  const deferredState = useDeferredValue(state);
  const deferredProjectName = useDeferredValue(customProjectName);

  useEffect(() => {
    setCustomProjectName(
      `${state.language ?? "app"}-${state.version?.replace(/[^a-z0-9]/gi, "") || "v1"}`,
    );
  }, [state.language, state.version]);

  const tech = TECHNOLOGIES.find((t) => t.id === state.language);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6"
      >
        {/* MAGIA RESPONSIVA AQUÍ: flex-col en móvil, flex-row en Desktop */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">
                ¡Todo listo! 🎉
              </h2>
              <div
                className="flex items-center gap-2 mt-1.5 group cursor-text"
                title="Haz clic para editar el nombre"
              >
                <Terminal className="flex-shrink-0 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={customProjectName}
                  onChange={(e) =>
                    setCustomProjectName(
                      e.target.value.replace(/[^a-z0-9-_]/gi, ""),
                    )
                  }
                  className="bg-transparent border-b border-transparent hover:border-primary/30 focus:border-primary focus:outline-none font-mono text-sm text-primary w-full sm:w-auto min-w-[10rem] transition-colors"
                />
                <Edit2 className="flex-shrink-0 h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                  (Clic para editar)
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="flex-shrink-0 self-end sm:self-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted/30"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Nuevo
          </button>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <DownloadButton
          yaml={yaml}
          readme={readme}
          projectName={customProjectName}
        />
      </div>

      <div className="space-y-3">
        {/* MAGIA RESPONSIVA AQUÍ: overflow-x-auto para que los botones no se aplasten */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px no-scrollbar">
          <TabButton
            active={activeTab === "yaml"}
            onClick={() => setActiveTab("yaml")}
            icon={<FileCode className="h-3.5 w-3.5 shrink-0" />}
            label="docker-compose.yml"
          />
          <TabButton
            active={activeTab === "readme"}
            onClick={() => setActiveTab("readme")}
            icon={<BookOpen className="h-3.5 w-3.5 shrink-0" />}
            label="README.md"
          />
          <TabButton
            active={activeTab === "diagram"}
            onClick={() => setActiveTab("diagram")}
            icon={<Network className="h-3.5 w-3.5 shrink-0" />}
            label="Arquitectura Visual"
          />
        </div>

        <div className="animate-fade-in">
          {activeTab === "yaml" && (
            <CodeBlock
              code={yaml}
              language="yaml"
              filename="docker-compose.yml"
            />
          )}
          {activeTab === "readme" && (
            <CodeBlock code={readme} language="markdown" filename="README.md" />
          )}
          {activeTab === "diagram" && (
            <ArchitectureDiagram
              state={deferredState}
              projectName={deferredProjectName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {icon} {label}
    </button>
  );
}