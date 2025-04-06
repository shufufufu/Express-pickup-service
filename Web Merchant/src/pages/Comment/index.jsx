import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Empty,
  Pagination,
  Select,
  Input,
  Space,
  Tag,
  Modal,
  message,
  Spin,
  Badge,
  Typography,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  CheckOutlined,
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { generateMockFeedbacks } from "./components/mockData";

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(undefined);

  // 获取反馈数据
  const fetchFeedbacks = (params = {}) => {
    setLoading(true);

    // 合并筛选条件
    const queryParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      ...params,
    };

    // 模拟API请求延迟
    setTimeout(() => {
      const result = generateMockFeedbacks(queryParams);

      // 对结果进行排序：未读在前，已读在后，每组内按时间降序排列（新的在前）
      const sortedFeedbacks = [...result.data].sort((a, b) => {
        // 首先按照阅读状态排序（未读在前）
        if (a.feedBackStatus !== b.feedBackStatus) {
          return a.feedBackStatus - b.feedBackStatus;
        }
        // 然后按照时间降序排序（新的在前）
        return b.feedBackTime - a.feedBackTime;
      });

      setFeedbacks(sortedFeedbacks);
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
    fetchFeedbacks();
  }, []);

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
    fetchFeedbacks({ page, pageSize });
  };

  // 应用筛选
  const applyFilters = () => {
    const newFilters = {};

    if (userId) {
      newFilters.userId = userId;
    }

    if (status !== undefined) {
      newFilters.feedBackStatus = status;
    }

    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
    fetchFeedbacks({ page: 1, ...newFilters });
  };

  // 重置筛选
  const resetFilters = () => {
    setUserId("");
    setStatus(undefined);
    setFilters({});
    setPagination({ ...pagination, current: 1 });
    fetchFeedbacks({ page: 1 });
  };

  // 标记单个反馈为已读
  const markAsRead = (id) => {
    // 模拟API请求
    setLoading(true);
    setTimeout(() => {
      // 更新反馈状态
      const updatedFeedbacks = feedbacks.map((feedback) =>
        feedback.id === id
          ? { ...feedback, feedBackStatus: 1, deliverId: 1 } // 假设当前骑手ID为1
          : feedback
      );

      // 重新排序：未读在前，已读在后，每组内按时间降序排列
      const sortedFeedbacks = [...updatedFeedbacks].sort((a, b) => {
        // 首先按照阅读状态排序（未读在前）
        if (a.feedBackStatus !== b.feedBackStatus) {
          return a.feedBackStatus - b.feedBackStatus;
        }
        // 然后按照时间降序排序（新的在前）
        return b.feedBackTime - a.feedBackTime;
      });

      setFeedbacks(sortedFeedbacks);
      setLoading(false);
      message.success("已标记为已读");
    }, 300);
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    Modal.confirm({
      title: "确认操作",
      content: "确定要将所有未读反馈标记为已读吗？",
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          // 更新所有未读反馈为已读
          const updatedFeedbacks = feedbacks.map((feedback) => ({
            ...feedback,
            feedBackStatus: 1,
            deliverId: feedback.feedBackStatus === 0 ? 1 : feedback.deliverId, // 只更新未读的
          }));

          // 重新排序：未读在前，已读在后，每组内按时间降序排列
          const sortedFeedbacks = [...updatedFeedbacks].sort((a, b) => {
            // 首先按照阅读状态排序（未读在前）
            if (a.feedBackStatus !== b.feedBackStatus) {
              return a.feedBackStatus - b.feedBackStatus;
            }
            // 然后按照时间降序排序（新的在前）
            return b.feedBackTime - a.feedBackTime;
          });

          setFeedbacks(sortedFeedbacks);
          setLoading(false);
          message.success("已全部标记为已读");
        }, 500);
      },
    });
  };

  // 获取未读反馈数量
  const getUnreadCount = () => {
    return feedbacks.filter((feedback) => feedback.feedBackStatus === 0).length;
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between h-16">
          <span>用户建议与反馈</span>
          <Badge
            count={getUnreadCount()}
            overflowCount={99}
            className="mr-6 mt-2"
          >
            <span className="mr-3">未读反馈</span>
          </Badge>
        </div>
      }
      className="shadow-md"
      extra={
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={markAllAsRead}
          disabled={getUnreadCount() === 0}
        >
          全部标为已读
        </Button>
      }
    >
      {/* 筛选区域 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6} lg={5}>
            <Input
              placeholder="用户ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              prefix={<UserOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={5}>
            <Select
              placeholder="阅读状态"
              value={status}
              onChange={(value) => setStatus(value)}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value={0}>未读</Option>
              <Option value={1}>已读</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={12} lg={14}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={applyFilters}
              >
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 反馈列表 */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : feedbacks.length === 0 ? (
        <Empty
          description="暂无反馈数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-20"
        />
      ) : (
        <div className="space-y-4">
          {/* 未读反馈分组标题 */}
          {feedbacks.some((f) => f.feedBackStatus === 0) && (
            <div className="bg-blue-50 px-4 py-2 rounded-md border-l-4 border-blue-500 mb-2">
              <Text strong className="text-blue-700">
                未读反馈
              </Text>
            </div>
          )}

          {/* 未读反馈列表 */}
          {feedbacks
            .filter((feedback) => feedback.feedBackStatus === 0)
            .map((feedback) => (
              <Card
                key={feedback.id}
                className="transition-all duration-300 hover:shadow-md border-blue-300 bg-blue-50"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* 左侧用户信息 */}
                  <div className="md:w-1/5 flex flex-col space-y-2">
                    <div className="flex items-center">
                      <UserOutlined className="mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">{feedback.userName}</div>
                        <div className="text-xs text-gray-500">
                          ID: {feedback.userId}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      {new Date(feedback.feedBackTime).toLocaleString()}
                    </div>
                    <div>
                      <Tag icon={<ClockCircleOutlined />} color="blue">
                        未读
                      </Tag>
                    </div>
                  </div>

                  {/* 右侧反馈内容 */}
                  <div className="md:w-4/5">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center mb-2">
                        <CommentOutlined className="mr-2 text-blue-500" />
                        <Text strong>反馈内容</Text>
                      </div>
                      <Paragraph className="whitespace-pre-line">
                        {feedback.comment}
                      </Paragraph>
                    </div>

                    {/* 操作按钮 */}
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => markAsRead(feedback.id)}
                      >
                        标记为已读
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

          {/* 已读反馈分组标题 */}
          {feedbacks.some((f) => f.feedBackStatus === 1) && (
            <div className="bg-gray-50 px-4 py-2 rounded-md border-l-4 border-gray-400 mb-2 mt-6">
              <Text strong className="text-gray-700">
                已读反馈
              </Text>
            </div>
          )}

          {/* 已读反馈列表 */}
          {feedbacks
            .filter((feedback) => feedback.feedBackStatus === 1)
            .map((feedback) => (
              <Card
                key={feedback.id}
                className="transition-all duration-300 hover:shadow-md border-gray-200"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* 左侧用户信息 */}
                  <div className="md:w-1/5 flex flex-col space-y-2">
                    <div className="flex items-center">
                      <UserOutlined className="mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">{feedback.userName}</div>
                        <div className="text-xs text-gray-500">
                          ID: {feedback.userId}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      {new Date(feedback.feedBackTime).toLocaleString()}
                    </div>
                    <div>
                      <Tag icon={<CheckCircleOutlined />} color="green">
                        已读 (骑手ID: {feedback.deliverId})
                      </Tag>
                    </div>
                  </div>

                  {/* 右侧反馈内容 */}
                  <div className="md:w-4/5">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center mb-2">
                        <CommentOutlined className="mr-2 text-blue-500" />
                        <Text strong>反馈内容</Text>
                      </div>
                      <Paragraph className="whitespace-pre-line">
                        {feedback.comment}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* 分页 */}
      {!loading && feedbacks.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条反馈`}
          />
        </div>
      )}
    </Card>
  );
};

export default FeedbackPage;
