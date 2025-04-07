import { useState } from "react";
import { Form, Input, Checkbox, message, Tooltip } from "antd";
import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import OUP from "@/assets/OUP.png";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!agreedToTerms) {
      messageApi.warning("请先同意用户协议和隐私政策");
      return;
    }

    try {
      // TODO: 调用注册API
      // await registerUser(values);

      messageApi.open({
        type: "success",
        content: "注册成功",
      });

      console.log("表单数据:", values);
      navigate("/login");
    } catch (error) {
      messageApi.error(error.message || "注册失败，请重试");
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-start pt-20 justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/login.jpg')` }}
    >
      {contextHolder}
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/20 p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-5">
          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/50">
                      <img src={Logo} alt="logo" className="h-10"/>
                    </div>
                    <img src={OUP} alt="oup" className="h-10"/>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-wider text-gray-700">
              Register
            </h1>
            <p className="text-sm text-gray-500 mt-1">创建您的账号</p>
          </div>

          {/* Form */}
          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            autoComplete="off"
            className="w-full space-y-4 pt-6"
          >
            <Form.Item
              name="iphoneNumber"
              rules={[
                { required: true, message: "请输入手机号码！" },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: "请输入正确的手机号码格式！",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="手机号码"
                prefix={<UserOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码！" },
                { min: 6, message: "密码至少6个字符！" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="密码"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请确认密码！" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致！"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="确认密码"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              name="token"
              rules={[{ required: true, message: "请输入动态令牌！" }]}
            >
              <Input
                size="large"
                placeholder="动态令牌"
                prefix={<KeyOutlined className="text-gray-400" />}
                suffix={
                  <Tooltip title="动态令牌请联系客服获取">
                    <QuestionCircleOutlined className="text-gray-400 cursor-pointer" />
                  </Tooltip>
                }
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                className="relative h-12 w-full text-xl rounded-full overflow-hidden text-gray-700 font-medium focus:outline-none group border border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!agreedToTerms}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#d4eaf7] to-[#b6ccd8] z-0"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#52bee5] to-[#b6ccd8] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></span>
                <span className="relative z-20 group-hover:text-white transition-colors duration-500">
                  注册
                </span>
              </button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="w-full text-sm">
            <div className="flex text-[#10B981]">
              <div className="flex items-center">
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="ml-1">
                  授权即代表您同意《用户协议》和《隐私政策》
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="text-gray-500 text-base mt-4 ml-auto mr-6 flex">
                <div>已有账号？</div>
                <div
                  className="ml-1 cursor-pointer hover:scale-125 hover:underline-offset-4 hover:underline hover:text-gray-700 transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  立即登录
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
