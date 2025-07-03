"use client";

import React, { useCallback, useState, DragEvent } from "react";
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
  Panel,
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

// 워크플로우 노드 컴포넌트
function WorkflowNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as { label: string; type: string; icon: string };

  const getNodeStyle = (type: string) => {
    switch (type) {
      case "start":
        return "bg-green-100 border-green-500 text-green-800";
      case "process":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "decision":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "end":
        return "bg-red-100 border-red-500 text-red-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-lg border-2 ${getNodeStyle(
        nodeData.type
      )} min-w-[120px]`}
    >
      <div className="flex items-center">
        <span className="text-lg mr-2">{nodeData.icon}</span>
        <div className="text-sm font-medium">{nodeData.label}</div>
      </div>

      {nodeData.type !== "start" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-gray-400"
        />
      )}
      {nodeData.type !== "end" && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!bg-gray-400"
        />
      )}
    </div>
  );
}

const nodeTypes = {
  workflow: WorkflowNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "workflow",
    data: { label: "워크플로우 시작", type: "start", icon: "🚀" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "workflow",
    data: { label: "데이터 수집", type: "process", icon: "📊" },
    position: { x: 250, y: 125 },
  },
  {
    id: "3",
    type: "workflow",
    data: { label: "유효성 검증", type: "decision", icon: "❓" },
    position: { x: 250, y: 225 },
  },
  {
    id: "4",
    type: "workflow",
    data: { label: "데이터 처리", type: "process", icon: "⚙️" },
    position: { x: 100, y: 325 },
  },
  {
    id: "5",
    type: "workflow",
    data: { label: "오류 처리", type: "process", icon: "⚠️" },
    position: { x: 400, y: 325 },
  },
  {
    id: "6",
    type: "workflow",
    data: { label: "완료", type: "end", icon: "✅" },
    position: { x: 250, y: 425 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4", label: "성공" },
  { id: "e3-5", source: "3", target: "5", label: "실패" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-6", source: "5", target: "6" },
];

const nodeTemplates = [
  { type: "start", label: "시작", icon: "🚀" },
  { type: "process", label: "처리", icon: "⚙️" },
  { type: "decision", label: "결정", icon: "❓" },
  { type: "end", label: "종료", icon: "✅" },
];

export default function WorkflowEditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTemplate, setSelectedTemplate] = useState(nodeTemplates[0]);
  const [nodeIdCounter, setNodeIdCounter] = useState(7);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (
    event: DragEvent,
    template: (typeof nodeTemplates)[0]
  ) => {
    setSelectedTemplate(template);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element)
        .closest(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 30,
      };

      const newNode: Node = {
        id: `${nodeIdCounter}`,
        type: "workflow",
        position,
        data: {
          label: `새 ${selectedTemplate.label}`,
          type: selectedTemplate.type,
          icon: selectedTemplate.icon,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeIdCounter((counter) => counter + 1);
    },
    [nodeIdCounter, selectedTemplate, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setNodeIdCounter(1);
  };

  const addSampleWorkflow = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNodeIdCounter(7);
  };

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
              워크플로우 에디터
            </h1>
            <p className="text-gray-600">
              드래그 앤 드롭으로 워크플로우를 만들어보세요.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r p-4">
          <h3 className="font-semibold mb-4">노드 팔레트</h3>

          <div className="space-y-2 mb-6">
            {nodeTemplates.map((template, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => onDragStart(e, template)}
              >
                <span className="text-lg mr-3">{template.icon}</span>
                <span className="text-sm font-medium">{template.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={addSampleWorkflow}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              샘플 워크플로우
            </button>
            <button
              onClick={clearWorkflow}
              className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              전체 삭제
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">사용법:</p>
            <ul className="space-y-1">
              <li>• 노드를 드래그해서 캔버스에 놓기</li>
              <li>• 노드 연결점을 드래그해서 연결</li>
              <li>• 노드를 더블클릭해서 삭제</li>
            </ul>
          </div>
        </div>

        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            className="bg-gray-50"
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />

            <Panel
              position="top-right"
              className="bg-white p-3 rounded-lg shadow border"
            >
              <div className="text-sm">
                <div className="font-semibold mb-1">워크플로우 통계</div>
                <div>노드: {nodes.length}개</div>
                <div>연결: {edges.length}개</div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
