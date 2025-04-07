import React, { useState } from "react";
import { Table, Card, Tabs, Tag, Button, Modal, message, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  STEP_STATES,
  getStatusDesc,
  getStatusColor,
  getNextStatus,
} from "./components/STEP_STATES";
import SimpleCountdown from "./components/Countdown";

// 模拟订单数据
const mockOrders = [
  {
    id: "1",
    expressId: "SF1234567890",
    dormAdd: "第一宿舍楼 3单元 502室",
    status: STEP_STATES.STEP1.WAITING,
    downTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟后
    createTime: "2025-04-05 10:00:00",
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    iphoneNumber: "13800138000",
    comment: "请轻拿轻放，易碎物品",
  },
  {
    id: "2",
    expressId: "YT9876543210",
    dormAdd: "第二宿舍楼 2单元 305室",
    status: STEP_STATES.STEP1.ACCEPTED,
    downTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45分钟后
    createTime: "2025-04-05 09:30:00",
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    iphoneNumber: "13900139000",
    comment: "",
  },
  {
    id: "3",
    expressId: "ZT5678901234",
    dormAdd: "第三宿舍楼 1单元 101室",
    status: STEP_STATES.STEP2.SUCCESS,
    downTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60分钟后
    createTime: "2025-04-05 09:00:00",
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    iphoneNumber: "13700137000",
    comment: "放在门口即可，不用等我",
  },
  {
    id: "4",
    expressId: "JD6543210987",
    dormAdd: "第四宿舍楼 4单元 405室",
    status: STEP_STATES.STEP3.DELIVERED,
    downTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20分钟后
    createTime: "2025-04-05 08:30:00",
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    iphoneNumber: "13600136000",
    comment: "",
  },
  {
    id: "5",
    expressId: "YD1357924680",
    dormAdd: "第五宿舍楼 5单元 501室",
    status: STEP_STATES.STEP1.REJECTED,
    downTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15分钟后
    createTime: "2025-04-05 08:00:00",
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    iphoneNumber: "13500135000",
    comment: "加急件，请尽快送达",
  },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // 处理订单状态更新
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    message.success(`订单状态已更新为: ${getStatusDesc(newStatus)}`);
  };

  // 处理订单进度推进
  const handleProgressOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const nextStatus = getNextStatus(order.status);
      handleUpdateStatus(orderId, nextStatus);
    }
  };

  // 处理拒单
  const handleRejectOrder = (orderId) => {
    Modal.confirm({
      title: "确认拒单",
      content: "您确定要拒绝这个订单吗？",
      onOk() {
        handleUpdateStatus(orderId, STEP_STATES.STEP1.REJECTED);
      },
    });
  };

  // 处理取件失败
  const handlePickupFailed = (orderId) => {
    Modal.confirm({
      title: "确认取件失败",
      content: "您确定要标记此订单为取件失败吗？",
      onOk() {
        handleUpdateStatus(orderId, STEP_STATES.STEP2.FAILED);
      },
    });
  };

  // 查看订单详情
  const showOrderDetail = (order) => {
    setCurrentOrder(order);
    setDetailModalVisible(true);
  };

  // 获取操作按钮
  const getActionButtons = (order) => {
    const buttons = [];

    // 添加查看详情按钮
    buttons.push(
      <Button
        key="view"
        type="link"
        icon={<EyeOutlined />}
        onClick={() => showOrderDetail(order)}
      >
        查看详情
      </Button>
    );

    // 根据状态添加操作按钮
    switch (order.status) {
      case STEP_STATES.STEP1.WAITING:
        buttons.push(
          <Button
            key="accept"
            type="primary"
            size="small"
            onClick={() => handleProgressOrder(order.id)}
          >
            接单
          </Button>,
          <Button
            key="reject"
            danger
            size="small"
            onClick={() => handleRejectOrder(order.id)}
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
          >
            已取到件
          </Button>,
          <Button
            key="pickupFailed"
            danger
            size="small"
            onClick={() => handlePickupFailed(order.id)}
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

  // 根据选项卡筛选订单
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "waiting":
        return orders.filter(
          (order) => order.status === STEP_STATES.STEP1.WAITING
        );
      case "processing":
        return orders.filter((order) => {
          return (
            order.status === STEP_STATES.STEP1.ACCEPTED ||
            order.status === STEP_STATES.STEP2.PICKING ||
            order.status === STEP_STATES.STEP2.SUCCESS ||
            order.status === STEP_STATES.STEP3.DELIVERING
          );
        });
      case "completed":
        return orders.filter(
          (order) => order.status === STEP_STATES.STEP3.DELIVERED
        );
      case "failed":
        return orders.filter((order) => {
          return (
            order.status === STEP_STATES.STEP1.REJECTED ||
            order.status === STEP_STATES.STEP2.FAILED
          );
        });
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // 计算各状态订单数量
  const waitingCount = orders.filter(
    (order) => order.status === STEP_STATES.STEP1.WAITING
  ).length;
  const processingCount = orders.filter((order) => {
    return (
      order.status === STEP_STATES.STEP1.ACCEPTED ||
      order.status === STEP_STATES.STEP2.PICKING ||
      order.status === STEP_STATES.STEP2.SUCCESS ||
      order.status === STEP_STATES.STEP3.DELIVERING
    );
  }).length;
  const completedCount = orders.filter(
    (order) => order.status === STEP_STATES.STEP3.DELIVERED
  ).length;
  const failedCount = orders.filter((order) => {
    return (
      order.status === STEP_STATES.STEP1.REJECTED ||
      order.status === STEP_STATES.STEP2.FAILED
    );
  }).length;

  // 选项卡项
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
        pagination={{ pageSize: 10 }}
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
                  onClick={() => {
                    if (currentOrder.status === STEP_STATES.STEP1.WAITING) {
                      handleProgressOrder(currentOrder.id);
                    } else {
                      handleProgressOrder(currentOrder.id);
                    }
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
                      <span>{currentOrder.createTime}</span>
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
                        {new Date(currentOrder.downTime).toLocaleString()}
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
    </Card>
  );
};

export default OrderManagement;
