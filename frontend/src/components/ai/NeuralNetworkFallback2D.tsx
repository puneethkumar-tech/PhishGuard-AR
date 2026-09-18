'use client';

import React, { useState } from 'react';
import {
  NeuralNodeData,
  NeuralConnectionData,
  NeuralLayerInfo,
  InferenceSimulationStage,
} from '@/types';

interface NeuralNetworkFallback2DProps {
  layers: NeuralLayerInfo[];
  nodes: NeuralNodeData[];
  connections: NeuralConnectionData[];
  selectedNode: NeuralNodeData | null;
  onSelectNode: (node: NeuralNodeData) => void;
  inferenceStage: InferenceSimulationStage;
  isSimulating: boolean;
}

export const NeuralNetworkFallback2D: React.FC<NeuralNetworkFallback2DProps> = ({
  layers,
  nodes,
  connections,
  selectedNode,
  onSelectNode,
  inferenceStage,
  isSimulating,
}) => {
  const [hoveredNode, setHoveredNode] = useState<NeuralNodeData | null>(null);

  // Group nodes by layerIndex
  const nodesByLayer: { [key: number]: NeuralNodeData[] } = {};
  nodes.forEach((node) => {
    if (!nodesByLayer[node.layerIndex]) {
      nodesByLayer[node.layerIndex] = [];
    }
    nodesByLayer[node.layerIndex].push(node);
  });

  const layerWidth = 110;
  const svgWidth = 850;
  const svgHeight = 400;

  // Calculate SVG (x, y) coordinates for each node
  const getNodeSvgPos = (node: NeuralNodeData) => {
    const layerIndex = node.layerIndex;
    const layerNodes = nodesByLayer[layerIndex] || [];
    const indexInLayer = layerNodes.findIndex((n) => n.id === node.id);
    const totalInLayer = layerNodes.length;

    const x = 70 + layerIndex * layerWidth;
    const spacing = svgHeight / (totalInLayer + 1);
    const y = spacing * (indexInLayer + 1);

    return { x, y };
  };

  return (
    <div className="relative overflow-x-auto rounded-xl border border-cyan-500/30 bg-slate-950 p-4 font-mono shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      {/* 2D Fallback Header Badge */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200 uppercase">
            2D Interactive Neural Network Diagram
          </span>
        </div>
        <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 uppercase">
          WebGL Fallback Mode
        </span>
      </div>

      <div className="min-w-[850px]">
        {/* Layer Header Titles */}
        <div className="grid grid-cols-7 gap-1 border-b border-cyan-500/20 pb-2 text-center text-[10px]">
          {layers.map((layer) => (
            <div key={layer.id} className="truncate px-1">
              <span className="font-bold text-slate-200">{layer.shortName}</span>
              <span className="block text-[9px] text-slate-400">L{layer.index}</span>
            </div>
          ))}
        </div>

        {/* Interactive SVG Diagram */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-[360px] w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connection Lines */}
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const fromPos = getNodeSvgPos(fromNode);
            const toPos = getNodeSvgPos(toNode);

            const isHighlighted =
              selectedNode?.id === fromNode.id || selectedNode?.id === toNode.id;

            return (
              <line
                key={conn.id}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={fromNode.color}
                strokeWidth={isHighlighted ? 2.5 : conn.weight > 0.7 ? 1.5 : 0.75}
                strokeOpacity={isHighlighted ? 0.9 : isSimulating ? 0.45 : 0.25}
                strokeDasharray={isSimulating ? '4 2' : undefined}
                className={isSimulating ? 'animate-pulse' : undefined}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = getNodeSvgPos(node);
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glow ring */}
                {(isSelected || isHovered || node.isHighlighted) && (
                  <circle
                    r={isSelected ? 18 : 14}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={2}
                    opacity={0.8}
                    className="animate-pulse"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={isSelected ? 10 : 8}
                  fill={isSelected ? '#ffffff' : node.color}
                  stroke="#020617"
                  strokeWidth={2}
                />

                {/* Node Label Text */}
                <text
                  y={isSelected ? -16 : -12}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize={8}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {node.name.length > 14 ? `${node.name.slice(0, 13)}…` : node.name}
                </text>

                {/* Activation Badge */}
                <text
                  y={18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={7}
                >
                  {Math.round(node.simulatedActivation * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-center text-[10px] text-slate-400">
        Click any node to open the inspector panel. All signals represent simulated conceptual architecture.
      </div>
    </div>
  );
};
