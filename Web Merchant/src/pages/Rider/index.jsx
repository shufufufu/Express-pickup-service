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
  Form,
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
  PhoneOutlined,
} from "@ant-design/icons";
import { fetchDToken, fetchRiderInfo, fetchChangeRiderInfo } from "@/apis";
import { getRiderId } from "@/utils";

const { Title, Text } = Typography;
const { Option } = Select;

const PersonalCenter = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showTokenBox, setShowTokenBox] = useState(false);
  const [tokenText, setTokenText] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const riderId = getRiderId();

  // 获取用户数据
  const getUserData = async () => {
    try {
      setLoading(true);
      const res = await fetchRiderInfo();
      if (res.success) {
        // 处理性别字段，后端 0=女，1=男
        const genderValue = res.data.gender === 0 ? "female" : "male";

        const userData = {
          ...res.data,
          gender: genderValue,
          avatar: rider, // 使用提供的rider图片作为头像
          deliveredOrders: res.data.doneNumber || 0, // 总订单数
          weekDeliveredOrders: res.data.weekDoneNumber || 0, // 本周订单数
        };

        setUserData(userData);

        // 初始化编辑数据
        setEditData({
          name: userData.name,
          gender: genderValue,
          age: userData.age,
          phone: userData.phone,
        });
      } else {
        message.error(res.errorMsg || "获取用户信息失败");
      }
    } catch (error) {
      console.error("获取用户信息出错:", error);
      message.error("获取用户信息失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleEditToggle = () => {
    if (editing && hasChanges) {
      Modal.confirm({
        title: "确认取消",
        content: "您有未保存的更改，确定要放弃吗？",
        onOk: () => {
          setEditing(false);
          setEditData({
            name: userData.name,
            gender: userData.gender,
            age: userData.age,
            phone: userData.phone,
          });
          setHasChanges(false);
        },
      });
    } else {
      setEditing(!editing);
      if (!editing) {
        // 进入编辑模式时，初始化编辑数据
        setEditData({
          name: userData.name,
          gender: userData.gender,
          age: userData.age,
          phone: userData.phone,
        });
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
    setHasChanges(true);
  };

  // 保存用户信息
  const handleSave = async () => {
    try {
      setSaveLoading(true);

      // 转换性别为后端格式（0=女，1=男）
      const genderValue = editData.gender === "female" ? 0 : 1;

      // 调用修改用户信息接口
      const res = await fetchChangeRiderInfo({
        name: editData.name,
        gender: genderValue, // 转换为后端格式
        age: editData.age,
        phone: editData.phone,
      });

      if (res.success) {
        // 更新本地数据
        setUserData({
          ...userData,
          name: editData.name,
          gender: editData.gender, // 前端格式
          age: editData.age,
          phone: editData.phone,
        });
        setEditing(false);
        setHasChanges(false);
        message.success("个人信息已更新");
      } else {
        message.error(res.errorMsg || "更新个人信息失败");
      }
    } catch (error) {
      console.error("更新个人信息出错:", error);
      message.error("更新个人信息失败，请稍后重试");
    } finally {
      setSaveLoading(false);
    }
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
      if (response.data) {
        setTokenText(response.data);
        setShowTokenBox(true);
        message.success("动态令牌获取成功");
      } else {
        message.error(response.errorMsg || "动态令牌获取失败");
      }
    } catch (error) {
      console.error("获取动态令牌出错:", error);
      message.error("动态令牌获取失败，请稍后重试");
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(tokenText);
      message.success("已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
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
                loading={saveLoading}
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
                src={userData?.avatar}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <div className="mt-4 text-center">
                <Text strong className="text-lg">
                  {userData?.riderId}
                </Text>
                <div className="flex items-center justify-center mt-1">
                  <StarFilled className="text-yellow-500 mr-1" />
                  <Text>{userData?.favor}</Text>
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
                        value={editData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="请输入昵称"
                        maxLength={20}
                      />
                    ) : (
                      <Text strong className="text-lg">
                        {userData?.name}
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
                      联系电话
                    </Text>
                    {editing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="请输入联系电话"
                        maxLength={11}
                        addonBefore={<PhoneOutlined />}
                      />
                    ) : (
                      <div className="flex items-center">
                        <PhoneOutlined className="mr-2 text-gray-500" />
                        <Text>{userData?.phone}</Text>
                      </div>
                    )}
                  </div>

                  <div>
                    <Text type="secondary" className="block mb-1">
                      入职日期
                    </Text>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2 text-gray-500" />
                      <Text>
                        {userData?.joinTime
                          ? new Date(userData.joinTime)
                              .toLocaleDateString("zh-CN", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })
                              .replace(/\//g, "-")
                          : ""}
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Text type="secondary" className="block mb-1">
                      工作时长
                    </Text>
                    <Text>{calculateWorkDuration(userData?.joinTime)}</Text>
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
                    title="本周配送"
                    value={userData?.weekDeliveredOrders}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="text-center hover:shadow-md transition-shadow">
                  <Statistic
                    title="用户评分"
                    value={userData?.favor}
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

function calculateWorkDuration(joinTime) {
  if (!joinTime) return "";

  const startDate = new Date(joinTime);
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
