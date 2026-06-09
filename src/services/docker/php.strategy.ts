import type { WizardState, DockerComposeConfig } from '../../types/wizard.types'
import type { DockerGeneratorStrategy } from './strategy.interface'
import { buildImageName, buildPortBinding, buildAppVolumes, assembleCompose } from './compose.builder'

export class PhpDockerStrategy implements DockerGeneratorStrategy {
  generate(state: WizardState): DockerComposeConfig {
    const appService = { 
      image: buildImageName('php', state.version), 
      container_name: 'app', 
      restart: 'unless-stopped', 
      ports: [buildPortBinding(state.internalPort, state.publicAccess)], 
      volumes: buildAppVolumes(state, '/var/www/html'), 
      environment: { APACHE_DOCUMENT_ROOT: '/var/www/html/public' }, 
      networks: ['app-network'] 
    }
    return assembleCompose(state, appService)
  }
}