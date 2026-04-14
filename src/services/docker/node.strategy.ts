import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { buildImageName, buildPortBinding, buildAppVolumes, assembleCompose } from './compose.builder'

export class NodeDockerStrategy implements DockerGeneratorStrategy {
  generate(state: WizardState): DockerComposeConfig {
    const appService = {
      image: buildImageName('nodejs', state.version),
      container_name: 'app',
      working_dir: '/app',
      restart: 'unless-stopped',
      command: state.startCommand || 'npm start',
      ports: [buildPortBinding(state.internalPort, state.publicAccess)],
      volumes: buildAppVolumes(state),
      environment: { NODE_ENV: 'development', PORT: String(state.internalPort) },
      networks: ['app-network'],
    }
    return assembleCompose(state, appService)
  }
}
