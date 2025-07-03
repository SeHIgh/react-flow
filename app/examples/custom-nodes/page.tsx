"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

// 커스텀 노드 컴포넌트
function CustomNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as { name: string; job: string; emoji: string };
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {nodeData.emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{nodeData.name}</div>
          <div className="text-gray-500">{nodeData.job}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

// 다이아몬드 모양 노드
function DiamondNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as { label: string };
  return (
    <div className="relative">
      <div className="w-24 h-24 bg-yellow-400 transform rotate-45 border-2 border-yellow-600 shadow-lg flex items-center justify-center">
        <div className="transform -rotate-45 text-center text-sm font-bold text-white">
          {nodeData.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-yellow-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-yellow-600"
      />
    </div>
  );
}

// 노드 타입 정의
const nodeTypes = {
  custom: CustomNode,
  diamond: DiamondNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    data: {
      name: "김철수",
      job: "팀장",
      emoji: "👨‍💼",
    },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "custom",
    data: {
      name: "이영희",
      job: "개발자",
      emoji: "👩‍💻",
    },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "diamond",
    data: { label: "검토" },
    position: { x: 320, y: 125 },
  },
  {
    id: "4",
    type: "custom",
    data: {
      name: "박민수",
      job: "디자이너",
      emoji: "🎨",
    },
    position: { x: 500, y: 125 },
  },
  {
    id: "5",
    type: "custom",
    data: {
      name: "최혜진",
      job: "QA",
      emoji: "🔍",
    },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e3-5", source: "3", target: "5", label: "승인" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e4-5", source: "4", target: "5" },
];

export default function CustomNodesPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm mb-2 block"
            >
              ← 메인으로 돌아가기
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">커스텀 노드</h1>
            <p className="text-gray-600">
              다양한 스타일의 커스텀 노드를 사용한 조직도 예제입니다.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case "custom":
                  return "#3b82f6";
                case "diamond":
                  return "#eab308";
                default:
                  return "#6b7280";
              }
            }}
          />
          <Background variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </div>

      <footer className="bg-white border-t p-4">
        <p className="text-sm text-gray-600 text-center">
          커스텀 노드를 통해 다양한 형태와 스타일의 노드를 만들 수 있습니다.
        </p>
      </footer>
    </div>
  );
}
