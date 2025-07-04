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
  NodeProps,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

// 데이터베이스 테이블 노드 컴포넌트
function TableNode({ data, isConnectable }: NodeProps) {
  const tableData = data as {
    tableName: string;
    fields: Array<{
      name: string;
      type: string;
      isPrimaryKey?: boolean;
      isForeignKey?: boolean;
    }>;
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg min-w-[200px]">
      <div className="bg-blue-600 text-white px-3 py-2 rounded-t-md">
        <div className="font-bold text-sm">{tableData.tableName}</div>
      </div>

      <div className="p-0">
        {tableData.fields.map((field, index) => (
          <div
            key={index}
            className={`px-3 py-1 border-b border-gray-200 last:border-b-0 text-xs ${
              field.isPrimaryKey
                ? "bg-yellow-50 font-bold"
                : field.isForeignKey
                ? "bg-green-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{field.name}</span>
              <span className="text-gray-500">{field.type}</span>
            </div>
            {field.isPrimaryKey && (
              <div className="text-yellow-600 text-xs">🔑 Primary Key</div>
            )}
            {field.isForeignKey && (
              <div className="text-green-600 text-xs">🔗 Foreign Key</div>
            )}
          </div>
        ))}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!bg-blue-500"
      />
    </div>
  );
}

const nodeTypes = {
  table: TableNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "table",
    data: {
      tableName: "users",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "username", type: "VARCHAR(50)" },
        { name: "email", type: "VARCHAR(100)" },
        { name: "password_hash", type: "VARCHAR(255)" },
        { name: "created_at", type: "DATETIME" },
        { name: "updated_at", type: "DATETIME" },
      ],
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "table",
    data: {
      tableName: "posts",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "user_id", type: "INT", isForeignKey: true },
        { name: "title", type: "VARCHAR(200)" },
        { name: "content", type: "TEXT" },
        { name: "status", type: "ENUM" },
        { name: "created_at", type: "DATETIME" },
        { name: "updated_at", type: "DATETIME" },
      ],
    },
    position: { x: 350, y: 100 },
  },
  {
    id: "3",
    type: "table",
    data: {
      tableName: "comments",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "post_id", type: "INT", isForeignKey: true },
        { name: "user_id", type: "INT", isForeignKey: true },
        { name: "content", type: "TEXT" },
        { name: "created_at", type: "DATETIME" },
        { name: "updated_at", type: "DATETIME" },
      ],
    },
    position: { x: 600, y: 100 },
  },
  {
    id: "4",
    type: "table",
    data: {
      tableName: "categories",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "name", type: "VARCHAR(100)" },
        { name: "description", type: "TEXT" },
        { name: "created_at", type: "DATETIME" },
      ],
    },
    position: { x: 100, y: 400 },
  },
  {
    id: "5",
    type: "table",
    data: {
      tableName: "post_categories",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "post_id", type: "INT", isForeignKey: true },
        { name: "category_id", type: "INT", isForeignKey: true },
        { name: "created_at", type: "DATETIME" },
      ],
    },
    position: { x: 350, y: 400 },
  },
  {
    id: "6",
    type: "table",
    data: {
      tableName: "user_profiles",
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "user_id", type: "INT", isForeignKey: true },
        { name: "first_name", type: "VARCHAR(50)" },
        { name: "last_name", type: "VARCHAR(50)" },
        { name: "bio", type: "TEXT" },
        { name: "avatar_url", type: "VARCHAR(255)" },
      ],
    },
    position: { x: 600, y: 700 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "1:N",
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    label: "1:N",
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "1:N",
    style: { stroke: "#f59e0b", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "1:N",
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
  },
  {
    id: "e2-5",
    source: "2",
    target: "5",
    label: "1:N",
    style: { stroke: "#ec4899", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ec4899" },
  },
  {
    id: "e1-6",
    source: "1",
    target: "6",
    label: "1:1",
    style: { stroke: "#ef4444", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
  },
];

export default function DatabaseSchemaPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">
              데이터베이스 스키마
            </h1>
            <p className="text-gray-600">
              블로그 시스템의 데이터베이스 테이블 관계를 시각화한 예제입니다.
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
            nodeStrokeColor="#374151"
            nodeColor="#3b82f6"
            nodeBorderRadius={8}
          />
          <Background variant={BackgroundVariant.Lines} gap={20} size={1} />
        </ReactFlow>
      </div>

      <footer className="bg-white border-t p-4">
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 mr-2 rounded"></div>
            <span>Primary Key</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-300 mr-2 rounded"></div>
            <span>Foreign Key</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-0.5 bg-blue-500 mr-2"></div>
            <span>1:N 관계</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-0.5 bg-red-500 mr-2"></div>
            <span>1:1 관계</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
