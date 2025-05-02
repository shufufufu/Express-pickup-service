import { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  List,
  Tag,
  Empty,
  Spin,
  message,
  Typography,
  Popconfirm,
  Space,
  Badge,
  Modal,
} from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  SendOutlined,
  HistoryOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs"; // 导入dayjs用于日期处理
import {
  fetchReleaseBroadcast,
  fetchHistoryBroadcast,
  fetchDeleteBroadcast,
  fetchEditBroadcast,
} from "@/apis";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const AnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState("publish");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // 编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // 分页相关状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // 获取公告数据
  useEffect(() => {
    if (activeTab === "history") {
      fetchAnnouncements(pagination.current, pagination.pageSize);
    }
  }, [activeTab]);

  // 获取历史公告
  const fetchAnnouncements = (page = 1, pageSize = 5) => {
    setLoading(true);

    fetchHistoryBroadcast({ page, pageSize })
      .then((response) => {
        if (response.success && response.data) {
          // 处理返回的数据
          const formattedData = response.data.order.map((item) => ({
            id: item.id,
            deliverId: item.deliverId,
            title: item.title,
            content: item.content,
            // 将时间戳转换为日期格式
            startDate: dayjs(item.startTime).format("YYYY-MM-DD"),
            endDate: dayjs(item.endTime).format("YYYY-MM-DD"),
            status: item.status, // 0未展示，1当前展示中，2已过期
          }));

          setAnnouncements(formattedData);
          setPagination({
            ...pagination,
            current: page,
            total: response.data.total,
          });
        } else {
          messageApi.error(response.errorMsg || "获取公告列表失败");
        }
      })
      .catch((error) => {
        console.error("获取公告列表失败:", error);
        messageApi.error("获取公告列表失败，请稍后重试");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    fetchAnnouncements(page, pageSize);
  };

  // 处理发布公告
  const handlePublish = (values) => {
    setSubmitting(true);

    // 将日期转换为时间戳格式
    const startTime = values.displayPeriod[0].valueOf(); // 转换为时间戳
    const endTime = values.displayPeriod[1].valueOf(); // 转换为时间戳

    // 准备API请求参数
    const params = {
      title: values.title,
      content: values.content,
      startTime: startTime,
      endTime: endTime,
    };

    // 调用API发布公告
    fetchReleaseBroadcast(params)
      .then((response) => {
        if (response.success) {
          messageApi.success("公告发布成功！");
          form.resetFields();

          // 如果用户在历史标签页发布，刷新列表
          if (activeTab === "history") {
            fetchAnnouncements(pagination.current, pagination.pageSize);
          }
        } else {
          messageApi.error(response.errorMsg || "发布失败，请稍后重试");
        }
      })
      .catch((error) => {
        console.error("发布公告失败:", error);
        messageApi.error("发布失败，请稍后重试");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // 处理删除公告
  const handleDelete = (id) => {
    setLoading(true);

    fetchDeleteBroadcast({ id })
      .then((response) => {
        if (response.success) {
          messageApi.success("公告已删除");
          // 重新获取公告列表
          fetchAnnouncements(pagination.current, pagination.pageSize);
        } else {
          messageApi.error(response.errorMsg || "删除失败，请稍后重试");
        }
      })
      .catch((error) => {
        console.error("删除公告失败:", error);
        messageApi.error("删除失败，请稍后重试");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 打开编辑弹窗
  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement);

    // 重置表单，避免之前的值影响
    editForm.resetFields();

    // 设置表单初始值，包括日期
    editForm.setFieldsValue({
      title: announcement.title,
      content: announcement.content,
      // 将字符串日期转换为dayjs对象
      displayPeriod: [
        dayjs(announcement.startDate),
        dayjs(announcement.endDate),
      ],
    });

    setEditModalVisible(true);
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      setEditSubmitting(true);

      // 将日期转换为时间戳格式
      const startTime = values.displayPeriod[0].valueOf(); // 转换为时间戳
      const endTime = values.displayPeriod[1].valueOf(); // 转换为时间戳

      // 准备API请求参数
      const params = {
        id: editingAnnouncement.id,
        title: values.title,
        content: values.content,
        startTime: startTime,
        endTime: endTime,
      };

      // 调用API编辑公告
      fetchEditBroadcast(params)
        .then((response) => {
          if (response.success) {
            messageApi.success("公告已更新");
            setEditModalVisible(false);
            setEditingAnnouncement(null);

            // 重新获取公告列表
            fetchAnnouncements(pagination.current, pagination.pageSize);
          } else {
            messageApi.error(response.errorMsg || "更新失败，请稍后重试");
          }
        })
        .catch((error) => {
          console.error("更新公告失败:", error);
          messageApi.error("更新失败，请稍后重试");
        })
        .finally(() => {
          setEditSubmitting(false);
        });
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  // 关闭编辑弹窗
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingAnnouncement(null);
    editForm.resetFields();
  };

  // 根据状态判断公告状态
  const getAnnouncementStatus = (status) => {
    switch (status) {
      case 1:
        return { color: "blue", text: "待展示" };
      case 0:
        return { color: "success", text: "当前展示中" };
      case 2:
        return { color: "default", text: "已过期" };
      default:
        return { color: "default", text: "未知状态" };
    }
  };

  return (
    <Card title="公告管理" className="shadow-md">
      {contextHolder}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <SendOutlined />
              发布公告
            </span>
          }
          key="publish"
        />
        <TabPane
          tab={
            <span>
              <HistoryOutlined className="mr-1" />
              往期公告
            </span>
          }
          key="history"
        />
      </Tabs>

      {activeTab === "publish" ? (
        <div className="max-w-3xl mx-auto mt-4">
          <Card
            className="bg-gray-50"
            title={
              <div className="flex items-center">
                <NotificationOutlined className="text-blue-500 mr-2" />
                <span>新公告</span>
              </div>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePublish}
              requiredMark={false}
            >
              <Form.Item
                name="title"
                label="公告标题"
                rules={[{ required: true, message: "请输入公告标题" }]}
              >
                <Input placeholder="请输入公告标题" maxLength={20} showCount />
              </Form.Item>

              <Form.Item
                name="content"
                label="公告内容"
                rules={[{ required: true, message: "请输入公告内容" }]}
              >
                <TextArea
                  placeholder="请输入公告内容..."
                  rows={6}
                  maxLength={150}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="displayPeriod"
                label="展示时间段"
                rules={[{ required: true, message: "请选择展示时间段" }]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={["开始日期", "结束日期"]}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={submitting}
                  className="w-full h-10 text-base"
                >
                  发布公告
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ) : (
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" tip="加载中..." />
            </div>
          ) : announcements.length === 0 ? (
            <Empty description="暂无公告记录" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={announcements}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: handlePageChange,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条公告`,
              }}
              renderItem={(item) => {
                const statusInfo = getAnnouncementStatus(item.status);

                return (
                  <List.Item
                    key={item.id}
                    actions={[
                      <Space key="actions">
                        <Button type="text" icon={<EyeOutlined />} size="small">
                          查看详情
                        </Button>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => handleEditClick(item)}
                          disabled={item.status === 2} // 已过期的公告不能编辑
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="确定要删除此公告吗？"
                          onConfirm={() => handleDelete(item.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </Space>,
                    ]}
                    className={`p-4 rounded-lg mb-4 transition-all duration-300 hover:shadow-md ${
                      item.status === 0
                        ? "border-l-4 border-green-500 bg-green-50"
                        : item.status === 2
                        ? "border-l-4 border-gray-300 bg-gray-50"
                        : "border-l-4 border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <NotificationOutlined className="text-blue-500 mr-2" />
                        <Title level={5} className="m-0">
                          {item.title}
                        </Title>
                      </div>
                      <div>
                        <Badge
                          status={
                            statusInfo.color === "success"
                              ? "success"
                              : statusInfo.color === "blue"
                              ? "processing"
                              : "default"
                          }
                          text={
                            <Tag color={statusInfo.color}>
                              {statusInfo.text}
                            </Tag>
                          }
                        />
                      </div>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2, expandable: true, symbol: "展开" }}
                      className="mt-3 text-gray-700"
                    >
                      {item.content}
                    </Paragraph>

                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <CalendarOutlined className="mr-1" />
                      <span>
                        展示时间: {item.startDate} 至 {item.endDate}
                      </span>
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </div>
      )}

      {/* 编辑公告弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-blue-500 mr-2" />
            <span>编辑公告</span>
          </div>
        }
        open={editModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={editSubmitting}
            onClick={handleEditSave}
          >
            保存修改
          </Button>,
        ]}
        maskClosable={false}
        width={600}
      >
        {editingAnnouncement && (
          <Form
            form={editForm}
            layout="vertical"
            requiredMark={false}
            className="mt-4"
          >
            <Form.Item
              name="title"
              label="公告标题"
              rules={[{ required: true, message: "请输入公告标题" }]}
            >
              <Input placeholder="请输入公告标题" maxLength={20} showCount />
            </Form.Item>

            <Form.Item
              name="content"
              label="公告内容"
              rules={[{ required: true, message: "请输入公告内容" }]}
            >
              <TextArea
                placeholder="请输入公告内容..."
                rows={6}
                maxLength={150}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="displayPeriod"
              label="展示时间段"
              rules={[{ required: true, message: "请选择展示时间段" }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["开始日期", "结束日期"]}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default AnnouncementPage;
