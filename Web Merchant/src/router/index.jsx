import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import Order from "@/pages/Order";
import History from "@/pages/History";
import Analysis from "@/pages/Analysis";
import Comment from "@/pages/Comment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Order />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "analysis",
        element: <Analysis />,
      },
      {
        path: "comment",
        element: <Comment />,
      },
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
