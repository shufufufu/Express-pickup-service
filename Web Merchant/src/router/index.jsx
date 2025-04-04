import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Layout from "@/pages/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 这里可以添加Layout的子路由
      // 例如:
      // {
      //   path: "home",
      //   element: <Home />
      // }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
