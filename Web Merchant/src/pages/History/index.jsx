"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Typography,
  message,
  Spin,
  Empty,
} from "antd";
import {
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getStatusDesc, getStatusColor, STEP_STATES } from "./components/utils";
import { fetchHistoryOrder, fetchPHistoryOrder } from "@/apis"; // 假设我们将接口函数放在这个位置
import { getRiderId } from "@/utils/index"; // 获取骑手ID的函数
import { generateMockOrders } from "./components/mockData"; // 模拟数据，可选使用

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const HistoryOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [filterForm] = Form.useForm();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [useMockData, setUseMockData] = useState(false); // 是否使用模拟数据

  // 获取订单数据
  const fetchOrders = async (params = {}) => {
    setLoading(true);

    // 合并筛选条件
    const queryParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      ...params,
    };

    // 根据当前标签页筛选
    if (activeTab === "personal") {
      queryParams.deliverId = getRiderId(); // 获取当前骑手ID
    }

    try {
      let result;

      if (useMockData) {
        // 使用模拟数据
        const mockResult = generateMockOrders(queryParams);
        result = {
          success: true,
          data: {
            list: mockResult.data,
            total: mockResult.total,
          },
        };
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        // 使用真实API
        if (activeTab === "personal") {
          result = await fetchPHistoryOrder(queryParams);
        } else {
          result = await fetchHistoryOrder(queryParams);
        }
      }

      if (result.success) {
        setOrders(result.data.list || []);
        setPagination({
          ...pagination,
          current: queryParams.page,
          pageSize: queryParams.pageSize,
          total: result.data.total || 0,
        });
      } else {
        message.error(result.errorMsg || "获取订单数据失败");
        setOrders([]);
      }
    } catch (error) {
      console.error("获取订单数据出错:", error);
      message.error("获取订单数据出错，请稍后重试");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchOrders({ page: pagination.current, pageSize: pagination.pageSize });
  };

  // 查看订单详情
  const showOrderDetail = (order) => {
    setCurrentOrder(order);
    setDetailModalVisible(true);
  };

  // 处理筛选提交
  const handleFilterSubmit = (values) => {
    const formattedFilters = { ...values };

    // 处理日期范围
    if (values.dateRange && values.dateRange.length === 2) {
      formattedFilters.beginTime = values.dateRange[0].startOf("day").valueOf();
      formattedFilters.endTime = values.dateRange[1].endOf("day").valueOf();
      delete formattedFilters.dateRange;
    }

    // 将orderId映射到接口需要的参数名
    if (values.id) {
      formattedFilters.orderId = values.id;
      delete formattedFilters.id;
    }

    setFilters(formattedFilters);
    setPagination({ ...pagination, current: 1 });
    setFilterVisible(false);

    fetchOrders({
      page: 1,
      ...formattedFilters,
    });
  };

  // 重置筛选条件
  const resetFilters = () => {
    filterForm.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
    fetchOrders({ page: 1 });
  };

  // 移除单个筛选条件
  const removeFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
    fetchOrders({ page: 1, ...newFilters });
  };

  // 切换数据源（模拟/真实）
  const toggleDataSource = () => {
    setUseMockData(!useMockData);
    message.info(`已切换到${!useMockData ? "模拟" : "真实"}数据源`);
    fetchOrders({ page: 1 });
  };

  // 表格列定义
  const columns = [
    {
      title: "用户ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
    },
    {
      title: "用户昵称",
      dataIndex: "userName",
      key: "userName",
      width: 150,
    },
    {
      title: "骑手ID",
      dataIndex: "deliverId",
      key: "deliverId",
      width: 100,
    },
    {
      title: "订单号",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "取件码",
      dataIndex: "expressId",
      key: "expressId",
      width: 120,
    },
    {
      title: "手机号",
      dataIndex: "iphoneNumber",
      key: "iphoneNumber",
      width: 150,
    },
    {
      title: "下单时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusDesc(status)}</Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 获取筛选条件标签
  const renderFilterTags = () => {
    if (Object.keys(filters).length === 0) return null;

    return (
      <div className="flex flex-wrap items-center bg-blue-50 p-2 rounded-md mb-4">
        <span className="mr-2 text-gray-600">当前筛选条件:</span>
        {filters.userId && (
          <Tag
            closable
            onClose={() => removeFilter("userId")}
            className="mb-1 mr-2"
          >
            用户ID: {filters.userId}
          </Tag>
        )}
        {filters.deliverId && (
          <Tag
            closable
            onClose={() => removeFilter("deliverId")}
            className="mb-1 mr-2"
          >
            骑手ID: {filters.deliverId}
          </Tag>
        )}
        {filters.orderId && (
          <Tag
            closable
            onClose={() => removeFilter("orderId")}
            className="mb-1 mr-2"
          >
            订单号: {filters.orderId}
          </Tag>
        )}
        {filters.status && (
          <Tag
            closable
            onClose={() => removeFilter("status")}
            className="mb-1 mr-2"
          >
            状态: {getStatusDesc(filters.status)}
          </Tag>
        )}
        {filters.beginTime && filters.endTime && (
          <Tag
            closable
            onClose={() => {
              removeFilter("beginTime");
              removeFilter("endTime");
            }}
            className="mb-1 mr-2"
          >
            时间范围: {new Date(filters.beginTime).toLocaleDateString()} 至{" "}
            {new Date(filters.endTime).toLocaleDateString()}
          </Tag>
        )}
        <Button
          size="small"
          icon={<CloseCircleOutlined />}
          onClick={resetFilters}
          className="ml-auto"
        >
          清除所有
        </Button>
      </div>
    );
  };

  return (
    <Card
      title="历史订单查询"
      className="shadow-md"
      extra={
        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterVisible(true)}
          >
            筛选
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              resetFilters();
              fetchOrders();
            }}
          >
            刷新
          </Button>
          {/* 开发环境下显示切换数据源按钮 */}
          {import.meta.env.MODE === "development" && (
            <Button onClick={toggleDataSource}>
              {useMockData ? "使用真实数据" : "使用模拟数据"}
            </Button>
          )}
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
        <TabPane tab="所有历史订单" key="all" />
        <TabPane tab="本人历史订单" key="personal" />
      </Tabs>

      {/* 筛选条件标签 */}
      {renderFilterTags()}

      {/* 订单表格 */}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1100 }}
        className="border rounded-lg"
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无订单数据"
            />
          ),
        }}
      />

      {/* 筛选模态框 */}
      <Modal
        title="筛选条件"
        open={filterVisible}
        onCancel={() => setFilterVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={filterForm}
          layout="vertical"
          onFinish={handleFilterSubmit}
          className="p-2"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="userId" label="用户ID">
                <Input placeholder="请输入用户ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliverId" label="骑手ID">
                <Input placeholder="请输入骑手ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="订单号">
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="订单状态">
                <Select placeholder="请选择订单状态" allowClear>
                  <Select.Option value={STEP_STATES.STEP1.WAITING}>
                    待接单
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP1.ACCEPTED}>
                    已接单
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP1.REJECTED}>
                    已拒单
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP2.PICKING}>
                    取件中
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP2.SUCCESS}>
                    取件成功
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP2.FAILED}>
                    取件失败
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP3.DELIVERING}>
                    配送中
                  </Select.Option>
                  <Select.Option value={STEP_STATES.STEP3.DELIVERED}>
                    已送达
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="dateRange" label="时间范围">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                应用筛选
              </Button>
              <Button onClick={() => filterForm.resetFields()}>清空条件</Button>
              <Button onClick={() => setFilterVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 订单详情模态框 */}
      {currentOrder && (
        <Modal
          title="订单详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={700}
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="m-0">
                订单 #{currentOrder.id}
              </Title>
              <Tag
                color={getStatusColor(currentOrder.status)}
                className="text-base px-3 py-1"
              >
                {getStatusDesc(currentOrder.status)}
              </Tag>
            </div>

            <Divider />

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text type="secondary">用户信息</Text>
                <div className="mt-2 bg-white p-4 rounded-md shadow-sm">
                  <p>
                    <strong>用户ID:</strong> {currentOrder.userId}
                  </p>
                  <p>
                    <strong>用户昵称:</strong> {currentOrder.userName}
                  </p>
                  <p>
                    <strong>联系电话:</strong> {currentOrder.iphoneNumber}
                  </p>
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">配送信息</Text>
                <div className="mt-2 bg-white p-4 rounded-md shadow-sm">
                  <p>
                    <strong>骑手ID:</strong> {currentOrder.deliverId}
                  </p>
                  <p>
                    <strong>送达地址:</strong> {currentOrder.dormAdd}
                  </p>
                  <p>
                    <strong>下单时间:</strong>{" "}
                    {new Date(currentOrder.createTime).toLocaleString()}
                  </p>
                </div>
              </Col>
            </Row>

            <div className="mt-4">
              <Text type="secondary">订单信息</Text>
              <div className="mt-2 bg-white p-4 rounded-md shadow-sm">
                <p>
                  <strong>取件码:</strong>{" "}
                  <span className="text-lg font-bold text-blue-600">
                    {currentOrder.expressId}
                  </span>
                </p>
                <p>
                  <strong>备注:</strong> {currentOrder.comment || "无备注"}
                </p>
              </div>
            </div>

            {currentOrder.image && (
              <div className="mt-4">
                <Text type="secondary">包裹图片</Text>
                <div className="mt-2 bg-white p-4 rounded-md shadow-sm flex justify-center">
                  <img
                    src={currentOrder.image || "/placeholder.svg"}
                    alt="包裹图片"
                    className="max-w-full h-auto max-h-[200px] rounded-md"
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

export default HistoryOrders;
