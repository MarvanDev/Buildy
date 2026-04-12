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
// INTEGRACIÓN: Importación esencial de estilos de la librería
import '@xyflow/react/dist/style.css' 
import type { WizardState } from '../../types/wizard.types'

//  Props interface (En TS01 solo manejamos el estado base)
interface ArchitectureDiagramProps {
  state: WizardState
}

//  Node data shape 
interface ServiceNodeData {
  label: string
  sublabel: string
  icon: string
  accentColor: string
  bgGradient: string
  isMain?: boolean
  [key: string]: unknown
}

// Custom Node component (Definición visual de la infraestructura)
function ServiceNode({ data }: { data: ServiceNodeData }) {
  return (
    <div className="relative group" style={{ minWidth: 140 }}>
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

const nodeTypes: NodeTypes = {
  service: ServiceNode as NodeTypes['service'],
}

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

// LÓGICA DE INTEGRACIÓN: Construcción base del grafo
function buildDiagramData(state: WizardState): {
  nodes: Node[]
  edges: Edge[]
} {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const langId = state.language ?? 'nodejs'
  const langColor = SERVICE_COLORS[langId] ?? 'hsl(185 85% 47%)'

  // Nodo Internet
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

  // Nodo App (Estático para TS01)
  nodes.push({
    id: 'app',
    type: 'service',
    position: { x: 240, y: 120 },
    data: {
      label: 'App', // <-- En TS01 lo dejamos fijo o base
      sublabel: `:${state.internalPort}`,
      icon: SERVICE_ICONS[langId] ?? '📦',
      accentColor: langColor,
      isMain: true,
    } as ServiceNodeData,
  })

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

  // (Aquí seguiría el resto del mapeo de DB y presets que ya tienes)
  // ...

  return { nodes, edges }
}

export const ArchitectureDiagram = memo(({ state }: ArchitectureDiagramProps) => {
  // En TS01, useMemo solo depende del state
  const { nodes, edges } = useMemo(() => buildDiagramData(state), [state])

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