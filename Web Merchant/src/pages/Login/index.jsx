import React, { useState } from "react";
import { Form, Input, Checkbox, Popconfirm, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import loginPic from "@/assets/login.jpg";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import OUP from "@/assets/OUP.png";
import { fetchLogin } from "@/apis/index";
import { useUserStore } from "@/store/index";

const LoginPage = () => {
  const [espanol, setEspanol] = useState(false);
  const [showPopconfirm, setShowPopconfirm] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 添加加载状态
  const setToken = useUserStore((state) => state.setToken);

  const onFinish = async (values) => {
    if (!espanol) {
      setShowPopconfirm(true);
      return;
    }

    try {
      setLoading(true); // 开始加载

      // 调用登录 API
      const result = await fetchLogin(values);

      if (result.success) {
        // 登录成功
        messageApi.success("登录成功");

        // 如果 API 返回了 token，存储到 localStorage
        if (result.data && result.data.token) {
          setToken(result.data.token);
        }

        // 延迟导航，让用户看到成功消息
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // 登录失败
        messageApi.error(result.errorMsg || "登录失败，请检查账号和密码");
      }
    } catch (error) {
      // 处理异常
      console.error("登录过程发生错误:", error);
      messageApi.error("登录失败，请稍后重试");
    } finally {
      setLoading(false); // 结束加载
    }
  };

  const handleConfirm = () => {
    setEspanol(true);
    setShowPopconfirm(false);
    // 重新提交表单
    const formInstance = document.querySelector('form[name="login_form"]');
    if (formInstance) {
      formInstance.requestSubmit();
    }
  };

  const handleCancel = () => {
    setShowPopconfirm(false);
  };

  return (
    <div
      className="flex min-h-screen w-full items-start justify-center bg-cover bg-center pt-20"
      style={{ backgroundImage: `url(${loginPic})` }}
    >
      {contextHolder}
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/20 p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-5">
          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/50">
            <img src={Logo || "/placeholder.svg"} alt="logo" className="h-10" />
          </div>
          <img src={OUP || "/placeholder.svg"} alt="oup" className="h-10" />

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-wider text-gray-700">
              Login
            </h1>
            <p className="text-sm text-gray-500 mt-1">请登录使用完整功能</p>
          </div>

          {/* Form */}
          <Form
            name="login_form"
            onFinish={onFinish}
            autoComplete="off"
            className="w-full space-y-4 pt-6"
          >
            <Form.Item
              name="account"
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
              name="passWord"
              rules={[{ required: true, message: "请输入密码！" }]}
            >
              <Input.Password
                size="large"
                placeholder="密码"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item>
              <Popconfirm
                title="提示"
                description="您需要同意用户协议和隐私政策才能继续"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                okText="同意"
                cancelText="取消"
                open={showPopconfirm}
              >
                <button
                  type="submit"
                  disabled={loading} // 禁用按钮当加载中
                  className="relative h-12 w-full text-xl rounded-full overflow-hidden text-gray-700 font-medium focus:outline-none group border border-sky-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#d4eaf7] to-[#b6ccd8] z-0"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#52bee5] to-[#b6ccd8] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></span>
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">
                    {loading ? "登录中..." : "登录"}
                  </span>
                </button>
              </Popconfirm>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="w-full text-sm">
            <div className="flex text-[#10B981]">
              <div className="flex items-center">
                <Checkbox
                  checked={espanol}
                  onChange={(e) => setEspanol(e.target.checked)}
                />
                <span className="ml-1">
                  授权即代表您同意《用户协议》和《隐私政策》
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="text-gray-500 text-base mt-4 ml-auto mr-6 flex">
                <div>还没有账号？</div>
                <div
                  className="ml-1 cursor-pointer hover:scale-125 hover:underline-offset-4 hover:underline hover:text-gray-700 transition-all duration-300"
                  onClick={() => navigate("/register")}
                >
                  注册账号
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
