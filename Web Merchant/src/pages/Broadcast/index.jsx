import { useState, useEffect } from "react"
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
} from "antd"
import {
  NotificationOutlined,
  CalendarOutlined,
  SendOutlined,
  HistoryOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import { generateMockAnnouncements } from "./components/mockData"

const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { TextArea } = Input
const { Title, Text, Paragraph } = Typography

const AnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState("publish")
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  // 获取公告数据
  useEffect(() => {
    if (activeTab === "history") {
      fetchAnnouncements()
    }
  }, [activeTab])

  const fetchAnnouncements = () => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      const data = generateMockAnnouncements()
      setAnnouncements(data)
      setLoading(false)
    }, 800)
  }

  // 处理发布公告
  const handlePublish = (values) => {
    setSubmitting(true)

    // 格式化日期范围
    const formattedValues = {
      ...values,
      displayPeriod: [values.displayPeriod[0].format("YYYY-MM-DD"), values.displayPeriod[1].format("YYYY-MM-DD")],
    }

    // 模拟API请求
    setTimeout(() => {
      console.log("发布公告:", formattedValues)
      messageApi.success("公告发布成功！")
      form.resetFields()
      setSubmitting(false)

      // 如果用户在历史标签页发布，刷新列表
      if (activeTab === "history") {
        fetchAnnouncements()
      }
    }, 1000)
  }

  // 处理删除公告
  const handleDelete = (id) => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((item) => item.id !== id))
      messageApi.success("公告已删除")
      setLoading(false)
    }, 500)
  }

  // 判断公告是否过期
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  // 判断公告是否当前展示
  const isActive = (startDate, endDate) => {
    const now = new Date()
    return new Date(startDate) <= now && new Date(endDate) >= now
  }

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
              <HistoryOutlined className="mr-1"/>
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
            <Form form={form} layout="vertical" onFinish={handlePublish} requiredMark={false}>
              <Form.Item name="title" label="公告标题" rules={[{ required: true, message: "请输入公告标题" }]}>
                <Input placeholder="请输入公告标题" maxLength={20} showCount />
              </Form.Item>

              <Form.Item name="content" label="公告内容" rules={[{ required: true, message: "请输入公告内容" }]}>
                <TextArea placeholder="请输入公告内容..." rows={6} maxLength={150} showCount />
              </Form.Item>

              <Form.Item
                name="displayPeriod"
                label="展示时间段"
                rules={[{ required: true, message: "请选择展示时间段" }]}
              >
                <RangePicker style={{ width: "100%" }} placeholder={["开始日期", "结束日期"]} />
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
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条公告`,
              }}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Space key="actions">
                      <Button type="text" icon={<EyeOutlined />} size="small">
                        查看详情
                      </Button>
                      <Button type="text" icon={<EditOutlined />} size="small">
                        编辑
                      </Button>
                      <Popconfirm
                        title="确定要删除此公告吗？"
                        onConfirm={() => handleDelete(item.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="text" icon={<DeleteOutlined />} danger size="small">
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>,
                  ]}
                  className={`p-4 rounded-lg mb-4 transition-all duration-300 hover:shadow-md ${
                    isActive(item.startDate, item.endDate)
                      ? "border-l-4 border-green-500 bg-green-50"
                      : isExpired(item.endDate)
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
                      {isActive(item.startDate, item.endDate) ? (
                        <Badge status="success" text={<Tag color="success">当前展示中</Tag>} />
                      ) : isExpired(item.endDate) ? (
                        <Badge status="default" text={<Tag color="default">已过期</Tag>} />
                      ) : (
                        <Badge status="processing" text={<Tag color="processing">待展示</Tag>} />
                      )}
                    </div>
                  </div>

                  <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "展开" }} className="mt-3 text-gray-700">
                    {item.content}
                  </Paragraph>

                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <CalendarOutlined className="mr-1" />
                    <span>
                      展示时间: {item.startDate} 至 {item.endDate}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </Card>
  )
}

export default AnnouncementPage

