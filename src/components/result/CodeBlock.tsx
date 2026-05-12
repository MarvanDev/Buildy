/**
 * CodeBlock — Visualizador de código con syntax highlighting simulado.
 * Diferencia entre YAML y Markdown para aplicar tokens de color correctos.
 */
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CodeBlockProps {
  code: string
  language: 'yaml' | 'markdown'
  filename: string
}

/**
 * Aplica tokens de color YAML mediante spans HTML.
 * Mantenemos esto en el frontend para evitar dependencias pesadas de highlighting.
 */
function highlightYaml(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      // Comentarios
      if (line.trimStart().startsWith('#')) {
        return `<span class="yaml-comment">${escHtml(line)}</span>`
      }

      // Claves YAML (key: value)
      const keyMatch = line.match(/^(\s*)([\w-]+)(:)(\s*.*)$/)
      if (keyMatch) {
        const [, indent, key, colon, rest] = keyMatch
        const coloredRest = colorizeYamlValue(rest)
        return `${escHtml(indent)}<span class="yaml-key">${escHtml(key)}</span><span class="text-muted-foreground">${escHtml(colon)}</span>${coloredRest}`
      }

      // Lista items
      const listMatch = line.match(/^(\s*)(- )(.*)$/)
      if (listMatch) {
        const [, indent, dash, value] = listMatch
        return `${escHtml(indent)}<span class="text-muted-foreground">${escHtml(dash)}</span><span class="yaml-string">${escHtml(value)}</span>`
      }

      return escHtml(line)
    })
    .join('\n')
}

function colorizeYamlValue(value: string): string {
  const trimmed = value.trim()
  if (trimmed === '') return ''

  // Números
  if (/^\s+\d+$/.test(value)) {
    return `<span class="yaml-number">${escHtml(value)}</span>`
  }
  // Booleanos
  if (/^\s+(true|false|yes|no)$/i.test(value)) {
    return `<span class="yaml-number">${escHtml(value)}</span>`
  }
  // Strings con comillas
  if (/^\s+".*"$/.test(value) || /^\s+'.*'$/.test(value)) {
    return `<span class="yaml-string">${escHtml(value)}</span>`
  }
  // Valores generales
  return `<span class="yaml-value">${escHtml(value)}</span>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightMarkdown(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      if (line.startsWith('# '))
        return `<span style="color:hsl(185 85% 55%);font-weight:700">${escHtml(line)}</span>`
      if (line.startsWith('## '))
        return `<span style="color:hsl(185 70% 50%);font-weight:600">${escHtml(line)}</span>`
      if (line.startsWith('### '))
        return `<span style="color:hsl(185 60% 45%);font-weight:600">${escHtml(line)}</span>`
      if (line.startsWith('```'))
        return `<span class="yaml-comment">${escHtml(line)}</span>`
      if (line.startsWith('> '))
        return `<span style="color:hsl(38 92% 65%)">${escHtml(line)}</span>`
      if (line.startsWith('| '))
        return `<span style="color:hsl(0 0% 65%)">${escHtml(line)}</span>`
      if (line.startsWith('- ') || line.startsWith('* '))
        return `<span class="yaml-value">${escHtml(line)}</span>`
      return escHtml(line)
    })
    .join('\n')
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted =
    language === 'yaml' ? highlightYaml(code) : highlightMarkdown(code)

  const lineCount = code.split('\n').length

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Barra superior del bloque de código */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80">
        <div className="flex items-center gap-3">
          {/* Dots decorativos estilo macOS */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/50" />
            <div className="h-3 w-3 rounded-full bg-amber-500/50" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {filename}
          </span>
          <span className="text-xs text-muted-foreground/50">
            {lineCount} líneas
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md',
            'transition-all duration-200 active:scale-95',
            copied
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Contenido del código */}
      <div className="flex overflow-x-auto bg-[hsl(0_0%_5%)]">
        {/* Números de línea */}
        <div className="select-none shrink-0 border-r border-border/30 bg-[hsl(0_0%_4%)] px-3 py-4 text-right">
          {code.split('\n').map((_, i) => (
            <div
              key={i}
              className="code-block leading-6 text-muted-foreground/30 text-xs"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Código */}
        <pre
          className="flex-1 overflow-x-auto p-4 code-block text-xs leading-6"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  )
}
