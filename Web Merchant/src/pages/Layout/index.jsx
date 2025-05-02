import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Popconfirm, message, Drawer } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FileTextOutlined,
  LogoutOutlined,
  PieChartOutlined,
  BarsOutlined,
  CommentOutlined,
  UserOutlined,
  NotificationOutlined,
  MenuOutlined,
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
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [collapsed]);

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
  }, []);

  // 菜单项配置
  const menuItems = [
    {
      key: "/",
      icon: <FileTextOutlined className="mr-2" />,
      label: "订单处理",
      onClick: () => {
        navigate("/");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "analysis",
      icon: <PieChartOutlined className="mr-2" />,
      label: "流水分析",
      onClick: () => {
        navigate("/analysis");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "history",
      icon: <BarsOutlined className="mr-2" />,
      label: "历史订单",
      onClick: () => {
        navigate("/history");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "comment",
      icon: <CommentOutlined className="mr-2" />,
      label: "建议与反馈",
      onClick: () => {
        navigate("/comment");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "broadcast",
      icon: <NotificationOutlined className="mr-2" />,
      label: "发布公告",
      onClick: () => {
        navigate("/broadcast");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "riderinfo",
      icon: <UserOutlined className="mr-2" />,
      label: "个人信息",
      onClick: () => {
        navigate("/riderinfo");
        if (isMobile) setDrawerVisible(false);
      },
    },
  ];

  // 渲染菜单
  const renderMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["/"]}
      className="bg-[#00668c]/0 border-r-0 text-lg space-y-3 mt-4"
      selectedKeys={[
        location.pathname === "/" ? "/" : location.pathname.slice(1),
      ]}
      items={menuItems}
    />
  );

  return (
    <Layout className="min-h-screen">
      {/* 顶部导航 */}
      <Header className="bg-[#00668c]/80 flex items-center justify-between px-2 sm:px-6 h-16 fixed top-0 left-0 right-0 z-10">
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="text-white mr-2"
          />
        )}

        {/* Logo */}
        <div className="h-16 flex items-center pl-0 sm:pl-2">
          <img
            src={Logo || "/placeholder.svg"}
            alt="logo"
            className="h-6 sm:h-8"
          />
          {!isMobile && (
            <img
              src={OUP || "/placeholder.svg"}
              alt="logo"
              className="h-6 sm:h-8 ml-2 mt-2"
            />
          )}
          <span className="text-xl sm:text-3xl font-bold text-[#ff6b00] ml-2">
            O跑
          </span>
        </div>

        <div className="flex items-center">
          <div
            className="text-white mr-2 sm:mr-4 text-sm sm:text-lg hover:scale-110 sm:hover:scale-125 hover:text-sky-300 transform-all duration-300 cursor-pointer truncate max-w-[80px] sm:max-w-none"
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
              className="text-white text-base sm:text-lg hover:scale-110 sm:hover:scale-125 transform-all duration-300 p-0 sm:p-1"
            />
          </Popconfirm>
        </div>
      </Header>

      <Layout>
        {/* 移动端抽屉菜单 */}
        {isMobile && (
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={200}
            bodyStyle={{ padding: 0, background: "#00668c" }}
            headerStyle={{ display: "none" }}
          >
            <div className="h-16 flex items-center justify-center bg-[#00668c]">
              <img
                src={Logo || "/placeholder.svg"}
                alt="logo"
                className="h-8"
              />
              <img
                src={OUP || "/placeholder.svg"}
                alt="logo"
                className="h-8 ml-2 mt-2"
              />
              <span className="text-2xl font-bold text-[#ff6b00] ml-2">
                O跑
              </span>
            </div>
            {renderMenu()}
          </Drawer>
        )}

        {/* 桌面端侧边栏 */}
        {!isMobile && (
          <Sider
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="bg-[#00668c]/80 overflow-auto fixed left-0 top-16 bottom-0 z-10"
            trigger={
              <div className="bg-[#00668c]/0 text-white h-12 leading-[48px] text-center text-2xl hover:bg-white/10 transform-all duration-300 hover:text-3xl">
                {collapsed ? ">" : "<"}
              </div>
            }
          >
            {renderMenu()}
          </Sider>
        )}

        {/* 主体内容 */}
        <Layout
          className="bg-gray-100 transition-all duration-300 pt-20 px-2 sm:px-4"
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
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
