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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "시작" },
    position: { x: 400, y: 50 },
  },
  {
    id: "2",
    data: { label: "처리 과정" },
    position: { x: 200, y: 250 },
  },
  {
    id: "3",
    data: { label: "결정" },
    position: { x: 600, y: 250 },
  },
  {
    id: "4",
    type: "output",
    data: { label: "완료" },
    position: { x: 400, y: 450 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

export default function BasicFlowPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">기본 플로우</h1>
            <p className="text-gray-600">
              기본적인 노드와 엣지를 사용한 간단한 플로우 차트입니다.
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
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <footer className="bg-white border-t p-4">
        <p className="text-sm text-gray-600 text-center">
          노드를 드래그하여 이동하거나, 핸들을 연결하여 새로운 엣지를
          만들어보세요.
        </p>
      </footer>
    </div>
  );
}
