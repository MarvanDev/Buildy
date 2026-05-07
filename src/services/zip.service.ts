import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ProjectFiles {
  dockerCompose: string
  readme: string
}

export async function downloadProjectZip(files: ProjectFiles, projectName = 'buildy-project'): Promise<void> {
  const zip = new JSZip()
  zip.file('docker-compose.yml', files.dockerCompose)
  zip.file('README.md', files.readme)

  const envLines = ['# Variables de entorno — Renombra este archivo a .env', '']
  const envPattern = /^\s{4,}([A-Z][A-Z0-9_]+):\s/gm
  const seen = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = envPattern.exec(files.dockerCompose)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1])
      envLines.push(`${match[1]}=`)
    }
  }
  zip.file('.env.example', envLines.join('\n'))

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  saveAs(blob, `${projectName}.zip`)
}
