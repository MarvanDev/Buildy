// Buildy — DockerGeneratorStrategy Interface (Open/Closed Principle)
import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'

export interface DockerGeneratorStrategy {
  generate(cfg: WizardState): DockerComposeConfig
}
