// OrderManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tabs,
  Tag,
  Button,
  Modal,
  message,
  Space,
  Popover,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  STEP_STATES,
  getStatusDesc,
  getStatusColor,
  getNextStatus,
} from "./components/STEP_STATES";
import SimpleCountdown from "./components/Countdown";
import { ReloadOutlined } from "@ant-design/icons";
import {
  fetchOrder,
  fetchUpdateStatus,
  fetchGrabStatus,
  fetchRejectStatus,
  fetchPickFail,
} from "@/apis"; // 根据实际路径调整引入

const OrderManagement = () => {
  const [orders, setOrders] = useState([]); // 订单数据
  const [activeTab, setActiveTab] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // 记录每个订单的操作加载状态

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载订单数据（包含分页参数）
  const loadOrders = async (extraParams = {}) => {
    setLoading(true);
    try {
      const result = await fetchOrder({
        page: currentPage,
        pageSize,
        ...extraParams,
      });
      setLoading(false);
      if (result.success && result.data) {
        setOrders(result.data.order || []);
        setTotal(result.data.total || 0);
      } else {
        message.error(`订单获取失败: ${result.errorMsg}`);
      }
    } catch (error) {
      setLoading(false);
      message.error(`订单获取失败: ${error.message || "未知错误"}`);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize]);

  // 处理分页变化
  const handleTableChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // 根据订单状态过滤
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "waiting":
        return orders.filter(
          (order) => order.status === STEP_STATES.STEP1.WAITING
        );
      case "processing":
        return orders.filter((order) =>
          [
            STEP_STATES.STEP1.ACCEPTED,
            STEP_STATES.STEP2.PICKING,
            STEP_STATES.STEP2.SUCCESS,
            STEP_STATES.STEP3.DELIVERING,
          ].includes(order.status)
        );
      case "completed":
        return orders.filter(
          (order) => order.status === STEP_STATES.STEP3.DELIVERED
        );
      case "failed":
        return orders.filter((order) =>
          [STEP_STATES.STEP1.REJECTED, STEP_STATES.STEP2.FAILED].includes(
            order.status
          )
        );
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // 刷新订单（重新加载数据）
  const refreshOrders = () => {
    loadOrders();
  };

  // 直接更新订单状态（本地更新）
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    message.success(`订单状态已更新为: ${getStatusDesc(newStatus)}`);
  };

  // 设置订单操作的加载状态
  const setOrderActionLoading = (orderId, isLoading) => {
    setActionLoading((prev) => ({
      ...prev,
      [orderId]: isLoading,
    }));
  };

  // 推进订单状态
  const handleProgressOrder = async (orderId) => {
    // 检查订单状态
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrderActionLoading(orderId, true);

    try {
      // 调用状态更新接口
      let result;
      if (order.status === STEP_STATES.STEP1.WAITING) {
        // 待接单状态，调用抢单接口
        result = await fetchGrabStatus({
          orderId: orderId,
        });
      } else {
        // 其他状态，调用普通状态更新接口
        result = await fetchUpdateStatus({
          orderId: orderId,
        });
      }

      if (result.success) {
        // 接口调用成功，前端自行更新状态
        const nextStatus = getNextStatus(order.status);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );
        message.success(`订单状态已更新为: ${getStatusDesc(nextStatus)}`);
      } else {
        // 接口调用失败
        message.error(result.errorMsg || "状态更新失败，请稍后重试");
      }
    } catch (error) {
      console.error("更新状态出错:", error);
      message.error("状态更新出错，请稍后重试");
    } finally {
      setOrderActionLoading(orderId, false);
    }
  };

  // 处理拒单
  const handleRejectOrder = (orderId) => {
    Modal.confirm({
      title: "确认拒单",
      content: "您确定要拒绝这个订单吗？",
      onOk: async () => {
        setOrderActionLoading(orderId, true);
        try {
          const result = await fetchRejectStatus({ orderId });

          if (result.success) {
            handleUpdateStatus(orderId, STEP_STATES.STEP1.REJECTED);
          } else {
            message.error(result.errorMsg || "拒单失败，请稍后重试");
          }
        } catch (error) {
          console.error("拒单失败:", error);
          message.error("拒单失败，请稍后重试");
        } finally {
          setOrderActionLoading(orderId, false);
        }
      },
    });
  };

  // 处理取件失败
  const handlePickupFailed = (orderId) => {
    Modal.confirm({
      title: "确认取件失败",
      content: "您确定要标记此订单为取件失败吗？",
      onOk: async () => {
        setOrderActionLoading(orderId, true);
        try {
          const result = await fetchPickFail({ orderId });

          if (result.success) {
            handleUpdateStatus(orderId, STEP_STATES.STEP2.FAILED);
          } else {
            message.error(
              result.errorMsg || "标记取件失败操作失败，请稍后重试"
            );
          }
        } catch (error) {
          console.error("取件失败操作出错:", error);
          message.error("取件失败操作出错，请稍后重试");
        } finally {
          setOrderActionLoading(orderId, false);
        }
      },
    });
  };

  // 打开订单详情
  const showOrderDetail = (order) => {
    setCurrentOrder(order);
    setDetailModalVisible(true);
  };

  // 根据订单状态返回操作按钮
  const getActionButtons = (order) => {
    const isLoading = actionLoading[order.id] || false;

    const buttons = [
      <Button
        key="view"
        type="link"
        icon={<EyeOutlined />}
        onClick={() => showOrderDetail(order)}
        disabled={isLoading}
      >
        查看详情
      </Button>,
    ];

    switch (order.status) {
      case STEP_STATES.STEP1.WAITING:
        buttons.push(
          <Button
            key="accept"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            接单
          </Button>,
          <Button
            key="reject"
            danger
            size="small"
            onClick={() => handleRejectOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            拒单
          </Button>
        );
        break;
      case STEP_STATES.STEP1.ACCEPTED:
        buttons.push(
          <Button
            key="pickup"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            开始取件
          </Button>
        );
        break;
      case STEP_STATES.STEP2.PICKING:
        buttons.push(
          <Button
            key="pickedUp"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            已取到件
          </Button>,
          <Button
            key="pickupFailed"
            danger
            size="small"
            onClick={() => handlePickupFailed(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            取件失败
          </Button>
        );
        break;
      case STEP_STATES.STEP2.SUCCESS:
        buttons.push(
          <Button
            key="deliver"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            开始配送
          </Button>
        );
        break;
      case STEP_STATES.STEP3.DELIVERING:
        buttons.push(
          <Button
            key="delivered"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
            loading={isLoading}
            disabled={isLoading}
          >
            确认送达
          </Button>
        );
        break;
      default:
        break;
    }

    return <Space>{buttons}</Space>;
  };

  // 表格列定义
  const columns = [
    {
      title: "订单号",
      dataIndex: "id",
      key: "id",
      width: 135,
    },
    {
      title: "取件码",
      dataIndex: "expressId",
      key: "expressId",
      width: 135,
    },
    {
      title: "送达地址",
      dataIndex: "dormAdd",
      key: "dormAdd",
      ellipsis: true,
    },
    {
      title: "联系电话",
      dataIndex: "iphoneNumber",
      key: "iphoneNumber",
      width: 135,
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
      width: 150,
    },
    {
      title: "下单时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 130,
      render: (createTime) => {
        const date = new Date(createTime);
        return `${date.getMonth() + 1}/${date.getDate()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      },
    },
    {
      title: "剩余时间",
      key: "remainingTime",
      width: 120,
      render: (_, record) =>
        record.status === STEP_STATES.STEP1.WAITING ? (
          <SimpleCountdown value={record.downTime} />
        ) : (
          "-"
        ),
    },
    {
      title: "状态",
      key: "status",
      width: 100,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusDesc(record.status)}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 260,
      render: (_, record) => getActionButtons(record),
    },
  ];

  // 计算各状态订单数量
  const waitingCount = orders.filter(
    (order) => order.status === STEP_STATES.STEP1.WAITING
  ).length;
  const processingCount = orders.filter((order) =>
    [
      STEP_STATES.STEP1.ACCEPTED,
      STEP_STATES.STEP2.PICKING,
      STEP_STATES.STEP2.SUCCESS,
      STEP_STATES.STEP3.DELIVERING,
    ].includes(order.status)
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === STEP_STATES.STEP3.DELIVERED
  ).length;
  const failedCount = orders.filter((order) =>
    [STEP_STATES.STEP1.REJECTED, STEP_STATES.STEP2.FAILED].includes(
      order.status
    )
  ).length;

  // 选项卡配置
  const tabItems = [
    {
      key: "all",
      label: `全部订单 (${orders.length})`,
    },
    {
      key: "waiting",
      label: `待接单 (${waitingCount})`,
    },
    {
      key: "processing",
      label: `处理中 (${processingCount})`,
    },
    {
      key: "completed",
      label: `已完成 (${completedCount})`,
    },
    {
      key: "failed",
      label: `已取消 (${failedCount})`,
    },
  ];

  return (
    <Card title="订单管理中心" className="shadow-md">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-4"
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
          showQuickJumper: true,
        }}
        loading={loading}
        locale={{ emptyText: "暂无订单数据" }}
      />

      {/* 订单详情模态框 */}
      {currentOrder && (
        <Modal
          title={
            <div className="text-xl font-semibold">
              订单详情 - {currentOrder.expressId}
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          width={1000}
          footer={[
            <Button key="back" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>,
            currentOrder.status !== STEP_STATES.STEP1.REJECTED &&
              currentOrder.status !== STEP_STATES.STEP2.FAILED &&
              currentOrder.status !== STEP_STATES.STEP3.DELIVERED && (
                <Button
                  key="action"
                  type="primary"
                  loading={actionLoading[currentOrder.id]}
                  onClick={() => {
                    handleProgressOrder(currentOrder.id);
                    setDetailModalVisible(false);
                  }}
                >
                  {currentOrder.status === STEP_STATES.STEP1.WAITING
                    ? "接单"
                    : "更新状态"}
                </Button>
              ),
          ]}
        >
          <div className="space-y-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-lg font-medium mb-2 text-gray-700">
                    订单信息
                  </p>
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="text-gray-600">订单号：</span>
                      <span className="font-medium">{currentOrder.id}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">取件码：</span>
                      <span className="font-medium">
                        {currentOrder.expressId}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">订单状态：</span>
                      <Tag color={getStatusColor(currentOrder.status)}>
                        {getStatusDesc(currentOrder.status)}
                      </Tag>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">下单时间：</span>
                      <span>
                        {(() => {
                          const date = new Date(currentOrder.createTime);
                          return `${
                            date.getMonth() + 1
                          }/${date.getDate()} ${date
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${date
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`;
                        })()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-lg font-medium mb-2 text-gray-700">
                    配送信息
                  </p>
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="text-gray-600">送达地址：</span>
                      <span className="font-medium">
                        {currentOrder.dormAdd}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">联系电话：</span>
                      <span>{currentOrder.iphoneNumber}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">截止时间：</span>
                      <span>
                        {(() => {
                          const date = new Date(currentOrder.downTime);
                          return `${
                            date.getMonth() + 1
                          }/${date.getDate()} ${date
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${date
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`;
                        })()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 备注信息 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-lg font-medium mb-2 text-gray-700">备注信息</p>
              <p className="text-gray-600">{currentOrder.comment || "无"}</p>
            </div>

            {/* 包裹图片 */}
            {currentOrder.image && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-lg font-medium mb-2 text-gray-700">
                  包裹图片
                </p>
                <div className="flex justify-center">
                  <img
                    src={currentOrder.image || "/placeholder.svg"}
                    alt="包裹图片"
                    className="w-64 h-90 object-contain rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* 右下角浮动按钮 */}
      <div className="fixed right-16 top-40 flex flex-col space-y-4">
        <Popover content={<span>刷新订单</span>} trigger="hover">
          <Button
            type="primary"
            shape="circle"
            icon={<ReloadOutlined />}
            size="large"
            onClick={refreshOrders}
            className="bg-blue-400 border-blue-400 hover:bg-blue-600 hover:border-blue-700 hover:scale-105 transform-all duration-300"
          />
        </Popover>
      </div>
    </Card>
  );
};

export default OrderManagement;
