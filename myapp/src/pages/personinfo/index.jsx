import { View, Text } from '@tarojs/components'
import { Avatar, Cell, Button } from "@taroify/core"
import headpic from "../../assets/headpic.jpg";
import { Arrow } from "@taroify/icons";
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { checkLoginStatus, clearLoginInfo } from '../../utils/auth';
import LoginPopup from '../../components/LoginPopup';

export default function personinfo () {
  const [userInfo, setUserInfo] = useState(null);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  
  useEffect(() => {
    // 检查登录状态，获取用户信息
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
      const storedUserInfo = Taro.getStorageSync('userInfo');
      setUserInfo(storedUserInfo);
    } else {
      // 未登录则显示登录弹窗
      setTimeout(() => {
        setLoginPopupOpen(true);
      }, 500);
    }
  }, []);
  
  // 处理跳转到个人信息修改页面
  const handleNavigateToChangeInfo = () => {
    // 检查登录状态
    if (!checkLoginStatus()) {
      setLoginPopupOpen(true);
      return;
    }
    
    Taro.navigateTo({
      url: '/pages/changeinfo/index'
    });
  };

  // 处理跳转到反馈页面
  const handleNavigateToFeedback = () => {
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
    
    // 显示登录弹窗
    setLoginPopupOpen(true);
  };
  
  // 处理登录弹窗关闭
  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
    
    // 重新检查登录状态
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
      const storedUserInfo = Taro.getStorageSync('userInfo');
      setUserInfo(storedUserInfo);
    }
  };

  return (
    <View >
      {/* 头像 */}
      <View 
        className='flex items-start bg-[#ffffff] rounded-xl w-full h-20 pt-3'
        onClick={handleNavigateToChangeInfo}
      >
        <Avatar 
          src={userInfo?.avatarUrl || headpic} 
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
        <View className="flex justify-between items-center px-3 py-4 border-b border-gray-100">
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
