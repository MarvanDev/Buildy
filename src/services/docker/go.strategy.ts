import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { buildImageName, buildPortBinding, buildAppVolumes, assembleCompose } from './compose.builder'

export class GoDockerStrategy implements DockerGeneratorStrategy {
  generate(state: WizardState): DockerComposeConfig {
    const appService = {
      image: buildImageName('go', state.version),
      container_name: 'app',
      working_dir: '/app',
      restart: 'unless-stopped',
      command: state.startCommand || 'go run ./cmd/main.go',
      ports: [buildPortBinding(state.internalPort, state.publicAccess)],
      volumes: buildAppVolumes(state),
      environment: { GO_ENV: 'development', PORT: String(state.internalPort), CGO_ENABLED: '0' },
      networks: ['app-network'],
    }
    return assembleCompose(state, appService)
  }
}
