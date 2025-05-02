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
  Row,
  Col,
  Tooltip,
  Typography,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  STEP_STATES,
  getStatusDesc,
  getStatusColor,
  getNextStatus,
} from "./components/STEP_STATES";
import SimpleCountdown from "./components/Countdown";
import {
  fetchOrder,
  fetchUpdateStatus,
  fetchGrabStatus,
  fetchRejectStatus,
  fetchPickFail,
} from "@/apis";

const { Title } = Typography;

const OrderManagement = () => {
  // 保留原有状态
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 新增响应式状态
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // 保留原有的loadOrders函数
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

  // 其他原有函数保持不变...
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

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
  const refreshOrders = () => loadOrders();

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    message.success(`订单状态已更新为: ${getStatusDesc(newStatus)}`);
  };

  const setOrderActionLoading = (orderId, isLoading) => {
    setActionLoading((prev) => ({
      ...prev,
      [orderId]: isLoading,
    }));
  };

  const handleProgressOrder = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrderActionLoading(orderId, true);

    try {
      let result;
      if (order.status === STEP_STATES.STEP1.WAITING) {
        result = await fetchGrabStatus({
          orderId: orderId,
        });
      } else {
        result = await fetchUpdateStatus({
          orderId: orderId,
        });
      }

      if (result.success) {
        const nextStatus = getNextStatus(order.status);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );
        message.success(`订单状态已更新为: ${getStatusDesc(nextStatus)}`);
      } else {
        message.error(result.errorMsg || "状态更新失败，请稍后重试");
      }
    } catch (error) {
      console.error("更新状态出错:", error);
      message.error("状态更新出错，请稍后重试");
    } finally {
      setOrderActionLoading(orderId, false);
    }
  };

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

  const showOrderDetail = (order) => {
    setCurrentOrder(order);
    setDetailModalVisible(true);
  };

  // 根据订单状态返回操作按钮 - 优化移动端显示
  const getActionButtons = (order) => {
    const isLoading = actionLoading[order.id] || false;

    // 移动端视图下简化按钮
    if (isMobile) {
      return (
        <Space size="small">
          <Button
            key="view"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(order)}
            disabled={isLoading}
            style={{ padding: "0 4px" }}
          >
            详情
          </Button>
          {order.status === STEP_STATES.STEP1.WAITING && (
            <Button
              key="accept"
              type="primary"
              size="small"
              onClick={() => handleProgressOrder(order.id)}
              loading={isLoading}
              disabled={isLoading}
            >
              接单
            </Button>
          )}
          {order.status !== STEP_STATES.STEP1.WAITING &&
            order.status !== STEP_STATES.STEP1.REJECTED &&
            order.status !== STEP_STATES.STEP2.FAILED &&
            order.status !== STEP_STATES.STEP3.DELIVERED && (
              <Button
                key="progress"
                type="primary"
                size="small"
                onClick={() => handleProgressOrder(order.id)}
                loading={isLoading}
                disabled={isLoading}
              >
                更新
              </Button>
            )}
        </Space>
      );
    }

    // 桌面视图下完整按钮
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

  // 优化表格列定义，根据屏幕尺寸调整
  const getColumns = () => {
    const baseColumns = [
      {
        title: "订单号",
        dataIndex: "id",
        key: "id",
        width: isMobile ? 80 : 100,
        ellipsis: true,
      },
      {
        title: "取件码",
        dataIndex: "expressId",
        key: "expressId",
        width: isMobile ? 80 : 120,
        ellipsis: true,
      },
      {
        title: "状态",
        key: "status",
        width: isMobile ? 80 : 100,
        render: (_, record) => (
          <Tag color={getStatusColor(record.status)}>
            {getStatusDesc(record.status)}
          </Tag>
        ),
      },
      {
        title: "操作",
        key: "action",
        width: isMobile ? 120 : 200,
        render: (_, record) => getActionButtons(record),
        fixed: isMobile ? "right" : false,
      },
    ];

    // 在非移动设备上添加更多列
    if (!isMobile) {
      baseColumns.splice(
        2,
        0,
        {
          title: "送达地址",
          dataIndex: "dormAdd",
          key: "dormAdd",
          ellipsis: true,
          width: 150,
        },
        {
          title: "联系电话",
          dataIndex: "iphoneNumber",
          key: "iphoneNumber",
          width: 120,
        },
        {
          title: "下单时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 120,
          render: (createTime) => {
            const date = new Date(createTime);
            return `${date.getMonth() + 1}/${date.getDate()} ${date
              .getHours()
              .toString()
              .padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
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
        }
      );
    }

    return baseColumns;
  };

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

  // 选项卡配置 - 优化移动端显示
  const tabItems = [
    {
      key: "all",
      label: isMobile ? `全部(${orders.length})` : `全部订单(${orders.length})`,
    },
    {
      key: "waiting",
      label: isMobile ? `待接单(${waitingCount})` : `待接单(${waitingCount})`,
    },
    {
      key: "processing",
      label: isMobile
        ? `处理中(${processingCount})`
        : `处理中(${processingCount})`,
    },
    {
      key: "completed",
      label: isMobile
        ? `已完成(${completedCount})`
        : `已完成(${completedCount})`,
    },
    {
      key: "failed",
      label: isMobile ? `已取消(${failedCount})` : `已取消(${failedCount})`,
    },
  ];

  // 添加组件样式
  const cardStyle = {
    boxShadow:
      "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)",
    borderRadius: "8px",
  };

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>订单管理中心</span>
          <Tooltip title="刷新订单">
            <Button
              type="primary"
              shape="circle"
              icon={<ReloadOutlined />}
              onClick={refreshOrders}
              size={isMobile ? "middle" : "large"}
            />
          </Tooltip>
        </div>
      }
      style={cardStyle}
      bodyStyle={{ padding: isMobile ? "12px" : "24px" }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="order-tabs"
        size={isMobile ? "small" : "middle"}
        tabBarStyle={{
          marginBottom: isMobile ? "8px" : "16px",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": { height: "4px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e8e8e8",
            borderRadius: "4px",
          },
        }}
      />

      <Table
        columns={getColumns()}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: !isMobile,
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
          showQuickJumper: !isMobile,
          size: isMobile ? "small" : "default",
          simple: isMobile,
        }}
        loading={loading}
        locale={{ emptyText: "暂无订单数据" }}
        size={isMobile ? "small" : "middle"}
        scroll={{ x: isMobile ? 400 : 1000 }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />

      {/* 订单详情模态框 */}
      {currentOrder && (
        <Modal
          title={
            <div
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "bold",
              }}
            >
              订单详情 - {currentOrder.expressId}
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          width={isMobile ? "95%" : 800}
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* 基本信息 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      color: "#333",
                    }}
                  >
                    订单信息
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>订单号：</span>
                      <span style={{ fontWeight: "500" }}>
                        {currentOrder.id}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>取件码：</span>
                      <span style={{ fontWeight: "500" }}>
                        {currentOrder.expressId}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>订单状态：</span>
                      <Tag color={getStatusColor(currentOrder.status)}>
                        {getStatusDesc(currentOrder.status)}
                      </Tag>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>下单时间：</span>
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
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      color: "#333",
                    }}
                  >
                    配送信息
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>送达地址：</span>
                      <span style={{ fontWeight: "500" }}>
                        {currentOrder.dormAdd}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>联系电话：</span>
                      <span>{currentOrder.iphoneNumber}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#666" }}>截止时间：</span>
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
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* 备注信息 */}
            <div
              style={{
                background: "#f5f5f5",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                备注信息
              </div>
              <div style={{ color: "#666" }}>
                {currentOrder.comment || "无"}
              </div>
            </div>

            {/* 包裹图片 */}
            {currentOrder.image && (
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#333",
                  }}
                >
                  包裹图片
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={currentOrder.image || "/placeholder.svg"}
                    alt="包裹图片"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 添加自定义样式 */}
      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-tbody > tr.table-row-light:hover > td,
        .ant-table-tbody > tr.table-row-dark:hover > td {
          background-color: #e6f7ff !important;
        }
        .order-tabs .ant-tabs-tab {
          padding: ${isMobile ? "8px 12px" : "12px 16px"};
        }
        .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          color: #1668dc;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            padding: 8px 4px !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default OrderManagement;
