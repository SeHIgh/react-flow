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
  addEdge,
  Connection,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

// CI/CD 파이프라인 노드 컴포넌트
function CICDNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as {
    label: string;
    type: string;
    icon: string;
    status: "idle" | "running" | "success" | "failed";
    duration?: string;
    description?: string;
  };

  const getNodeStyle = (type: string, status: string) => {
    const baseStyle = "min-w-[180px] transition-all duration-300";

    switch (status) {
      case "running":
        return `${baseStyle} bg-blue-100 border-blue-500 text-blue-800 animate-pulse`;
      case "success":
        return `${baseStyle} bg-green-100 border-green-500 text-green-800`;
      case "failed":
        return `${baseStyle} bg-red-100 border-red-500 text-red-800`;
      case "cancelled":
        return `${baseStyle} bg-gray-100 border-gray-400 text-gray-600 opacity-60`;
      default:
        switch (type) {
          case "source":
            return `${baseStyle} bg-purple-100 border-purple-500 text-purple-800`;
          case "build":
            return `${baseStyle} bg-orange-100 border-orange-500 text-orange-800`;
          case "test":
            return `${baseStyle} bg-yellow-100 border-yellow-500 text-yellow-800`;
          case "deploy":
            return `${baseStyle} bg-indigo-100 border-indigo-500 text-indigo-800`;
          case "server":
            return `${baseStyle} bg-gray-100 border-gray-500 text-gray-800`;
          default:
            return `${baseStyle} bg-gray-100 border-gray-500 text-gray-800`;
        }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return "⏳";
      case "success":
        return "✅";
      case "failed":
        return "❌";
      case "cancelled":
        return "🚫";
      default:
        return nodeData.icon;
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
          <span className="text-lg mr-2">{getStatusIcon(nodeData.status)}</span>
          <div className="text-sm font-bold">{nodeData.label}</div>
        </div>
        {nodeData.duration && (
          <span className="text-xs bg-white px-1 py-0.5 rounded">
            {nodeData.duration}
          </span>
        )}
      </div>

      {nodeData.description && (
        <div className="text-xs text-gray-600 mb-2">{nodeData.description}</div>
      )}

      {nodeData.type !== "source" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-gray-400"
        />
      )}
      {nodeData.type !== "server" && (
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
  cicd: CICDNode,
};

const initialNodes: Node[] = [
  {
    id: "git-trigger",
    type: "cicd",
    data: {
      label: "Git Push Trigger",
      type: "source",
      icon: "🔄",
      status: "idle",
      description: "코드 푸시 이벤트 감지",
    },
    position: { x: 400, y: 50 },
  },
  {
    id: "git-actions",
    type: "cicd",
    data: {
      label: "GitHub Actions",
      type: "build",
      icon: "⚡",
      status: "idle",
      description: "CI/CD 워크플로우 실행",
    },
    position: { x: 400, y: 200 },
  },
  {
    id: "code-checkout",
    type: "cicd",
    data: {
      label: "Code Checkout",
      type: "build",
      icon: "📥",
      status: "idle",
      description: "소스 코드 체크아웃",
    },
    position: { x: 100, y: 350 },
  },
  {
    id: "run-tests",
    type: "cicd",
    data: {
      label: "Run Tests",
      type: "test",
      icon: "🧪",
      status: "idle",
      description: "단위 테스트 및 통합 테스트",
    },
    position: { x: 400, y: 350 },
  },
  {
    id: "docker-build",
    type: "cicd",
    data: {
      label: "Docker Build",
      type: "build",
      icon: "🐳",
      status: "idle",
      description: "도커 이미지 빌드",
    },
    position: { x: 700, y: 350 },
  },
  {
    id: "docker-push",
    type: "cicd",
    data: {
      label: "Push to Registry",
      type: "deploy",
      icon: "📤",
      status: "idle",
      description: "도커 레지스트리에 이미지 푸시",
    },
    position: { x: 400, y: 500 },
  },
  {
    id: "aws-deploy",
    type: "cicd",
    data: {
      label: "Deploy to AWS",
      type: "deploy",
      icon: "☁️",
      status: "idle",
      description: "AWS EC2에 배포",
    },
    position: { x: 400, y: 650 },
  },
  {
    id: "ec2-instance",
    type: "cicd",
    data: {
      label: "EC2 Instance",
      type: "server",
      icon: "🖥️",
      status: "idle",
      description: "애플리케이션 실행 서버",
    },
    position: { x: 400, y: 800 },
  },
];

const getEdgeStyle = (
  status: "idle" | "running" | "completed" | "failed" | "cancelled"
) => {
  switch (status) {
    case "running":
      return {
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
      };
    case "completed":
      return {
        animated: false,
        style: { stroke: "#10b981", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      };
    case "failed":
      return {
        animated: false,
        style: { stroke: "#ef4444", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
      };
    case "cancelled":
      return {
        animated: false,
        style: { stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "5,5" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
      };
    default:
      return {
        animated: false,
        style: { stroke: "#9ca3af", strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
      };
  }
};

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "git-trigger",
    target: "git-actions",
    label: "트리거",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e2",
    source: "git-actions",
    target: "code-checkout",
    label: "병렬 실행",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e3",
    source: "git-actions",
    target: "run-tests",
    label: "병렬 실행",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e4",
    source: "git-actions",
    target: "docker-build",
    label: "병렬 실행",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e5",
    source: "code-checkout",
    target: "docker-push",
    label: "완료 후",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e6",
    source: "run-tests",
    target: "docker-push",
    label: "테스트 통과",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e7",
    source: "docker-build",
    target: "docker-push",
    label: "빌드 완료",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e8",
    source: "docker-push",
    target: "aws-deploy",
    label: "이미지 준비",
    ...getEdgeStyle("idle"),
  },
  {
    id: "e9",
    source: "aws-deploy",
    target: "ec2-instance",
    label: "배포 완료",
    ...getEdgeStyle("idle"),
  },
];

export default function CICDPipelinePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // 파이프라인 설정 상태
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<
    "idle" | "running" | "completed" | "failed"
  >("idle");
  const [failedStep, setFailedStep] = useState<string | null>(null);
  const [pipelineConfig, setPipelineConfig] = useState({
    repositoryUrl: "https://github.com/user/project",
    branch: "main",
    dockerRegistry: "docker.io/username",
    awsRegion: "ap-northeast-2",
    ec2InstanceType: "t3.micro",
    environmentName: "production",
  });

  // 파이프라인 실행 시뮬레이션
  const pipelineSteps = [
    "git-trigger",
    "git-actions",
    "code-checkout",
    "run-tests",
    "docker-build",
    "docker-push",
    "aws-deploy",
    "ec2-instance",
  ];

  // 각 스텝에 연결된 엣지들 매핑
  const stepEdgeMap: { [key: string]: string[] } = {
    "git-trigger": ["e1"],
    "git-actions": ["e2", "e3", "e4"],
    "code-checkout": ["e5"],
    "run-tests": ["e6"],
    "docker-build": ["e7"],
    "docker-push": ["e8"],
    "aws-deploy": ["e9"],
    "ec2-instance": [],
  };

  const runPipeline = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setCurrentStep(0);
    setPipelineStatus("running");
    setFailedStep(null);

    // 모든 노드와 엣지를 idle 상태로 리셋
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, status: "idle" },
      }))
    );
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        ...getEdgeStyle("idle"),
      }))
    );

    // 단계별로 순차 실행
    const executeStep = (stepIndex: number) => {
      if (stepIndex >= pipelineSteps.length) {
        // 모든 단계 완료
        setIsRunning(false);
        setPipelineStatus("completed");
        return;
      }

      const stepId = pipelineSteps[stepIndex];
      setCurrentStep(stepIndex);

      // 현재 단계를 running으로 설정
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === stepId) {
            return {
              ...node,
              data: {
                ...node.data,
                status: "running",
                duration: "실행 중...",
              },
            };
          }
          return node;
        })
      );

      // 현재 단계의 엣지들을 running 상태로 설정
      const currentEdges = stepEdgeMap[stepId] || [];
      setEdges((eds) =>
        eds.map((edge) => {
          if (currentEdges.includes(edge.id)) {
            return {
              ...edge,
              ...getEdgeStyle("running"),
            };
          }
          return edge;
        })
      );

      // 2초 후 완료 처리
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% 성공률 (실패 확률 증가)

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === stepId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  status: success ? "success" : "failed",
                  duration: success
                    ? `${(Math.random() * 120 + 30).toFixed(0)}초`
                    : "실패",
                },
              };
            }
            return node;
          })
        );

        // 현재 단계의 엣지들을 완료/실패 상태로 설정
        setEdges((eds) =>
          eds.map((edge) => {
            if (currentEdges.includes(edge.id)) {
              return {
                ...edge,
                ...getEdgeStyle(success ? "completed" : "failed"),
              };
            }
            return edge;
          })
        );

        if (!success) {
          // 실패한 경우 파이프라인 중단
          setIsRunning(false);
          setPipelineStatus("failed");
          setFailedStep(stepId);

          // 나머지 단계들을 cancelled 상태로 설정
          const remainingSteps = pipelineSteps.slice(stepIndex + 1);
          setNodes((nds) =>
            nds.map((node) => {
              if (remainingSteps.includes(node.id)) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    status: "cancelled",
                    duration: "취소됨",
                  },
                };
              }
              return node;
            })
          );

          // 나머지 엣지들을 cancelled 상태로 설정
          const remainingEdges: string[] = [];
          remainingSteps.forEach((step) => {
            remainingEdges.push(...(stepEdgeMap[step] || []));
          });

          setEdges((eds) =>
            eds.map((edge) => {
              if (remainingEdges.includes(edge.id)) {
                return {
                  ...edge,
                  ...getEdgeStyle("cancelled"),
                };
              }
              return edge;
            })
          );
        } else {
          // 성공한 경우 다음 단계 실행
          executeStep(stepIndex + 1);
        }
      }, 2000);
    };

    // 첫 번째 단계부터 시작
    executeStep(0);
  }, [isRunning, setNodes, setEdges, pipelineSteps, stepEdgeMap]);

  const resetPipeline = () => {
    if (isRunning) return;

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: "idle",
          duration: undefined,
        },
      }))
    );
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        ...getEdgeStyle("idle"),
      }))
    );
    setCurrentStep(0);
    setPipelineStatus("idle");
    setFailedStep(null);
  };

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
          CI/CD 파이프라인 시각화
        </h1>
        <p className="text-gray-600 mt-1">
          Git Actions부터 AWS EC2 배포까지의 전체 흐름을 실시간으로 확인하세요
        </p>
      </div>

      <div style={{ height: "calc(100vh - 120px)" }}>
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
          {/* 파이프라인 제어 패널 */}
          <Panel
            position="top-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">
              파이프라인 제어
            </h3>
            <div className="space-y-2">
              <button
                onClick={runPipeline}
                disabled={isRunning}
                className={`w-full px-4 py-2 rounded font-medium ${
                  isRunning
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isRunning ? "실행 중..." : "파이프라인 시작"}
              </button>
              <button
                onClick={resetPipeline}
                disabled={isRunning}
                className={`w-full px-4 py-2 rounded font-medium ${
                  isRunning
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                리셋
              </button>
            </div>
            {isRunning && (
              <div className="mt-3 text-sm text-blue-600">
                현재 단계: {currentStep + 1}/{pipelineSteps.length}
              </div>
            )}

            {/* 파이프라인 상태 표시 */}
            <div className="mt-3 text-sm">
              {pipelineStatus === "running" && (
                <div className="text-blue-600">⏳ 파이프라인 실행 중...</div>
              )}
              {pipelineStatus === "completed" && (
                <div className="text-green-600">✅ 파이프라인 완료</div>
              )}
              {pipelineStatus === "failed" && failedStep && (
                <div className="text-red-600">
                  ❌ 파이프라인 실패
                  <div className="text-xs mt-1">
                    {pipelineSteps.indexOf(failedStep) + 1}단계에서
                    실패했습니다.
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* 설정 패널 */}
          <Panel
            position="top-right"
            className="bg-white p-4 rounded-lg shadow-lg w-80"
          >
            <h3 className="font-semibold mb-3 text-gray-800">
              파이프라인 설정
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={pipelineConfig.repositoryUrl}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      repositoryUrl: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Branch</label>
                <input
                  type="text"
                  value={pipelineConfig.branch}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      branch: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Docker Registry
                </label>
                <input
                  type="text"
                  value={pipelineConfig.dockerRegistry}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      dockerRegistry: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">AWS Region</label>
                <select
                  value={pipelineConfig.awsRegion}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      awsRegion: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                >
                  <option value="ap-northeast-2">ap-northeast-2 (서울)</option>
                  <option value="us-east-1">us-east-1 (버지니아)</option>
                  <option value="us-west-2">us-west-2 (오레곤)</option>
                  <option value="eu-west-1">eu-west-1 (아일랜드)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  EC2 Instance Type
                </label>
                <select
                  value={pipelineConfig.ec2InstanceType}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      ec2InstanceType: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                >
                  <option value="t3.micro">t3.micro</option>
                  <option value="t3.small">t3.small</option>
                  <option value="t3.medium">t3.medium</option>
                  <option value="t3.large">t3.large</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Environment</label>
                <select
                  value={pipelineConfig.environmentName}
                  onChange={(e) =>
                    setPipelineConfig((prev) => ({
                      ...prev,
                      environmentName: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isRunning}
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </Panel>

          {/* 노드 편집 패널 */}
          <Panel
            position="bottom-left"
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-gray-800">노드 라벨 편집</h3>
            <p className="text-xs text-gray-600 mb-2">
              아래 입력창에서 각 단계의 라벨을 수정할 수 있습니다
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {nodes.map((node) => {
                const nodeData = node.data as { icon: string; label: string };
                return (
                  <div key={node.id} className="flex items-center space-x-2">
                    <span className="text-xs w-4">{nodeData.icon}</span>
                    <input
                      type="text"
                      value={nodeData.label}
                      onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      disabled={isRunning}
                    />
                  </div>
                );
              })}
            </div>
          </Panel>

          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.data.status) {
                case "running":
                  return "#3b82f6";
                case "success":
                  return "#10b981";
                case "failed":
                  return "#ef4444";
                default:
                  return "#6b7280";
              }
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
