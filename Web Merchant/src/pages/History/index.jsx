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
} from "antd";
import { EyeOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { generateMockOrders } from "./components/mockData";
import { getStatusDesc, getStatusColor } from "./components/utils";

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

  // 模拟获取订单数据
  const fetchOrders = (params = {}) => {
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
      queryParams.deliverId = 1; // 假设当前骑手ID为1
    }

    // 模拟API请求延迟
    setTimeout(() => {
      const result = generateMockOrders(queryParams);
      setOrders(result.data);
      setPagination({
        ...pagination,
        current: result.page,
        total: result.total,
      });
      setLoading(false);
    }, 500);
  };

  // 初始加载
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchOrders({ page: pagination.current });
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
    if (values.dateRange) {
      formattedFilters.beginTime = values.dateRange[0].startOf("day").valueOf();
      formattedFilters.endTime = values.dateRange[1].endOf("day").valueOf();
      delete formattedFilters.dateRange;
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
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>
            重置
          </Button>
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="所有历史订单" key="all" />
        <TabPane tab="本人历史订单" key="personal" />
      </Tabs>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1100 }}
      />

      {/* 筛选抽屉 */}
      <Modal
        title="筛选条件"
        open={filterVisible}
        onCancel={() => setFilterVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleFilterSubmit}>
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
                  <Select.Option value="STEP1_WAITING">待接单</Select.Option>
                  <Select.Option value="STEP1_ACCEPTED">已接单</Select.Option>
                  <Select.Option value="STEP1_REJECTED">已拒单</Select.Option>
                  <Select.Option value="STEP2_PICKING">取件中</Select.Option>
                  <Select.Option value="STEP2_SUCCESS">取件成功</Select.Option>
                  <Select.Option value="STEP2_FAILED">取件失败</Select.Option>
                  <Select.Option value="STEP3_DELIVERING">配送中</Select.Option>
                  <Select.Option value="STEP3_DELIVERED">已送达</Select.Option>
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
