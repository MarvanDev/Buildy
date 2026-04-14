// ============================================================
//  ArchitectureDiagram — Visual service topology using React Flow
//  Renders a reactive diagram driven by WizardState.
//  SRP: this module only builds the node/edge graph; it does
//  NOT touch Docker generation or any other service layer.
// ============================================================

import { useMemo, memo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react'
// ¡AQUÍ ESTABA EL ERROR 1! Faltaba el /dist/style.css
import '@xyflow/react/dist/style.css' 
import type { WizardState } from '../../types/wizard.types'

// ── Props ────────────────────────────────────────────────
interface ArchitectureDiagramProps {
  state: WizardState
  projectName?: string // <-- CAMILO TS01
}

// ── Node data shape ──────────────────────────────────────
interface ServiceNodeData {
  label: string
  sublabel: string
  icon: string
  accentColor: string   // CSS color string
  bgGradient: string    // tailwind-like gradient for the card
  isMain?: boolean
  [key: string]: unknown
}

// ── Custom Node component ─────────────────────────────────
function ServiceNode({ data }: { data: ServiceNodeData }) {
  return (
    <div
      className="relative group"
      style={{ minWidth: 140 }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: data.accentColor,
          border: `2px solid ${data.accentColor}`,
          width: 10,
          height: 10,
        }}
      />

      {/* Card */}
      <div
        style={{
          background: 'hsl(0 0% 8%)',
          border: `1.5px solid ${data.isMain ? data.accentColor : 'hsl(0 0% 16%)'}`,
          boxShadow: data.isMain
            ? `0 0 18px ${data.accentColor}40, 0 4px 16px rgba(0,0,0,0.5)`
            : '0 4px 16px rgba(0,0,0,0.4)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Icon ring */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${data.accentColor}18`,
            border: `1px solid ${data.accentColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {data.icon}
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'hsl(0 0% 93%)', fontWeight: 600, fontSize: 12, margin: 0 }}>
            {data.label}
          </p>
          {data.sublabel && (
            <p style={{ color: 'hsl(0 0% 50%)', fontSize: 10, marginTop: 2, fontFamily: 'monospace' }}>
              {data.sublabel}
            </p>
          )}
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: data.accentColor,
          border: `2px solid ${data.accentColor}`,
          width: 10,
          height: 10,
        }}
      />
    </div>
  )
}

// ── Custom node types registry ────────────────────────────
const nodeTypes: NodeTypes = {
  service: ServiceNode as NodeTypes['service'],
}

// ── Color palette per service kind ───────────────────────
const SERVICE_COLORS: Record<string, string> = {
  nodejs: 'hsl(142 71% 45%)',
  python: 'hsl(207 90% 54%)',
  php: 'hsl(262 83% 65%)',
  java: 'hsl(25 95% 53%)',
  go: 'hsl(185 85% 47%)',
  postgresql: 'hsl(207 90% 54%)',
  mysql: 'hsl(38 92% 50%)',
  mongodb: 'hsl(142 71% 45%)',
  pgadmin: 'hsl(207 70% 60%)',
  adminer: 'hsl(38 80% 55%)',
  cadvisor: 'hsl(0 72% 51%)',
  internet: 'hsl(0 0% 45%)',
}

const SERVICE_ICONS: Record<string, string> = {
  nodejs: '🟢', python: '🐍', php: '🐘', java: '☕', go: '🐹',
  postgresql: '🐘', mysql: '🐬', mongodb: '🍃',
  pgadmin: '🔍', adminer: '🔎', cadvisor: '📡',
  internet: '🌐',
}

// ── Node/edge builder ─────────────────────────────────────
function buildDiagramData(state: WizardState, projectName: string = 'App'): {
  nodes: Node[]
  edges: Edge[]
} {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const langId = state.language ?? 'nodejs'
  const langColor = SERVICE_COLORS[langId] ?? 'hsl(185 85% 47%)'

  // ── Internet node (entry point) ── 
  // ¡AQUÍ ESTABA EL ERROR 2! Lo habías borrado.
  nodes.push({
    id: 'internet',
    type: 'service',
    position: { x: 0, y: 120 },
    data: {
      label: 'Internet',
      sublabel: state.publicAccess ? '0.0.0.0' : '127.0.0.1',
      icon: SERVICE_ICONS.internet,
      accentColor: SERVICE_COLORS.internet,
    } as ServiceNodeData,
  })

  // ── App node (main) ──
  nodes.push({
    id: 'app',
    type: 'service',
    position: { x: 240, y: 120 },
    data: {
      label: projectName, // <-- CAMILO TS01: Aquí inyectamos el nombre
      sublabel: `:${state.internalPort}`,
      icon: SERVICE_ICONS[langId] ?? '📦',
      accentColor: langColor,
      isMain: true,
    } as ServiceNodeData,
  })

  // Internet → App
  edges.push({
    id: 'e-internet-app',
    source: 'internet',
    target: 'app',
    animated: true,
    style: { stroke: SERVICE_COLORS.internet, strokeWidth: 1.5, strokeDasharray: '5,4' },
    label: `port ${state.internalPort}`,
    labelStyle: { fill: 'hsl(0 0% 50%)', fontSize: 10 },
    labelBgStyle: { fill: 'hsl(0 0% 8%)', fillOpacity: 0.8 },
  })

  // ── Database node ──
  if (state.database.choice !== 'none') {
    const dbId = state.database.choice
    const dbColor = SERVICE_COLORS[dbId] ?? 'hsl(185 85% 47%)'
    const dbPorts: Record<string, string> = {
      postgresql: ':5432', mysql: ':3306', mongodb: ':27017',
    }

    nodes.push({
      id: 'database',
      type: 'service',
      position: { x: 480, y: 40 },
      data: {
        label: state.database.choice.charAt(0).toUpperCase() + state.database.choice.slice(1),
        sublabel: `${state.database.name}${dbPorts[dbId] ?? ''}`,
        icon: SERVICE_ICONS[dbId] ?? '🗄️',
        accentColor: dbColor,
      } as ServiceNodeData,
    })

    edges.push({
      id: 'e-app-db',
      source: 'app',
      target: 'database',
      animated: true,
      style: { stroke: dbColor, strokeWidth: 1.5 },
      label: 'DB connection',
      labelStyle: { fill: 'hsl(0 0% 50%)', fontSize: 10 },
      labelBgStyle: { fill: 'hsl(0 0% 8%)', fillOpacity: 0.8 },
    })

    // ── pgAdmin / Adminer (databases preset) ──
    if (state.subjectPreset === 'databases') {
      const guiId = state.database.choice === 'postgresql' ? 'pgadmin' : 'adminer'
      const guiPort = guiId === 'pgadmin' ? ':5050' : ':8080'
      const guiColor = SERVICE_COLORS[guiId]

      nodes.push({
        id: 'db-gui',
        type: 'service',
        position: { x: 480, y: 220 },
        data: {
          label: guiId === 'pgadmin' ? 'pgAdmin 4' : 'Adminer',
          sublabel: guiPort,
          icon: SERVICE_ICONS[guiId],
          accentColor: guiColor,
        } as ServiceNodeData,
      })

      edges.push({
        id: 'e-gui-db',
        source: 'db-gui',
        target: 'database',
        style: { stroke: guiColor, strokeWidth: 1.5, strokeDasharray: '4,3' },
        label: 'GUI',
        labelStyle: { fill: 'hsl(0 0% 50%)', fontSize: 10 },
        labelBgStyle: { fill: 'hsl(0 0% 8%)', fillOpacity: 0.8 },
      })

      // Internet → DB GUI
      edges.push({
        id: 'e-internet-gui',
        source: 'internet',
        target: 'db-gui',
        style: { stroke: SERVICE_COLORS.internet, strokeWidth: 1, strokeDasharray: '5,4' },
      })
    }
  }

  // ── cAdvisor node (networks preset) ──
  if (state.subjectPreset === 'networks') {
    const cadColor = SERVICE_COLORS.cadvisor
    nodes.push({
      id: 'cadvisor',
      type: 'service',
      position: { x: 480, y: state.database.choice !== 'none' ? 340 : 220 },
      data: {
        label: 'cAdvisor',
        sublabel: ':9090',
        icon: SERVICE_ICONS.cadvisor,
        accentColor: cadColor,
      } as ServiceNodeData,
    })

    edges.push({
      id: 'e-app-cadvisor',
      source: 'app',
      target: 'cadvisor',
      style: { stroke: cadColor, strokeWidth: 1.5, strokeDasharray: '4,3' },
      label: 'monitoring',
      labelStyle: { fill: 'hsl(0 0% 50%)', fontSize: 10 },
      labelBgStyle: { fill: 'hsl(0 0% 8%)', fillOpacity: 0.8 },
    })

    edges.push({
      id: 'e-internet-cadvisor',
      source: 'internet',
      target: 'cadvisor',
      style: { stroke: SERVICE_COLORS.internet, strokeWidth: 1, strokeDasharray: '5,4' },
    })
  }

  return { nodes, edges }
}

// ── Diagram component ─────────────────────────────────────
export const ArchitectureDiagram = memo(({ state, projectName = 'App' }: ArchitectureDiagramProps) => {
  const { nodes, edges } = useMemo(() => buildDiagramData(state, projectName), [state, projectName])

  return (
    <div
      style={{
        width: '100%',
        height: 340,
        background: 'hsl(0 0% 4%)',
        borderRadius: 12,
        border: '1px solid hsl(0 0% 14%)',
        overflow: 'hidden',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
        minZoom={0.5}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'hsl(0 0% 4%)' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(0 0% 14%)"
        />
        <Controls
          style={{
            background: 'hsl(0 0% 8%)',
            border: '1px solid hsl(0 0% 14%)',
            borderRadius: 8,
          }}
        />
      </ReactFlow>
    </div>
  )
})