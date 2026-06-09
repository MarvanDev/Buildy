import YAML from 'yaml'
import type { WizardState, LanguageId } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { NodeDockerStrategy } from './node.strategy'
import { PythonDockerStrategy } from './python.strategy'
import { PhpDockerStrategy } from './php.strategy'
import { JavaDockerStrategy } from './java.strategy'
import { GoDockerStrategy } from './go.strategy'

const strategies: Record<LanguageId, DockerGeneratorStrategy> = {
  nodejs: new NodeDockerStrategy(),
  python: new PythonDockerStrategy(),
  php: new PhpDockerStrategy(),
  java: new JavaDockerStrategy(),
  go: new GoDockerStrategy(),
}

export function generateDockerCompose(state: WizardState): string {
  if (!state.language) throw new Error('No se ha seleccionado un lenguaje.')
  
  const strategy = strategies[state.language]
  const config = strategy.generate(state)

  const header = [
    '# =============================================================',
    `# docker-compose.yml generado por Buildy`,
    `# Lenguaje: ${state.language} — Versión: ${state.version}`,
    `# Generado el: ${new Date().toLocaleDateString('es-ES')}`,
    '# =============================================================',
    '',
  ].join('\n')

  
  return header + '\n' + YAML.stringify(config)
}