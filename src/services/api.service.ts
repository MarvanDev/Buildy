// ============================================================
//  Buildy — Servicio de API de Docker Hub
//  Obtiene etiquetas de imagen reales desde Docker Hub.
//  Recurre a constantes locales en caso de cualquier fallo.
//  SRP: este módulo es ÚNICAMENTE responsable de obtener versiones.
// ============================================================

import type { LanguageId, TechVersion, ApiVersionResult } from '../types/wizard.types'
import { TECHNOLOGIES } from '../constants/technologies'

// ── Identificadores de imagen de Docker Hub por lenguaje ─────
const DOCKER_IMAGE_MAP: Record<LanguageId, string> = {
  nodejs: 'node',
  python: 'python',
  php: 'php',
  java: 'openjdk',
  go: 'golang',
}

// ── Patrones de etiquetas que indican versiones estables ────
/**
 * Devuelve true si una etiqueta de Docker Hub representa una imagen estable y usable.
 * Excluye: rc, alpha, beta, windowsservercore, nanoserver, preview, etc.
 */
function isStableTag(tag: string): boolean {
  const unstablePatterns = [
    /rc/i, /beta/i, /alpha/i, /preview/i,
    /windowsservercore/i, /nanoserver/i,
    /onbuild/i, /slim-buster/i, /stretch/i, /jessie/i,
  ]
  return !unstablePatterns.some((pattern) => pattern.test(tag))
}

/**
 * Filtro por lenguaje: selecciona solo etiquetas que sean identificadores de versión significativos.
 * Elimina "latest", "lts", etiquetas de un solo dígito, etc.
 */
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

/** Convierte una etiqueta cruda de Docker Hub en un objeto TechVersion */
function toTechVersion(tag: string, recommended = false): TechVersion {
  return { label: tag, value: tag, recommended, live: true }
}

// ── Estructura de la respuesta de la API de Docker Hub ──────
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

/**
 * Obtiene las primeras N páginas de etiquetas para una imagen de librería de Docker Hub determinada.
 * API de Docker Hub: GET /v2/repositories/library/{image}/tags?page_size=100
 */
async function fetchDockerHubTags(
  imageName: string,
  maxTags = 300,
): Promise<DockerHubTag[]> {
  // Ahora apuntamos a nuestro propio servidor (Vite)
  // Vite recibirá esto y lo reenviará a hub.docker.com
  const url = `/docker-api/v2/repositories/library/${imageName}/tags?page_size=${maxTags}&ordering=last_updated`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Error en el proxy: ${response.status}`);
  }

  const data: DockerHubTagsResponse = await response.json();
  return data.results || [];
}

/**
 * Obtiene y filtra versiones estables para un solo lenguaje desde Docker Hub.
 * Devuelve el respaldo local si la llamada a la API falla por cualquier motivo.
 */
export async function getLatestVersions(
  techId: LanguageId,
): Promise<ApiVersionResult> {
  const imageName = DOCKER_IMAGE_MAP[techId]
  const localTech = TECHNOLOGIES.find((t) => t.id === techId)
  const fallbackVersions: TechVersion[] = localTech?.versions ?? []

  try {
    const rawTags = await fetchDockerHubTags(imageName)
    const filter = buildVersionFilter(techId)

    const filtered = rawTags
      .map((t) => t.name)
      .filter(filter)
      // Eliminar duplicados
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      // Orden descendente (la versión más nueva primero según numeración)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      // Tomar máximo 8 versiones para mantener la UI limpia
      .slice(0, 8)

    if (filtered.length === 0) {
      return { techId, versions: fallbackVersions, source: 'fallback' }
    }

    // Marcar la primera (más nueva) versión como recomendada
    const versions = filtered.map((tag, i) => toTechVersion(tag, i === 0))
    return { techId, versions, source: 'api' }
  } catch {
    // Fallo silencioso (fallback) — el usuario no debería ver errores por esto
    return { techId, versions: fallbackVersions, source: 'fallback' }
  }
}

/**
 * Obtiene versiones en vivo para TODOS los lenguajes soportados de forma concurrente.
 * Cada lenguaje se resuelve de forma independiente para que un fallo no bloquee a los demás.
 */
export async function getAllLatestVersions(): Promise<ApiVersionResult[]> {
  const techIds: LanguageId[] = ['nodejs', 'python', 'php', 'java', 'go']
  return Promise.all(techIds.map(getLatestVersions))
}