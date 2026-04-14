/**
 * DownloadButton — Botón grande y llamativo para descargar el proyecto .zip.
 * Integra el zip.service para empaquetar YAML + README.
 */
import { useState } from 'react'
import { Download, Loader2, Package, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { downloadProjectZip } from '../../services/zip.service'

interface DownloadButtonProps {
  yaml: string
  readme: string
  projectName?: string
}

type DownloadState = 'idle' | 'loading' | 'success'

export function DownloadButton({
  yaml,
  readme,
  projectName = 'buildy-project',
}: DownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle')

  const handleDownload = async () => {
    if (downloadState !== 'idle') return

    setDownloadState('loading')
    try {
      await downloadProjectZip({ dockerCompose: yaml, readme }, projectName)
      setDownloadState('success')
      setTimeout(() => setDownloadState('idle'), 3000)
    } catch (error) {
      console.error('Error al generar el ZIP:', error)
      setDownloadState('idle')
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleDownload}
        disabled={downloadState === 'loading'}
        className={cn(
          'relative group flex items-center gap-3 px-8 py-4 rounded-xl',
          'text-base font-semibold transition-all duration-300',
          'border-2 overflow-hidden',
          downloadState === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 cursor-default'
            : downloadState === 'loading'
            ? 'bg-primary/10 border-primary/30 text-primary/70 cursor-not-allowed'
            : [
                'bg-primary text-primary-foreground border-primary',
                'hover:brightness-110 hover:shadow-glow-lg',
                'active:scale-95 active:brightness-90',
                'shadow-glow',
              ]
        )}
      >
        {/* Shimmer effect en estado idle */}
        {downloadState === 'idle' && (
          <span className="absolute inset-0 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 bg-white/10 w-1/2" />
        )}

        {/* Ícono según estado */}
        {downloadState === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : downloadState === 'success' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Download className="h-5 w-5 group-hover:translate-y-0.5 transition-transform duration-200" />
        )}

        {/* Texto según estado */}
        {downloadState === 'loading'
          ? 'Generando ZIP...'
          : downloadState === 'success'
          ? '¡Descargado con éxito!'
          : 'Descargar Proyecto (.zip)'}

        {downloadState === 'idle' && (
          <Package className="h-4 w-4 opacity-70" />
        )}
      </button>

      {/* Contenido del ZIP */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          docker-compose.yml
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          README.md
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          .env.example
        </span>
      </div>
    </div>
  )
}
