"use client";

import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
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

type KubernetesNodeData = {
  label: string;
  type: string;
  icon: string;
  status: "running" | "pending" | "failed" | "stopped";
  namespace?: string;
  replicas?: number;
  cpu?: string;
  memory?: string;
  description?: string;
};

// Kubernetes 리소스 노드 컴포넌트
function KubernetesNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as KubernetesNodeData;

  const getNodeStyle = (type: string, status: string) => {
    const baseStyle = "min-w-[160px] transition-all duration-300";

    const statusStyles = {
      running: "bg-green-50 border-green-500 text-green-800",
      pending: "bg-yellow-50 border-yellow-500 text-yellow-800",
      failed: "bg-red-50 border-red-500 text-red-800",
      stopped: "bg-gray-50 border-gray-400 text-gray-600",
    };

    return `${baseStyle} ${
      statusStyles[status as keyof typeof statusStyles] || statusStyles.running
    }`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return "🟢";
      case "pending":
        return "🟡";
      case "failed":
        return "🔴";
      case "stopped":
        return "⚫";
      default:
        return nodeData.icon;
    }
  };

  return (
    <div
      className={`px-3 py-2 shadow-lg rounded-lg border-2 ${getNodeStyle(
        nodeData.type,
        nodeData.status
      )}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="text-sm mr-2">
            {nodeData.type !== "namespace"
              ? getStatusIcon(nodeData.status)
              : nodeData.icon}
          </span>
          <div className="text-xs font-bold">{nodeData.label}</div>
        </div>
      </div>

      {nodeData.namespace && nodeData.type !== "namespace" && (
        <div className="text-xs text-gray-500 mb-1">
          namespace: {nodeData.namespace}
        </div>
      )}

      {nodeData.description && (
        <div className="text-xs text-gray-600 mb-1">{nodeData.description}</div>
      )}

      {(nodeData.replicas || nodeData.cpu || nodeData.memory) && (
        <div className="bg-white bg-opacity-70 rounded p-1 text-xs space-y-0.5">
          {nodeData.replicas !== undefined && (
            <div className="flex justify-between">
              <span>Replicas:</span>
              <span className="text-blue-600 font-medium">
                {nodeData.replicas}
              </span>
            </div>
          )}
          {nodeData.cpu && (
            <div className="flex justify-between">
              <span>CPU:</span>
              <span className="text-green-600">{nodeData.cpu}</span>
            </div>
          )}
          {nodeData.memory && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="text-purple-600">{nodeData.memory}</span>
            </div>
          )}
        </div>
      )}

      {nodeData.type !== "namespace" && nodeData.type !== "ingress" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-gray-400"
        />
      )}
      {nodeData.type !== "pod" &&
        nodeData.type !== "configmap" &&
        nodeData.type !== "secret" &&
        nodeData.type !== "volume" && (
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
  kubernetes: KubernetesNode,
};

const initialNodes: Node[] = [
  {
    id: "default-ns",
    type: "kubernetes",
    data: {
      label: "default",
      type: "namespace",
      icon: "📁",
      status: "running",
      description: "기본 네임스페이스",
    } as KubernetesNodeData,
    position: { x: 400, y: 50 },
  },
  {
    id: "ingress",
    type: "kubernetes",
    data: {
      label: "web-ingress",
      type: "ingress",
      icon: "🌐",
      status: "running",
      namespace: "default",
      description: "외부 트래픽 라우팅",
    } as KubernetesNodeData,
    position: { x: 400, y: 150 },
  },
  {
    id: "frontend-svc",
    type: "kubernetes",
    data: {
      label: "frontend-service",
      type: "service",
      icon: "🔗",
      status: "running",
      namespace: "default",
      description: "Frontend 로드밸런서",
    } as KubernetesNodeData,
    position: { x: 200, y: 250 },
  },
  {
    id: "backend-svc",
    type: "kubernetes",
    data: {
      label: "backend-service",
      type: "service",
      icon: "🔗",
      status: "running",
      namespace: "default",
      description: "Backend API 서비스",
    } as KubernetesNodeData,
    position: { x: 600, y: 250 },
  },
  {
    id: "frontend-deploy",
    type: "kubernetes",
    data: {
      label: "frontend-deployment",
      type: "deployment",
      icon: "🚀",
      status: "running",
      namespace: "default",
      replicas: 3,
      description: "React 앱 배포",
    } as KubernetesNodeData,
    position: { x: 200, y: 350 },
  },
  {
    id: "backend-deploy",
    type: "kubernetes",
    data: {
      label: "backend-deployment",
      type: "deployment",
      icon: "🚀",
      status: "running",
      namespace: "default",
      replicas: 2,
      description: "Node.js API 배포",
    } as KubernetesNodeData,
    position: { x: 600, y: 350 },
  },
  {
    id: "frontend-pod1",
    type: "kubernetes",
    data: {
      label: "frontend-pod-1",
      type: "pod",
      icon: "📦",
      status: "running",
      namespace: "default",
      cpu: "100m",
      memory: "128Mi",
    },
    position: { x: 100, y: 450 },
  },
  {
    id: "frontend-pod2",
    type: "kubernetes",
    data: {
      label: "frontend-pod-2",
      type: "pod",
      icon: "📦",
      status: "running",
      namespace: "default",
      cpu: "100m",
      memory: "128Mi",
    },
    position: { x: 200, y: 450 },
  },
  {
    id: "frontend-pod3",
    type: "kubernetes",
    data: {
      label: "frontend-pod-3",
      type: "pod",
      icon: "📦",
      status: "pending",
      namespace: "default",
      cpu: "100m",
      memory: "128Mi",
    },
    position: { x: 300, y: 450 },
  },
  {
    id: "backend-pod1",
    type: "kubernetes",
    data: {
      label: "backend-pod-1",
      type: "pod",
      icon: "📦",
      status: "running",
      namespace: "default",
      cpu: "200m",
      memory: "256Mi",
    },
    position: { x: 550, y: 450 },
  },
  {
    id: "backend-pod2",
    type: "kubernetes",
    data: {
      label: "backend-pod-2",
      type: "pod",
      icon: "📦",
      status: "running",
      namespace: "default",
      cpu: "200m",
      memory: "256Mi",
    },
    position: { x: 650, y: 450 },
  },
  {
    id: "config",
    type: "kubernetes",
    data: {
      label: "app-config",
      type: "configmap",
      icon: "⚙️",
      status: "running",
      namespace: "default",
      description: "애플리케이션 설정",
    },
    position: { x: 150, y: 550 },
  },
  {
    id: "secret",
    type: "kubernetes",
    data: {
      label: "db-secret",
      type: "secret",
      icon: "🔐",
      status: "running",
      namespace: "default",
      description: "데이터베이스 인증정보",
    },
    position: { x: 400, y: 550 },
  },
  {
    id: "volume",
    type: "kubernetes",
    data: {
      label: "data-volume",
      type: "volume",
      icon: "💾",
      status: "running",
      namespace: "default",
      description: "영구 볼륨",
    },
    position: { x: 650, y: 550 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "ingress", target: "frontend-svc", label: "route" },
  { id: "e2", source: "ingress", target: "backend-svc", label: "route" },
  {
    id: "e3",
    source: "frontend-svc",
    target: "frontend-deploy",
    label: "selector",
  },
  {
    id: "e4",
    source: "backend-svc",
    target: "backend-deploy",
    label: "selector",
  },
  {
    id: "e5",
    source: "frontend-deploy",
    target: "frontend-pod1",
    label: "manages",
  },
  {
    id: "e6",
    source: "frontend-deploy",
    target: "frontend-pod2",
    label: "manages",
  },
  {
    id: "e7",
    source: "frontend-deploy",
    target: "frontend-pod3",
    label: "manages",
  },
  {
    id: "e8",
    source: "backend-deploy",
    target: "backend-pod1",
    label: "manages",
  },
  {
    id: "e9",
    source: "backend-deploy",
    target: "backend-pod2",
    label: "manages",
  },
  {
    id: "e10",
    source: "frontend-pod1",
    target: "config",
    label: "mounts",
    style: { stroke: "#f59e0b" },
  },
  {
    id: "e11",
    source: "frontend-pod2",
    target: "config",
    label: "mounts",
    style: { stroke: "#f59e0b" },
  },
  {
    id: "e12",
    source: "backend-pod1",
    target: "secret",
    label: "mounts",
    style: { stroke: "#ef4444" },
  },
  {
    id: "e13",
    source: "backend-pod2",
    target: "secret",
    label: "mounts",
    style: { stroke: "#ef4444" },
  },
  {
    id: "e14",
    source: "backend-pod1",
    target: "volume",
    label: "mounts",
    style: { stroke: "#6b7280" },
  },
  {
    id: "e15",
    source: "backend-pod2",
    target: "volume",
    label: "mounts",
    style: { stroke: "#6b7280" },
  },
];

export default function KubernetesClusterPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNamespace, setSelectedNamespace] = useState("default");
  const [resourceFilter, setResourceFilter] = useState("all");

  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const getResourceCounts = () => {
    const running = nodes.filter((node) => {
      const nodeData = node.data as KubernetesNodeData;
      return nodeData.status === "running";
    }).length;
    const pending = nodes.filter((node) => {
      const nodeData = node.data as KubernetesNodeData;
      return nodeData.status === "pending";
    }).length;
    const failed = nodes.filter((node) => {
      const nodeData = node.data as KubernetesNodeData;
      return nodeData.status === "failed";
    }).length;

    return { running, pending, failed };
  };

  const resourceStats = getResourceCounts();

  const filteredNodes =
    resourceFilter === "all"
      ? nodes
      : nodes.filter((node) => {
          const nodeData = node.data as KubernetesNodeData;
          return nodeData.type === resourceFilter;
        });

  return (
    <div className="h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Kubernetes 클러스터 시각화
        </h1>
        <p className="text-gray-600 mt-1">
          Pod, Service, Deployment 등 Kubernetes 리소스들의 관계를 실시간으로
          확인하세요
        </p>
      </div>

      <div style={{ height: "calc(100vh - 120px)" }}>
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          {/* 클러스터 상태 패널 */}
          <Panel
            position="top-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">클러스터 상태</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Running
                </span>
                <span className="font-bold">{resourceStats.running}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Pending
                </span>
                <span className="font-bold">{resourceStats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Failed
                </span>
                <span className="font-bold">{resourceStats.failed}</span>
              </div>
            </div>
          </Panel>

          {/* 리소스 필터 패널 */}
          <Panel
            position="top-right"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">리소스 필터</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  네임스페이스
                </label>
                <select
                  value={selectedNamespace}
                  onChange={(e) => setSelectedNamespace(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="default">default</option>
                  <option value="kube-system">kube-system</option>
                  <option value="monitoring">monitoring</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  리소스 타입
                </label>
                <select
                  value={resourceFilter}
                  onChange={(e) => setResourceFilter(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="all">전체</option>
                  <option value="pod">Pod</option>
                  <option value="service">Service</option>
                  <option value="deployment">Deployment</option>
                  <option value="ingress">Ingress</option>
                </select>
              </div>
            </div>
          </Panel>

          {/* 리소스 편집 패널 */}
          <Panel
            position="bottom-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">리소스 편집</h3>
            <p className="text-xs text-gray-600 mb-2">
              리소스 이름을 수정할 수 있습니다
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {nodes
                .filter((node) => {
                  const nodeData = node.data as KubernetesNodeData;
                  return ["deployment", "service"].includes(nodeData.type);
                })
                .map((node) => {
                  const nodeData = node.data as KubernetesNodeData;
                  return (
                    <div key={node.id} className="flex items-center space-x-2">
                      <span className="text-xs w-4">{nodeData.icon}</span>
                      <input
                        type="text"
                        value={nodeData.label}
                        onChange={(e) =>
                          updateNodeLabel(node.id, e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  );
                })}
            </div>
          </Panel>

          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const status = (node.data as KubernetesNodeData).status;
              switch (status) {
                case "running":
                  return "#10b981";
                case "pending":
                  return "#f59e0b";
                case "failed":
                  return "#ef4444";
                case "stopped":
                  return "#6b7280";
                default:
                  return "#3b82f6";
              }
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
