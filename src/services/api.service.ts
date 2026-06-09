import type { LanguageId, TechVersion, ApiVersionResult } from '../types/wizard.types'
import { TECHNOLOGIES } from '../constants/technologies'

const DOCKER_IMAGE_MAP: Record<LanguageId, string> = {
  nodejs: 'node',
  python: 'python',
  php: 'php',
  java: 'openjdk',
  go: 'golang',
}

function isStableTag(tag: string): boolean {
  const unstablePatterns = [
    /rc/i, /beta/i, /alpha/i, /preview/i,
    /windowsservercore/i, /nanoserver/i,
    /onbuild/i, /slim-buster/i, /stretch/i, /jessie/i,
  ]
  return !unstablePatterns.some((pattern) => pattern.test(tag))
}

function buildVersionFilter(techId: LanguageId): (tag: string) => boolean {
  const filters: Record<LanguageId, (tag: string) => boolean> = {
    nodejs: (t) =>
      /^\d{2,}-alpine/.test(t) && isStableTag(t),
    python: (t) =>
      /^3\.\d{1,2}-(slim)$/.test(t) && isStableTag(t),
    php: (t) =>
      /^8\.\d-(apache|fpm|cli)$/.test(t) || /^7\.\d-(apache|fpm|cli)$/.test(t),
    java: (t) =>
      /^(\d{1,2})-(jdk|jre)-(slim|alpine)$/.test(t) && isStableTag(t),
    go: (t) =>
      /^1\.\d{2}-alpine$/.test(t) && isStableTag(t),
  }
  return filters[techId]
}

function toTechVersion(tag: string, recommended = false): TechVersion {
  return { label: tag, value: tag, recommended, live: true }
}

interface DockerHubTag {
  name: string
  tag_status: string
  last_updated: string
}

interface DockerHubTagsResponse {
  results: DockerHubTag[]
  next: string | null
  count: number
}

async function fetchDockerHubTags(
  imageName: string,
  maxTags = 300,
): Promise<DockerHubTag[]> {
  
  
  const dockerUrl = `https://hub.docker.com/v2/repositories/library/${imageName}/tags?page_size=${maxTags}&ordering=last_updated`;
  
  
  const url = `https://api.codetabs.com/v1/proxy?quest=${dockerUrl}`;

  const response = await fetch(url, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`Error en el proxy: ${response.status}`);
  }

  const data: DockerHubTagsResponse = await response.json();
  return data.results || [];
}

export async function getLatestVersions(
  techId: LanguageId,
): Promise<ApiVersionResult> {
  const imageName = DOCKER_IMAGE_MAP[techId]
  const localTech = TECHNOLOGIES.find((t) => t.id === techId)
  const fallbackVersions: TechVersion[] = localTech?.versions ?? []

  try {
    const rawTags = await fetchDockerHubTags(imageName)
    const filter = buildVersionFilter(techId)

    
    const fallbackValues = new Set(fallbackVersions.map(v => v.value))

    
    const liveTags = rawTags
      .map((t) => t.name)
      .filter(filter)
      .filter((tag) => !fallbackValues.has(tag)) 
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .slice(0, 5) 

    if (liveTags.length === 0) {
      return { techId, versions: fallbackVersions, source: 'fallback' }
    }
    const liveVersions: TechVersion[] = liveTags.map((tag) => ({
      label: `${tag} (Live 🔥)`,
      value: tag,
      recommended: false,
      live: true
    }))

    
    const combinedVersions = [...fallbackVersions, ...liveVersions]

    return { techId, versions: combinedVersions, source: 'api' }
  } catch {
    return { techId, versions: fallbackVersions, source: 'fallback' }
  }
}

export async function getAllLatestVersions(): Promise<ApiVersionResult[]> {
  const techIds: LanguageId[] = ['nodejs', 'python', 'php', 'java', 'go'];
  const results: ApiVersionResult[] = [];

  
  
  for (const id of techIds) {
    results.push(await getLatestVersions(id));
  }

  return results;
}