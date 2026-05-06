import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { buildImageName, buildPortBinding, buildAppVolumes, assembleCompose } from './compose.builder'

export class JavaDockerStrategy implements DockerGeneratorStrategy {
  generate(state: WizardState): DockerComposeConfig {
    const appService = { 
      image: buildImageName('java', state.version), 
      container_name: 'app', 
      working_dir: '/app', 
      restart: 'unless-stopped', 
      command: state.startCommand || 'java -jar app.jar', 
      ports: [buildPortBinding(state.internalPort, state.publicAccess)], 
      volumes: buildAppVolumes(state), // ¡Ahora usa el builder!
      environment: { JAVA_OPTS: '-Xms256m -Xmx512m', SERVER_PORT: String(state.internalPort) }, 
      networks: ['app-network'] 
    }
    return assembleCompose(state, appService)
  }
}