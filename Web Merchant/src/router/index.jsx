import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthRoute from "@/pages/components/AuthRoute";

// 布局组件直接导入以避免闪烁
import Layout from "@/pages/Layout";
// 订单处理作为核心功能直接导入
import Order from "@/pages/Order";

// 懒加载组件
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));

// 次常用功能组
const History = lazy(() => import("@/pages/History"));
const Analysis = lazy(() => import("@/pages/Analysis"));

// 辅助功能组
const Comment = lazy(() => import("@/pages/Comment"));
const Riderinfo = lazy(() => import("@/pages/Rider"));
const Broadcast = lazy(() => import("@/pages/Broadcast"));

// 加载提示组件
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Order />, // 核心功能不需要懒加载
      },
      {
        path: "history",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <History />
          </Suspense>
        ),
      },
      {
        path: "analysis",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Analysis />
          </Suspense>
        ),
      },
      {
        path: "comment",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Comment />
          </Suspense>
        ),
      },
      {
        path: "broadcast",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Broadcast />
          </Suspense>
        ),
      },
      {
        path: "riderinfo",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Riderinfo />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
