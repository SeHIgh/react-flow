"use client";

import Link from "next/link";

export default function Home() {
  const examples = [
    {
      title: "기본 플로우",
      description: "기본적인 노드와 엣지를 사용한 간단한 플로우",
      href: "/examples/basic-flow",
    },
    {
      title: "커스텀 노드",
      description: "다양한 스타일의 커스텀 노드 예제",
      href: "/examples/custom-nodes",
    },
    {
      title: "워크플로우 에디터",
      description: "실제 워크플로우를 만들고 편집할 수 있는 에디터",
      href: "/examples/workflow-editor",
    },
    {
      title: "데이터베이스 스키마",
      description: "데이터베이스 테이블 관계를 시각화하는 스키마",
      href: "/examples/database-schema",
    },
    {
      title: "애니메이션 엣지",
      description: "애니메이션 효과가 적용된 엣지",
      href: "/examples/animated-edges",
    },
    {
      title: "인터랙티브 컨트롤",
      description: "확대/축소, 미니맵 등 인터랙티브 컨트롤",
      href: "/examples/interactive-controls",
    },
    {
      title: "CI/CD 파이프라인",
      description: "Git Actions부터 AWS EC2 배포까지의 전체 CI/CD 흐름 시각화",
      href: "/examples/cicd-pipeline",
    },
    {
      title: "DevOps 모니터링",
      description: "실시간 인프라 상태 모니터링 및 시스템 메트릭 시각화",
      href: "/examples/devops-monitoring",
    },
    {
      title: "Kubernetes 클러스터",
      description: "Pod, Service, Deployment 등 K8s 리소스 관계 시각화",
      href: "/examples/kubernetes-cluster",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React Flow 컴포넌트 예제
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            React Flow를 활용한 다양한 인터랙티브 플로우 차트와 다이어그램
            예제들을 확인해보세요.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Link
              key={index}
              href={example.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {example.title}
              </h3>
              <p className="text-gray-600">{example.description}</p>
              <div className="mt-4 text-blue-600 font-medium">예제 보기 →</div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <span>Powered by</span>
            <a
              href="https://reactflow.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              React Flow
            </a>
            <span>and</span>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Next.js
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
