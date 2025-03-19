import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Input } from '@tarojs/components';
import { Popup, Toast, Dialog } from '@taroify/core';
import { saveLoginInfo } from '../../utils/auth';
import headpic from "../../assets/headpic2.png";
import useAuthStore from '../../store/authStore';

const LoginPopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [hasUserDenied, setHasUserDenied] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const [userNickname, setUserNickname] = useState('');

  // 检查之前是否拒绝过授权
  useEffect(() => {
    if (open) {
      // 从缓存中读取授权状态
      const authStatus = Taro.getStorageSync('authStatus');
      setHasUserDenied(authStatus === 'denied');
    }
  }, [open]);

  // 显示toast消息
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // 处理头像选择
  const onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    setUserAvatar(avatarUrl);
  };

  // 处理昵称输入
  const onNicknameChange = (e) => {
    const { value } = e.detail;
    setUserNickname(value);
  };

  // 处理授权
  const handleAuthorize = async () => {
    // 设置默认头像和昵称
    const defaultAvatar = headpic;
    const defaultNickname = '普通用户';

    setLoading(true);
    try {
      // 获取登录凭证
      const loginRes = await Taro.login();
      console.log('获取到code:', loginRes.code);
      
      // 清除拒绝授权的记录
      Taro.setStorageSync('authStatus', 'accepted');
      setHasUserDenied(false);
      
      // 存储用户信息和token，使用用户提供的信息或默认值
      saveLoginInfo('mock_token_' + Date.now(), {
        avatarUrl: userAvatar || defaultAvatar,
        nickName: userNickname || defaultNickname
      });
      
      // 更新全局状态
      useAuthStore.getState().setNeedLogin(false);
      
      // 存储code供后端使用
      Taro.setStorageSync('code', loginRes.code);
      
      showToastMessage('授权成功');
      
      // 刷新所有页面
      const pages = Taro.getCurrentPages();
      pages.forEach(page => {
        if (typeof page.onShow === 'function') {
          page.onShow();
        }
      });
      
      // 关闭弹窗
      setTimeout(() => {
        onClose && onClose();
      }, 1000);
    } catch (error) {
      console.error('登录失败', error);
      
      // 判断是否是用户拒绝授权
      if (error.errMsg && (
        error.errMsg.indexOf('auth deny') > -1 || 
        error.errMsg.indexOf('authorize') > -1
      )) {
        console.log('用户拒绝授权:', error);
        
        // 记录用户拒绝授权
        Taro.setStorageSync('authStatus', 'denied');
        setHasUserDenied(true);
        
        // 显示设置引导弹窗
        setShowSettingsDialog(true);
      } else {
        showToastMessage('授权失败，请重试', 'fail');
      }
    } finally {
      setLoading(false);
    }
  };

  // 打开小程序设置页面
  const openSettings = () => {
    Taro.openSetting({
      success: (res) => {
        console.log('打开设置页面成功:', res);
        if (res.authSetting['scope.userInfo']) {
          showToastMessage('授权已更新，请重新登录');
          // 更新授权状态
          Taro.setStorageSync('authStatus', 'reset');
          setHasUserDenied(false);
        }
      },
      fail: (err) => {
        console.error('打开设置页面失败:', err);
        showToastMessage('打开设置页面失败', 'fail');
      },
      complete: () => {
        setShowSettingsDialog(false);
      }
    });
  };

  // 跳过登录（仅开发环境）
  const skipLogin = () => {
    // 使用默认信息
    saveLoginInfo(
      'dev_token_' + Date.now(), 
      {
        nickName: '测试用户',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
      }
    );
    
    showToastMessage('已跳过登录');
    
    setTimeout(() => {
      onClose && onClose();
    }, 1000);
  };

  // 清除拒绝记录
  const clearDeniedStatus = () => {
    Taro.setStorageSync('authStatus', '');
    setHasUserDenied(false);
    showToastMessage('已重置授权状态');
  };

  return (
    <>
      <Popup
        open={open}
        rounded
        overlay
        onClose={onClose}
        placement="bottom"
        className="login-popup-container"
        style={{height: 'auto'}}
      >
        <View className="bg-white rounded-t-2xl px-5 py-6 relative">
          {/* 顶部小横条 */}
          <View className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full" />
          
          {/* 标题区域 */}
          <View className="text-center mb-5">
            <Text className="text-lg font-medium text-gray-800">微信授权登录</Text>
            <Text className="block text-sm text-gray-500 mt-1">可选授权微信头像和昵称</Text>
          </View>
          
          {/* 当用户曾经拒绝过授权时，显示提示信息 */}
          {hasUserDenied && (
            <View className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Text className="text-sm text-yellow-700">
                您之前拒绝了授权请求。要继续使用完整功能，请点击"允许"重新授权，或点击"去设置"手动开启权限。
              </Text>
              <Button 
                className="mt-2 w-full py-1.5 text-sm text-yellow-600 bg-yellow-100 border-0 rounded"
                onClick={clearDeniedStatus}
              >
                重新尝试授权
              </Button>
            </View>
          )}
          
          {/* 描述区域 */}
          <View className="mb-6">
            <Text className="text-sm text-gray-700 mb-2 block">小程序将获取您的以下信息：</Text>
            <View className="flex items-center mb-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mr-2" />
              <Text className="text-sm text-gray-700">微信头像</Text>
            </View>
            <View className="flex items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-700 mr-2" />
              <Text className="text-sm text-gray-700">微信昵称</Text>
            </View>
          </View>
          
          {/* 隐私协议提示 */}
          <View className="mb-6">
            <Text className="text-xs text-gray-500 text-center block">
              授权即代表您同意《用户协议》和《隐私政策》
            </Text>
          </View>
          
          {/* 头像和昵称输入区域 */}
          <View className="mb-6">
            <Button
              openType="chooseAvatar"
              onChooseAvatar={onChooseAvatar}
              className="w-full mb-4 py-2 text-gray-700 bg-gray-100 border-0 rounded"
            >
              {userAvatar ? '重新选择头像' : '点击选择头像'}
            </Button>
            
            <Input
              type="nickname"
              className="w-full py-2 px-3 border border-gray-200 rounded"
              placeholder="请输入微信昵称"
              value={userNickname}
              onInput={onNicknameChange}
            />
          </View>
          
          {/* 按钮区域 */}
          <View className="flex">
            <Button 
              className={`w-full py-2 text-white bg-green-500 border-0 rounded ${loading ? 'opacity-70' : ''}`}
              loading={loading}
              disabled={loading}
              onClick={handleAuthorize}
            >
              {loading ? '授权中...' : '确认'}
            </Button>
          </View>
          
          {/* 如果用户之前拒绝过授权，显示"去设置"按钮 */}
          {hasUserDenied && (
            <Button
              className="w-full mt-3 py-1.5 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded"
              onClick={openSettings}
            >
              去设置开启授权
            </Button>
          )}
          
          {/* 开发环境跳过按钮 */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              className="w-full mt-3 py-1.5 text-sm text-gray-500 bg-gray-100 border-0 rounded"
              onClick={skipLogin}
            >
              开发环境跳过登录
            </Button>
          )}
        </View>
        
        {/* 提示信息 */}
        <Toast
          open={showToast}
          type={toastType}
          onClose={() => setShowToast(false)}
        >
          {toastMessage}
        </Toast>
      </Popup>
      
      {/* 设置引导弹窗 */}
      <Dialog open={showSettingsDialog} onClose={() => setShowSettingsDialog(false)}>
        <Dialog.Header>需要授权</Dialog.Header>
        <Dialog.Content>
          您需要打开设置页面并手动开启小程序的授权权限，以便使用完整功能。
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            className="text-gray-600" 
            onClick={() => setShowSettingsDialog(false)}
          >
            稍后再说
          </Button>
          <Button 
            className="text-blue-500" 
            onClick={openSettings}
          >
            去设置
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};

export default LoginPopup;
