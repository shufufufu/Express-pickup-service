import { useState, useEffect } from "react";
import rider from "@/assets/rider.png";
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Row,
  Col,
  Input,
  Select,
  Button,
  Statistic,
  message,
  Spin,
  Space,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  StarFilled,
  ShoppingOutlined,
  EditOutlined,
  SaveOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟用户数据
const mockUserData = {
  avatar: rider, // 假设头像路径
  nickname: "骑手小王",
  gender: "male",
  age: 28,
  riderId: "R10086",
  employmentDate: "2023-06-15",
  deliveredOrders: 1568,
  rating: 5.0,
};

const PersonalCenter = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // 模拟获取用户数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setUserData(mockUserData);
      setEditData({
        nickname: mockUserData.nickname,
        gender: mockUserData.gender,
        age: mockUserData.age,
      });
      setLoading(false);
    }, 500);
  }, []);

  // 处理编辑模式切换
  const handleEditToggle = () => {
    if (editing && hasChanges) {
      // 如果正在编辑且有更改，询问是否放弃更改
      if (window.confirm("您有未保存的更改，确定要放弃吗？")) {
        setEditing(false);
        setEditData({
          nickname: userData.nickname,
          gender: userData.gender,
          age: userData.age,
        });
        setHasChanges(false);
      }
    } else {
      setEditing(!editing);
    }
  };

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
    setHasChanges(true);
  };

  // 处理保存
  const handleSave = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setUserData({
        ...userData,
        ...editData,
      });
      setEditing(false);
      setHasChanges(false);
      setLoading(false);
      message.success("个人信息已更新");
    }, 800);
  };

  // 生成年龄选项
  const ageOptions = [];
  for (let i = 18; i <= 60; i++) {
    ageOptions.push(
      <Option key={i} value={i}>
        {i}岁
      </Option>
    );
  }

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">
            个人中心
          </Title>
          {!editing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditToggle}
            >
              编辑资料
            </Button>
          ) : (
            <Space>
              <Button onClick={handleEditToggle}>取消</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!hasChanges}
              >
                保存更改
              </Button>
            </Space>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          {/* 基本信息区域 */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* 头像 */}
            <div className="flex flex-col items-center">
              <Avatar
                size={120}
                src={userData?.avatar || "/placeholder.svg"}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <div className="mt-4 text-center">
                <Text strong className="text-lg">
                  {userData?.riderId}
                </Text>
                <div className="flex items-center justify-center mt-1">
                  <StarFilled className="text-yellow-500 mr-1" />
                  <Text>{userData?.rating}</Text>
                </div>
              </div>
            </div>

            {/* 个人信息 */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 可编辑信息 */}
                <div className="space-y-4">
                  <div>
                    <Text type="secondary" className="block mb-1">
                      昵称
                    </Text>
                    {editing ? (
                      <Input
                        value={editData.nickname}
                        onChange={(e) =>
                          handleInputChange("nickname", e.target.value)
                        }
                        placeholder="请输入昵称"
                        maxLength={20}
                      />
                    ) : (
                      <Text strong className="text-lg">
                        {userData?.nickname}
                      </Text>
                    )}
                  </div>

                  <div>
                    <Text type="secondary" className="block mb-1">
                      性别
                    </Text>
                    {editing ? (
                      <Select
                        value={editData.gender}
                        onChange={(value) => handleInputChange("gender", value)}
                        style={{ width: "100%" }}
                      >
                        <Option value="male">
                          <ManOutlined className="text-blue-500 mr-1" /> 男
                        </Option>
                        <Option value="female">
                          <WomanOutlined className="text-pink-500 mr-1" /> 女
                        </Option>
                      </Select>
                    ) : (
                      <div className="flex items-center">
                        {userData?.gender === "male" ? (
                          <>
                            <ManOutlined className="text-blue-500 mr-1" />
                            <Text>男</Text>
                          </>
                        ) : (
                          <>
                            <WomanOutlined className="text-pink-500 mr-1" />
                            <Text>女</Text>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Text type="secondary" className="block mb-1">
                      年龄
                    </Text>
                    {editing ? (
                      <Select
                        value={editData.age}
                        onChange={(value) => handleInputChange("age", value)}
                        style={{ width: "100%" }}
                      >
                        {ageOptions}
                      </Select>
                    ) : (
                      <Text>{userData?.age}岁</Text>
                    )}
                  </div>
                </div>

                {/* 不可编辑信息 */}
                <div className="space-y-4">
                  <div>
                    <Text type="secondary" className="block mb-1">
                      入职日期
                    </Text>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2 text-gray-500" />
                      <Text>{userData?.employmentDate}</Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" className="block mb-1">
                      工作时长
                    </Text>
                    <Text>
                      {calculateWorkDuration(userData?.employmentDate)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* 统计数据 */}
          <div className="mt-8">
            <Title level={4}>工作统计</Title>
            <Row gutter={[24, 24]} className="mt-4">
              <Col xs={24} sm={12} md={8}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <Statistic
                    title="总配送订单"
                    value={userData?.deliveredOrders}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <Statistic
                    title="本月配送"
                    value={Math.floor(userData?.deliveredOrders * 0.12)}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <Statistic
                    title="用户评分"
                    value={userData?.rating}
                    precision={1}
                    prefix={<StarFilled />}
                    suffix="/ 5"
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

// 计算工作时长
function calculateWorkDuration(employmentDate) {
  if (!employmentDate) return "";

  const startDate = new Date(employmentDate);
  const today = new Date();

  const yearDiff = today.getFullYear() - startDate.getFullYear();
  const monthDiff = today.getMonth() - startDate.getMonth();

  if (monthDiff < 0) {
    return `${yearDiff - 1}年${monthDiff + 12}个月`;
  } else {
    return `${yearDiff}年${monthDiff}个月`;
  }
}

export default PersonalCenter;
