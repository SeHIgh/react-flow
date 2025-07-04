"use client";

import React, { useCallback, useState, useEffect } from "react";
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

// 노드 데이터 타입 정의
interface MonitoringNodeData {
  label: string;
  type: string;
  icon: string;
  status: "healthy" | "warning" | "critical" | "offline";
  metrics?: {
    cpu?: number;
    memory?: number;
    connections?: number;
    latency?: number;
  };
  description?: string;
}

// DevOps 모니터링 노드 컴포넌트
function MonitoringNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as unknown as MonitoringNodeData;

  const getNodeStyle = (type: string, status: string) => {
    const baseStyle = "min-w-[200px] transition-all duration-300 relative";

    switch (status) {
      case "healthy":
        return `${baseStyle} bg-green-50 border-green-500 text-green-800 shadow-green-200`;
      case "warning":
        return `${baseStyle} bg-yellow-50 border-yellow-500 text-yellow-800 shadow-yellow-200`;
      case "critical":
        return `${baseStyle} bg-red-50 border-red-500 text-red-800 shadow-red-200`;
      case "offline":
        return `${baseStyle} bg-gray-50 border-gray-400 text-gray-600 shadow-gray-200`;
      default:
        return `${baseStyle} bg-blue-50 border-blue-500 text-blue-800 shadow-blue-200`;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        );
      case "warning":
        return (
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        );
      case "critical":
        return (
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        );
      case "offline":
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
    }
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 ${getNodeStyle(
        nodeData.type,
        nodeData.status
      )}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">{nodeData.icon}</span>
          <div className="text-sm font-bold">{nodeData.label}</div>
        </div>
        {getStatusIndicator(nodeData.status)}
      </div>

      {nodeData.description && (
        <div className="text-xs text-gray-600 mb-2">{nodeData.description}</div>
      )}

      {nodeData.metrics && (
        <div className="bg-white bg-opacity-70 rounded p-2 text-xs space-y-1">
          {nodeData.metrics.cpu !== undefined && (
            <div className="flex justify-between">
              <span>CPU:</span>
              <span
                className={
                  nodeData.metrics.cpu > 80
                    ? "text-red-600 font-bold"
                    : nodeData.metrics.cpu > 60
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {nodeData.metrics.cpu}%
              </span>
            </div>
          )}
          {nodeData.metrics.memory !== undefined && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span
                className={
                  nodeData.metrics.memory > 80
                    ? "text-red-600 font-bold"
                    : nodeData.metrics.memory > 60
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {nodeData.metrics.memory}%
              </span>
            </div>
          )}
          {nodeData.metrics.connections !== undefined && (
            <div className="flex justify-between">
              <span>Connections:</span>
              <span className="text-blue-600">
                {nodeData.metrics.connections}
              </span>
            </div>
          )}
          {nodeData.metrics.latency !== undefined && (
            <div className="flex justify-between">
              <span>Latency:</span>
              <span
                className={
                  nodeData.metrics.latency > 1000
                    ? "text-red-600 font-bold"
                    : nodeData.metrics.latency > 500
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {nodeData.metrics.latency}ms
              </span>
            </div>
          )}
        </div>
      )}

      {nodeData.type !== "user" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-gray-400"
        />
      )}
      {nodeData.type !== "database" && nodeData.type !== "cache" && (
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
  monitoring: MonitoringNode,
};

const generateRandomMetrics = () => ({
  cpu: Math.floor(Math.random() * 100),
  memory: Math.floor(Math.random() * 100),
  connections: Math.floor(Math.random() * 1000),
  latency: Math.floor(Math.random() * 2000),
});

const getRandomStatus = () => {
  const statuses = [
    "healthy",
    "healthy",
    "healthy",
    "warning",
    "critical",
  ] as const;
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const initialNodes: Node[] = [
  {
    id: "users",
    type: "monitoring",
    data: {
      label: "Users",
      type: "user",
      icon: "👤",
      status: "healthy",
      description: "서비스 이용자",
    },
    position: { x: 400, y: 50 },
  },
  {
    id: "cdn",
    type: "monitoring",
    data: {
      label: "CDN",
      type: "cdn",
      icon: "🌐",
      status: "healthy",
      description: "콘텐츠 전송 네트워크",
    },
    position: { x: 400, y: 150 },
  },
  {
    id: "lb",
    type: "monitoring",
    data: {
      label: "Load Balancer",
      type: "lb",
      icon: "🔀",
      status: "healthy",
      description: "트래픽 분산",
    },
    position: { x: 400, y: 250 },
  },
  {
    id: "web1",
    type: "monitoring",
    data: {
      label: "Web Server 1",
      type: "server",
      icon: "🖥️",
      status: "healthy",
      description: "웹 서버 1",
    },
    position: { x: 100, y: 350 },
  },
  {
    id: "web2",
    type: "monitoring",
    data: {
      label: "Web Server 2",
      type: "server",
      icon: "🖥️",
      status: "healthy",
      description: "웹 서버 2",
    },
    position: { x: 400, y: 350 },
  },
  {
    id: "web3",
    type: "monitoring",
    data: {
      label: "Web Server 3",
      type: "server",
      icon: "🖥️",
      status: "healthy",
      description: "웹 서버 3",
    },
    position: { x: 700, y: 350 },
  },
  {
    id: "api-gw",
    type: "monitoring",
    data: {
      label: "API Gateway",
      type: "api",
      icon: "🛡️",
      status: "healthy",
      description: "API 게이트웨이",
    },
    position: { x: 400, y: 450 },
  },
  {
    id: "redis",
    type: "monitoring",
    data: {
      label: "Redis Cache",
      type: "cache",
      icon: "🗄️",
      status: "healthy",
      description: "캐시 서버",
    },
    position: { x: 100, y: 550 },
  },
  {
    id: "pg",
    type: "monitoring",
    data: {
      label: "PostgreSQL",
      type: "database",
      icon: "🐘",
      status: "healthy",
      description: "DB 서버",
    },
    position: { x: 400, y: 550 },
  },
  {
    id: "monitoring",
    type: "monitoring",
    data: {
      label: "Monitoring",
      type: "monitoring",
      icon: "📈",
      status: "healthy",
      description: "모니터링 시스템",
    },
    position: { x: 700, y: 550 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "users", target: "cdn", label: "HTTP" },
  { id: "e2", source: "cdn", target: "lb", label: "Cache Miss" },
  {
    id: "e3",
    source: "lb",
    target: "web1",
    label: "Round Robin",
  },
  {
    id: "e4",
    source: "lb",
    target: "web2",
    label: "Round Robin",
  },
  {
    id: "e5",
    source: "lb",
    target: "web3",
    label: "Round Robin",
  },
  {
    id: "e6",
    source: "web1",
    target: "api-gw",
    label: "API Calls",
  },
  {
    id: "e7",
    source: "web2",
    target: "api-gw",
    label: "API Calls",
  },
  {
    id: "e8",
    source: "web3",
    target: "api-gw",
    label: "API Calls",
  },
  { id: "e9", source: "api-gw", target: "redis", label: "Cache" },
  { id: "e10", source: "api-gw", target: "pg", label: "Queries" },
  { id: "e11", source: "api-gw", target: "monitoring", label: "Metrics" },
];

export default function DevOpsMonitoringPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // 실시간 메트릭 업데이트 시뮬레이션
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setNodes((nds) =>
        nds.map((node) => {
          const nodeData = node.data as unknown as MonitoringNodeData;
          return {
            ...node,
            data: {
              ...nodeData,
              status: getRandomStatus(),
              metrics: nodeData.metrics
                ? {
                    ...nodeData.metrics,
                    ...generateRandomMetrics(),
                  }
                : undefined,
            },
          };
        })
      );
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, setNodes]);

  const updateNodeConfiguration = useCallback(
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

  const getSystemOverview = () => {
    const healthyCount = nodes.filter(
      (node) =>
        (node.data as unknown as MonitoringNodeData).status === "healthy"
    ).length;
    const warningCount = nodes.filter(
      (node) =>
        (node.data as unknown as MonitoringNodeData).status === "warning"
    ).length;
    const criticalCount = nodes.filter(
      (node) =>
        (node.data as unknown as MonitoringNodeData).status === "critical"
    ).length;
    const offlineCount = nodes.filter(
      (node) =>
        (node.data as unknown as MonitoringNodeData).status === "offline"
    ).length;

    return { healthyCount, warningCount, criticalCount, offlineCount };
  };

  const systemStatus = getSystemOverview();

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
          DevOps 모니터링 대시보드
        </h1>
        <p className="text-gray-600 mt-1">
          실시간 인프라 상태 모니터링 및 시각화
        </p>
      </div>

      <div style={{ height: "calc(100vh - 120px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          {/* 시스템 상태 개요 패널 */}
          <Panel
            position="top-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">시스템 상태</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>정상: {systemStatus.healthyCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>경고: {systemStatus.warningCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>위험: {systemStatus.criticalCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>오프라인: {systemStatus.offlineCount}</span>
              </div>
            </div>
          </Panel>

          {/* 모니터링 제어 패널 */}
          <Panel
            position="top-right"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">모니터링 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">실시간 모니터링</label>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    isMonitoring
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {isMonitoring ? "ON" : "OFF"}
                </button>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  새로고침 간격
                </label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={1000}>1초</option>
                  <option value={5000}>5초</option>
                  <option value={10000}>10초</option>
                  <option value={30000}>30초</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">알림</label>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    alertsEnabled
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {alertsEnabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </Panel>

          {/* 서버 설정 패널 */}
          <Panel
            position="bottom-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">서버 설정</h3>
            <p className="text-xs text-gray-600 mb-2">
              서버 이름을 수정할 수 있습니다
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {nodes
                .filter(
                  (node) =>
                    (node.data as unknown as MonitoringNodeData).type ===
                    "server"
                )
                .map((node) => {
                  const nodeData = node.data as unknown as MonitoringNodeData;
                  return (
                    <div key={node.id} className="flex items-center space-x-2">
                      <span className="text-xs w-4">{nodeData.icon}</span>
                      <input
                        type="text"
                        value={nodeData.label}
                        onChange={(e) =>
                          updateNodeConfiguration(node.id, e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        disabled={isMonitoring}
                      />
                    </div>
                  );
                })}
            </div>
          </Panel>

          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const status = (node.data as unknown as MonitoringNodeData)
                .status;
              switch (status) {
                case "healthy":
                  return "#10b981";
                case "warning":
                  return "#f59e0b";
                case "critical":
                  return "#ef4444";
                case "offline":
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
