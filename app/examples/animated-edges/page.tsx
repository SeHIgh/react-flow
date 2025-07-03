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
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "데이터 소스" },
    position: { x: 250, y: 5 },
    className: "bg-blue-100 border-blue-300",
  },
  {
    id: "2",
    data: { label: "전처리" },
    position: { x: 100, y: 100 },
    className: "bg-green-100 border-green-300",
  },
  {
    id: "3",
    data: { label: "변환" },
    position: { x: 400, y: 100 },
    className: "bg-yellow-100 border-yellow-300",
  },
  {
    id: "4",
    data: { label: "필터링" },
    position: { x: 100, y: 200 },
    className: "bg-purple-100 border-purple-300",
  },
  {
    id: "5",
    data: { label: "집계" },
    position: { x: 400, y: 200 },
    className: "bg-pink-100 border-pink-300",
  },
  {
    id: "6",
    type: "output",
    data: { label: "결과" },
    position: { x: 250, y: 300 },
    className: "bg-red-100 border-red-300",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#3b82f6" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
    },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#10b981" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#10b981",
    },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    style: { stroke: "#8b5cf6", strokeDasharray: "5,5" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#8b5cf6",
    },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
    style: { stroke: "#ec4899", strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#ec4899",
    },
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
    animated: true,
    style: { stroke: "#f59e0b" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#f59e0b",
    },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
    style: { stroke: "#ef4444" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#ef4444",
    },
  },
];

export default function AnimatedEdgesPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
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
            <h1 className="text-2xl font-bold text-gray-900">
              애니메이션 엣지
            </h1>
            <p className="text-gray-600">
              다양한 애니메이션과 스타일이 적용된 엣지 예제입니다.
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
          <Background variant={BackgroundVariant.Cross} gap={20} size={1} />
        </ReactFlow>
      </div>

      <footer className="bg-white border-t p-4">
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span>기본 애니메이션</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-0.5 bg-purple-500 border-dashed mr-2"
              style={{ borderTop: "2px dashed" }}
            ></div>
            <span>점선 애니메이션</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-pink-500 mr-2"></div>
            <span>두꺼운 라인</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
