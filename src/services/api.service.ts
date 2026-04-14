// ============================================================
//  Buildy — Docker Hub API Service
//  Fetches real image tags from Docker Hub.
//  Falls back to local constants on any failure.
//  SRP: this module is ONLY responsible for fetching versions.
// ============================================================

import type { LanguageId, TechVersion, ApiVersionResult } from '../types/wizard.types'
import { TECHNOLOGIES } from '../constants/technologies'

// ── Docker Hub image identifiers per language ─────────────
const DOCKER_IMAGE_MAP: Record<LanguageId, string> = {
  nodejs: 'node',
  python: 'python',
  php: 'php',
  java: 'openjdk',
  go: 'golang',
}

// ── Tag patterns that indicate stable releases ────────────
/**
 * Returns true if a Docker Hub tag represents a stable, usable image.
 * Excludes: rc, alpha, beta, windowsservercore, nanoserver, preview, etc.
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
 * Per-language filter: selects only tags that are meaningful version identifiers.
 * Eliminates "latest", "lts", single-digit tags, etc.
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

/** Converts a raw Docker Hub tag into a TechVersion object */
function toTechVersion(tag: string, recommended = false): TechVersion {
  return { label: tag, value: tag, recommended, live: true }
}

// ── Docker Hub API response shape ────────────────────────
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
 * Fetches the first N pages of tags for a given Docker Hub library image.
 * Docker Hub API: GET /v2/repositories/library/{image}/tags?page_size=100
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
 * Fetches and filters stable versions for a single language from Docker Hub.
 * Returns the local fallback if the API call fails for any reason.
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
      // Remove duplicates
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      // Sort descending (newest first based on version numbering)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      // Take at most 8 versions to keep the UI clean
      .slice(0, 8)

    if (filtered.length === 0) {
      return { techId, versions: fallbackVersions, source: 'fallback' }
    }

    // Mark the first (newest) version as recommended
    const versions = filtered.map((tag, i) => toTechVersion(tag, i === 0))
    return { techId, versions, source: 'api' }
  } catch {
    // Silently fall back — the user should not see errors for this
    return { techId, versions: fallbackVersions, source: 'fallback' }
  }
}

/**
 * Fetches live versions for ALL supported languages concurrently.
 * Each language resolves independently so one failure doesn't block others.
 */
export async function getAllLatestVersions(): Promise<ApiVersionResult[]> {
  const techIds: LanguageId[] = ['nodejs', 'python', 'php', 'java', 'go']
  return Promise.all(techIds.map(getLatestVersions))
}
