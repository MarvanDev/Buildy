import { useMemo, useState } from "react"
import { Download, Copy, RotateCcw, Check } from "lucide-react"
import { saveAs } from "file-saver"
import type { WizardState } from "../../types/wizard.types"
import { ArchitectureDiagram } from "./ArchitectureDiagram"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

type ResultTabId = "compose" | "readme"

interface ResultViewProps {
  yaml: string
  readme: string
  state: WizardState
  onReset: () => void
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  saveAs(blob, filename)
}

export function ResultView({ yaml, readme, onReset, state }: ResultViewProps) {
  const [tab, setTab] = useState<ResultTabId>("compose")
  const [copied, setCopied] = useState<ResultTabId | null>(null)

  const activeText = useMemo(() => (tab === "compose" ? yaml : readme), [tab, yaml, readme])

  const handleCopy = async () => {
    await copyToClipboard(activeText)
    setCopied(tab)
    window.setTimeout(() => setCopied(null), 1200)
  }

  const handleDownload = () => {
    if (tab === "compose") downloadText("docker-compose.yml", yaml)
    else downloadText("README.md", readme)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Resultado</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopy}>
                {copied === tab ? <Check /> : <Copy />}
                {copied === tab ? "Copiado" : "Copiar"}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download />
                Descargar
              </Button>
              <Button variant="secondary" onClick={onReset}>
                <RotateCcw />
                Volver
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Arquitectura estimada</p>
            <ArchitectureDiagram
              state={state}
              projectName={state.language ? state.language.toUpperCase() : "App"}
            />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as ResultTabId)}>
            <TabsList>
              <TabsTrigger value="compose">docker-compose.yml</TabsTrigger>
              <TabsTrigger value="readme">README.md</TabsTrigger>
            </TabsList>

            <TabsContent value="compose">
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-border bg-background/60 p-3 text-xs leading-relaxed">
                <code>{yaml}</code>
              </pre>
            </TabsContent>

            <TabsContent value="readme">
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-border bg-background/60 p-3 text-xs leading-relaxed">
                <code>{readme}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="justify-between">
          <span className="text-xs text-muted-foreground">
            Tip: podés pegar el YAML directo en tu proyecto.
          </span>
          <span className="text-xs text-muted-foreground">
            {state.publicAccess ? "Expuesto públicamente" : "Solo local"}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

