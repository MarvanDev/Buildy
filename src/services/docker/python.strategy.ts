import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { buildImageName, buildPortBinding, buildAppVolumes, assembleCompose } from './compose.builder'

export class PythonDockerStrategy implements DockerGeneratorStrategy {
  generate(state: WizardState): DockerComposeConfig {
    const appService = {
      image: buildImageName('python', state.version),
      container_name: 'app',
      working_dir: '/app',
      restart: 'unless-stopped',
      command: state.startCommand || 'python app.py',
      ports: [buildPortBinding(state.internalPort, state.publicAccess)],
      volumes: buildAppVolumes(state),
      environment: { PYTHONDONTWRITEBYTECODE: '1', PYTHONUNBUFFERED: '1', PORT: String(state.internalPort) },
      networks: ['app-network'],
    }
    return assembleCompose(state, appService)
  }
}
