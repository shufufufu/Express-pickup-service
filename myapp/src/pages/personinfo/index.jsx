import { View, Text } from '@tarojs/components'
import { Avatar, Toast, Button } from "@taroify/core"
import headpic from "../../assets/headpic2.png";
import { Arrow } from "@taroify/icons";
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { clearLoginInfo } from '../../utils/auth';
import LoginPopup from '../../components/LoginPopup';
import useAuthStore from '../../store/authStore';
import { fetchGetPersonInfo } from '../../apis';

export default function personinfo () {
  const [userInfo, setUserInfo] = useState(null);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const needLogin = useAuthStore((state) => state.needLogin);
  const setNeedLogin = useAuthStore((state) => state.setNeedLogin);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // 检查登录状态，获取用户信息
    if (!needLogin) {
      const storedUserInfo = Taro.getStorageSync('userInfo');
      // 获取后端个人信息
      fetchGetPersonInfo().then(({ data }) => {
        // 合并后端数据和本地数据，优先使用后端数据
        setUserInfo({
          ...storedUserInfo,
          avatarUrl: data.avatarUrl || storedUserInfo.avatarUrl,
          nickName: data.userName || storedUserInfo.nickName
        });
      }).catch(error => {
        console.error('获取后端个人信息失败:', error);
        setUserInfo(storedUserInfo);
      });
    } else {
      // 未登录则显示登录弹窗
      setTimeout(() => {
        setLoginPopupOpen(true);
      }, 500);
    }
  }, [needLogin]); // 添加登录状态作为依赖项
  
  // 处理跳转到个人信息修改页面
  const handleNavigateToChangeInfo = () => {
    // 检查登录状态
    if (needLogin) {
      // 直接显示登录弹窗
      setLoginPopupOpen(true);
      return;
    }
    
    Taro.navigateTo({
      url: '/pages/changeinfo/index'
    });
  };

  // 处理历史记录点击
  const handleNavigateToHistory = () => {
    // 检查登录状态
    if (needLogin) {
      setToastMessage("请先登录后再使用此功能");
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      return;
    }
    
    // TODO: 跳转到历史记录页面
    Taro.navigateTo({
      url: '/pages/historyorder/index'
    });
  };

  // 处理联系客服点击
  const handleContactService = () => {
    // 检查登录状态
    if (needLogin) {
      setToastMessage("请先登录后再使用此功能");
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      return;
    }
    
    // TODO: 实现联系客服功能
    Taro.showToast({
      title: '客服功能开发中',
      icon: 'none',
    });
  };

  // 修改建议与反馈处理函数
  const handleNavigateToFeedback = () => {
    // 检查登录状态
    if (needLogin) {
      setToastMessage("请先登录后再使用此功能");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    }
    
    Taro.navigateTo({
      url: '/pages/feedback/index'
    });
  };

  // 测试登录功能
  const testLogin = () => {
    // 清除登录相关的数据
    clearLoginInfo();
    // 更新状态
    setUserInfo(null);
    // 更新全局登录状态
    setNeedLogin(true);
    // 显示登录弹窗
    setLoginPopupOpen(true);
  };
  
  // 处理登录弹窗关闭
  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
    
    // 重新检查登录状态
    const needLogin = useAuthStore.getState().needLogin;
    if (!needLogin) {
      const storedUserInfo = Taro.getStorageSync('userInfo');
      setUserInfo(storedUserInfo);
    }
  };

  return (
    <View >
      <Toast open={showToast} onClose={() => setShowToast(false)}>
            {toastMessage}
          </Toast>
      {/* 头像 */}
      <View 
        className='flex items-start bg-[#ffffff] rounded-xl w-full h-20 pt-3'
        onClick={handleNavigateToChangeInfo}
      >
        <Avatar 
          src={userInfo ? userInfo.avatarUrl : headpic } 
          size="large" 
          className='ml-4'
        />
        <View className='ml-4 mt-1 flex flex-col justify-start text-lg'>
          {userInfo?.nickName || "未登录用户"}
          <View className='text-sm rounded-full w-16 pl-1'
          style={{background: "linear-gradient(to right, #d4eaf7, #b6ccd8)"}}>
            正式会员
          </View>
        </View>
        <View className='flex items-center mt-6 ml-auto mr-3 text-[#b6ccd8] text-xl'>
          <Arrow />
        </View>
      </View>

      {/* 功能 */}
      <View className="w-full mt-4 bg-white rounded-lg overflow-hidden">
        {/* 历史记录 */}
        <View 
          className="flex justify-between items-center px-3 py-4 border-b border-gray-100"
          onClick={handleNavigateToHistory}
        >
          <Text className="text-gray-600">历史记录</Text>
          <View className='flex items-center text-[#b6ccd8] text-xl'>
          <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 建议与反馈 */}
        <View 
          className="flex justify-between items-center px-3 py-4 border-b border-gray-100"
          onClick={handleNavigateToFeedback}
        >
          <Text className="text-gray-600">建议与反馈</Text>
          <View className='flex items-center text-[#b6ccd8] text-xl'>
          <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 联系客服 */}
        <View 
          className="flex justify-between items-center px-3 py-4 border-b border-gray-100"
          onClick={handleContactService}
        >
          <Text className="text-gray-600">联系客服</Text>
          <View className='flex items-center text-[#b6ccd8] text-xl'>
            <Arrow className='ml-2'/>
          </View>
        </View>
      </View>

      {/* 测试登录按钮 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && (
        <View className="test-login-container">
          <Button 
            className="test-login-button" 
            onClick={testLogin}
            style={{
              marginTop: '20px',
              background: '#ff9800',
              color: 'white',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              border: '2px dashed #f44336'
            }}
          >
            测试登录功能（仅开发环境）
          </Button>
          <Text 
            className="test-login-note"
            style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '8px',
              textAlign: 'center',
              display: 'block'
            }}
          >
            点击清除登录数据并显示登录弹窗
          </Text>
        </View>
      )}
      
      {/* 登录弹窗 */}
      <LoginPopup 
        open={loginPopupOpen} 
        onClose={handleCloseLoginPopup} 
      />
    </View>
  )
}
