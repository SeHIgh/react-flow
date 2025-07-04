"use client";

import React, { useCallback, useState } from "react";
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
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "입력 A" },
    position: { x: 400, y: 50 },
  },
  {
    id: "2",
    data: { label: "처리 B" },
    position: { x: 200, y: 250 },
  },
  {
    id: "3",
    data: { label: "처리 C" },
    position: { x: 600, y: 250 },
  },
  {
    id: "4",
    data: { label: "조합 D" },
    position: { x: 400, y: 450 },
  },
  {
    id: "5",
    type: "output",
    data: { label: "출력 E" },
    position: { x: 400, y: 650 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
];

function InteractiveControlsFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [variant, setVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const [miniMapHidden, setMiniMapHidden] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);

  const { fitView, zoomIn, zoomOut, zoomTo } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFitView = () => {
    fitView({ duration: 800 });
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 200 });
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 200 });
  };

  const handleZoomTo = (zoom: number) => {
    zoomTo(zoom, { duration: 200 });
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
              인터랙티브 컨트롤
            </h1>
            <p className="text-gray-600">
              다양한 인터랙티브 컨트롤과 기능들을 체험해보세요.
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
          {!controlsHidden && <Controls />}
          {!miniMapHidden && (
            <MiniMap
              nodeStrokeColor="#374151"
              nodeColor="#f3f4f6"
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          )}
          <Background variant={variant} gap={12} size={1} />

          <Panel
            position="top-left"
            className="bg-white p-4 rounded-lg shadow-md border"
          >
            <h3 className="font-semibold mb-3">컨트롤 패널</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">
                  배경 스타일
                </label>
                <select
                  value={variant}
                  onChange={(e) =>
                    setVariant(e.target.value as BackgroundVariant)
                  }
                  className="w-full p-1 border rounded text-sm"
                >
                  <option value={BackgroundVariant.Dots}>점</option>
                  <option value={BackgroundVariant.Lines}>선</option>
                  <option value={BackgroundVariant.Cross}>십자</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  줌 컨트롤
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={handleZoomIn}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    확대
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    축소
                  </button>
                  <button
                    onClick={() => handleZoomTo(0.5)}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleZoomTo(2)}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                  >
                    200%
                  </button>
                </div>
              </div>

              <button
                onClick={handleFitView}
                className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                전체 보기
              </button>

              <div className="space-y-1">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={miniMapHidden}
                    onChange={(e) => setMiniMapHidden(e.target.checked)}
                    className="mr-2"
                  />
                  미니맵 숨기기
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={controlsHidden}
                    onChange={(e) => setControlsHidden(e.target.checked)}
                    className="mr-2"
                  />
                  컨트롤 숨기기
                </label>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <footer className="bg-white border-t p-4">
        <div className="text-center text-sm text-gray-600">
          <p>
            마우스 휠로 줌, 드래그로 패닝, 노드 연결로 엣지 생성이 가능합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function InteractiveControlsPage() {
  return (
    <ReactFlowProvider>
      <InteractiveControlsFlow />
    </ReactFlowProvider>
  );
}
