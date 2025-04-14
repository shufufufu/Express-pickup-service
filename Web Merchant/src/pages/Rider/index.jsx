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
  Modal,
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
  CopyOutlined,
} from "@ant-design/icons";
import { fetchDToken } from "@/apis";
import { getRiderId } from "@/utils";

const { Title, Text } = Typography;
const { Option } = Select;

const mockUserData = {
  avatar: rider,
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
  const [showTokenBox, setShowTokenBox] = useState(false);
  const [tokenText, setTokenText] = useState("");

  const riderId = getRiderId();

  useEffect(() => {
    setLoading(true);
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

  const handleEditToggle = () => {
    if (editing && hasChanges) {
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

  const handleInputChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    setLoading(true);
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

  const ageOptions = [];
  for (let i = 18; i <= 60; i++) {
    ageOptions.push(
      <Option key={i} value={i}>
        {i}岁
      </Option>
    );
  }

  const handleGetDToken = async () => {
    try {
      const response = await fetchDToken();
      if (response.success) {
        setTokenText(response.data);
        setShowTokenBox(true);
        message.success("动态令牌获取成功");
      } else {
        message.error("动态令牌获取失败");
      }
    } catch (error) {
      message.error("动态令牌获取失败");
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(tokenText);
      message.success("已复制到剪贴板");
    } catch (err) {
      message.error("复制失败");
    }
  };

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
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
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

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* 动态令牌区域 */}
      {riderId <= 3 && (
        <div className="mt-8">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleGetDToken}
          >
            获取动态令牌
          </Button>

          {showTokenBox && (
            <div className="mt-4 p-4 bg-gray-100 border rounded-md border-gray-400 flex items-center w-72">
              <Text code className="text-base break-all">
                {tokenText}
              </Text>
              <Button
                type="link"
                icon={<CopyOutlined />}
                onClick={handleCopyToken}
                className="ml-4"
              >
                复制
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
