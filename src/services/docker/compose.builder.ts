import type { WizardState, DockerService, DockerComposeConfig, DatabaseConfig } from '../../types/wizard.types'
import { ADMINER_SERVICE, PGADMIN_SERVICE, CADVISOR_SERVICE } from '../../constants/subjects'

const BASE: Record<string,string> = {
   nodejs:'node', python:'python', php:'php', java:'openjdk', go:'golang' 
  }

export function buildPortBinding(port: number, pub: boolean) {
   return `${pub?'0.0.0.0':'127.0.0.1'}:${port}:${port}`
  }

export function buildImageName(lang: string, ver: string) {
   return `${BASE[lang]}:${ver}` 
  }

export function buildAppVolumes(state: WizardState, basePath: string = '/app') { 
  const v = [`./:${basePath}`]; 
  if (state.persistence.enabled && state.persistence.localPath) v.push(`./uploads:${state.persistence.localPath}`); 
  return v; 
}

export function buildDatabaseService(db: DatabaseConfig): DockerService|null {
  switch(db.choice) {
    case 'postgresql': return { image:'postgres:16-alpine', container_name:`${db.name}_db`, restart:'unless-stopped', environment:{POSTGRES_DB:db.name,POSTGRES_USER:db.user,POSTGRES_PASSWORD:db.password}, volumes:[`${db.name}_data:/var/lib/postgresql/data`], networks:['app-network'], ports:['5432:5432'] }
    case 'mysql': return { image:'mysql:8.0', container_name:`${db.name}_db`, restart:'unless-stopped', environment:{MYSQL_DATABASE:db.name,MYSQL_USER:db.user,MYSQL_PASSWORD:db.password,MYSQL_ROOT_PASSWORD:db.password}, volumes:[`${db.name}_data:/var/lib/mysql`], networks:['app-network'], ports:['3306:3306'] }
    case 'mongodb': return { image:'mongo:7.0', container_name:`${db.name}_db`, restart:'unless-stopped', environment:{MONGO_INITDB_DATABASE:db.name,MONGO_INITDB_ROOT_USERNAME:db.user,MONGO_INITDB_ROOT_PASSWORD:db.password}, volumes:[`${db.name}_data:/data/db`], networks:['app-network'], ports:['27017:27017'] }
    default: return null
  }
}

export function buildSubjectExtras(state: WizardState): Record<string,DockerService> {
  const e: Record<string,DockerService>={}
  if(state.subjectPreset==='databases'&&state.database.choice!=='none') { if(state.database.choice==='postgresql') e['pgadmin']=PGADMIN_SERVICE as DockerService; else e['adminer']=ADMINER_SERVICE as DockerService }
  if(state.subjectPreset==='networks') e['cadvisor']=CADVISOR_SERVICE as DockerService
  return e
}

export function assembleCompose(state: WizardState, appService: DockerService): DockerComposeConfig {
  const services: Record<string,DockerService>={app:appService}
  const vols: Record<string,object>={}
  const dbSvc=buildDatabaseService(state.database)
  if(dbSvc&&state.database.choice!=='none') { const k=`${state.database.choice}_db`; services[k]=dbSvc; vols[`${state.database.name}_data`]={}; appService.depends_on=[k] }
  Object.assign(services,buildSubjectExtras(state))
  return { version:'3.8', services, networks:{'app-network':{driver:'bridge'}}, ...(Object.keys(vols).length>0?{volumes:vols as Record<string,{driver?:string}>}:{}) }
}
