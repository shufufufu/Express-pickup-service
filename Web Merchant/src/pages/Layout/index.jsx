import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Popconfirm, message } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FileTextOutlined,
  LogoutOutlined,
  PieChartOutlined,
  BarsOutlined,
  CommentOutlined,
  UserOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import Logo from "@/assets/logo.png";
import OUP from "@/assets/OUP.png";
import { clearToken, clearRiderId } from "@/utils";
import { fetchRiderInfo } from "@/apis";

const { Header, Sider, Content } = Layout;

const LayoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [riderName, setRiderName] = useState("未登录");

  const getRiderName = async () => {
    const res = await fetchRiderInfo();
    if (res.success) {
      if (res.data.name === null) {
        message.error("骑手姓名未设置，请先设置");
        navigate("/riderinfo");
        setRiderName("未设置");
      }
      setRiderName(res.data.name);
    } else {
      message.error(res.errorMsg);
    }
  };

  const confirm = () => {
    message.success("退出成功");
    clearToken();
    clearRiderId();
    navigate("/login");
  };

  useEffect(() => {
    getRiderName();
  });

  return (
    <Layout className="min-h-screen">
      {/* 顶部导航 */}
      <Header className="bg-[#00668c]/80 flex items-center justify-between px-6 h-16 fixed top-0 left-0 right-0 z-10">
        {/* Logo */}
        <div className="h-16 flex items-center pl-2">
          <img src={Logo} alt="logo" className="h-8" />
          <img src={OUP} alt="logo" className="h-8 ml-2 mt-2" />
          <span className="text-3xl font-bold text-[#ff6b00] ml-2">O跑</span>
        </div>
        <div className="flex items-center">
          <div
            className="text-white mr-4 text-lg hover:scale-125 hover:text-sky-300 transform-all duration-300 cursor-pointer"
            onClick={() => navigate("/riderinfo")}
          >
            {riderName}
          </div>
          <Popconfirm
            title="提示"
            description="是否确定要退出当前账号？"
            onConfirm={confirm}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              icon={<LogoutOutlined />}
              className="text-white text-lg hover:scale-125 transform-all duration-300"
            />
          </Popconfirm>
        </div>
      </Header>

      <Layout>
        {/* 侧边栏 */}
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="bg-[#00668c]/80 overflow-auto fixed left-0 top-16 bottom-0 z-10"
          // 自定义触发器
          trigger={
            <div className="bg-[#00668c]/0 text-white h-12 leading-[48px] text-center text-2xl hover:bg-white/10 transform-all duration-300 hover:text-3xl">
              {collapsed ? ">" : "<"}
            </div>
          }
        >
          {/* 侧边菜单 - 使用theme="dark"并通过CSS覆盖颜色 */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/"]}
            className="bg-[#00668c]/0 border-r-0 text-lg space-y-3 mt-4"
            selectedKeys={[
              location.pathname === "/" ? "/" : location.pathname.slice(1),
            ]}
            items={[
              {
                key: "/",
                icon: <FileTextOutlined className="mr-2" />,
                label: "订单处理",
                onClick: () => navigate("/"),
              },
              {
                key: "analysis",
                icon: <PieChartOutlined className="mr-2" />,
                label: "流水分析",
                onClick: () => navigate("/analysis"),
              },
              {
                key: "history",
                icon: <BarsOutlined className="mr-2" />,
                label: "历史订单",
                onClick: () => navigate("/history"),
              },
              {
                key: "comment",
                icon: <CommentOutlined className="mr-2" />,
                label: "建议与反馈",
                onClick: () => navigate("/comment"),
              },
              {
                key: "broadcast",
                icon: <NotificationOutlined className="mr-2" />,
                label: "发布公告",
                onClick: () => navigate("/broadcast"),
              },
              {
                key: "riderinfo",
                icon: <UserOutlined className="mr-2" />,
                label: "个人信息",
                onClick: () => navigate("/riderinfo"),
              },
            ]}
          />
        </Sider>

        {/* 主体内容 */}
        <Layout
          className="bg-gray-100 transition-all duration-300 pt-20 px-4"
          style={{
            marginLeft: collapsed ? 80 : 200,
            minHeight: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          {/* 内容区域 */}
          <Content className="min-h-[calc(100vh-64px-48px)]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
