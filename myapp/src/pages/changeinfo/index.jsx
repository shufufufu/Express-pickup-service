import { View, Text, Image, Input, Button } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import headpic from "../../assets/headpic2.png";
import { Arrow, Edit } from "@taroify/icons";

// 格式化手机号: 显示前3位和后4位，中间用星号代替
const formatPhone = (phone) => {
  if (!phone || phone.length < 7) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`;
};

export default function ChangeInfo() {
  // 本地存储的用户信息（头像、昵称等）
  const storedUserInfo = Taro.getStorageSync('userInfo') || {};
  const [userInfo, setUserInfo] = useState(storedUserInfo);
  // 从后端获取的用户信息（年龄、性别、电话）
  const [userInfoBack, setUserInfoBack] = useState({
    age: '', 
    gender: '', 
    phone: ''
  });
  
  // 编辑时的临时数据（分为本地数据和后端数据）
  const [editedUserInfo, setEditedUserInfo] = useState(userInfo);
  const [editedUserInfoBack, setEditedUserInfoBack] = useState(userInfoBack);
  
  // 是否有修改（显示保存按钮）
  const [modified, setModified] = useState(false);

  // 模拟加载后端数据（此处模拟数据，可替换为实际 API 调用）
  useEffect(() => {
    // 模拟后端返回的数据
    const backendData = {
      age: '25',
      gender: '男',
      phone: '13800138000'
    };
    setUserInfoBack(backendData);
    setEditedUserInfoBack(backendData);
  }, []);

  // 修改头像（模拟使用图片选择器）
  const handleEditAvatar = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1
      });
      // 这里可以上传图片后拿到新的图片 URL，此处直接取临时路径
      const newAvatar = res.tempFilePaths[0];
      setEditedUserInfo(prev => ({ ...prev, avatarUrl: newAvatar }));
      setModified(true);
    } catch (error) {
      console.error('选择图片失败', error);
    }
  };

  // 修改昵称时处理输入
  const handleNickNameChange = (e) => {
    setEditedUserInfo(prev => ({ ...prev, nickName: e.detail.value }));
    setModified(true);
  };

  // 修改后端字段：年龄、性别、手机号
  const handleBackFieldChange = (field, value) => {
    setEditedUserInfoBack(prev => ({ ...prev, [field]: value }));
    setModified(true);
  };

  // 复制用户ID
  const handleCopyUserId = () => {
    Taro.setClipboardData({
      data: userInfo.userId,
      success: function() {
        Taro.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  };

  // 点击编辑信息（例如点击某一行时触发提示，这里仅做提示，真正的编辑由输入框实现）
  const handleEditInfo = (field) => {
    Taro.showToast({
      title: `编辑${field}`,
      icon: 'none'
    });
  };

  // 点击保存按钮，提交修改
  const handleSave = () => {
    // 对于头像和昵称，将修改结果存入 localStorage，并更新 userInfo
    Taro.setStorageSync('userInfo', editedUserInfo);
    setUserInfo(editedUserInfo);
    
    // 对于后端字段（年龄、性别、手机号），模拟调用接口更新后端
    // 这里暂时仅模拟调用接口成功后的提示
    Taro.showToast({
      title: '后端数据更新成功',
      icon: 'success',
      duration: 2000
    });
    setUserInfoBack(editedUserInfoBack);

    // 重置修改状态
    setModified(false);
  };

  return (
    <View className="bg-gray-100 min-h-screen">
      {/* 头像区域 */}
      <View className="flex justify-center items-center py-10 relative">
        <Image 
          src={editedUserInfo.avatarUrl || headpic} 
          className="w-24 h-24 rounded-full" 
          onClick={handleEditAvatar}
        />
        <View 
          className="absolute bottom-10 right-[37%] bg-sky-300 text-white rounded-full w-6 h-6 flex items-center justify-center"
          onClick={handleEditAvatar}
        >
          <Edit />
        </View>
      </View>

      {/* 信息列表 */}
      <View className="mx-4 bg-white rounded-lg overflow-hidden">
        {/* 昵称：使用 Input 可编辑 */}
        <View className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
          <Text className="text-gray-600">昵称</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfo.nickName}
              placeholder="请输入昵称"
              onInput={handleNickNameChange}
              className="text-right"
            />
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 年龄 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
        >
          <Text className="text-gray-600">年龄</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfoBack.age}
              placeholder="未设置"
              onInput={(e) => handleBackFieldChange('age', e.detail.value)}
              className="text-right"
            />
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 性别 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
        >
          <Text className="text-gray-600">性别</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfoBack.gender}
              placeholder="未设置"
              onInput={(e) => handleBackFieldChange('gender', e.detail.value)}
              className="text-right"
            />
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 手机号 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
        >
          <Text className="text-gray-600">手机号</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfoBack.phone}
              placeholder="未设置"
              onInput={(e) => handleBackFieldChange('phone', e.detail.value)}
              className="text-right"
            />
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 用户ID，不可修改 */}
        <View className="flex justify-between items-center px-4 py-4">
          <Text className="text-gray-600">用户ID</Text>
          <View className="flex items-center">
            <Text>{userInfo.userId || '未设置'}</Text>
            <View 
              className="ml-2 border border-[#b6ccd8] text-[#b6ccd8] px-2 py-0.5 rounded text-xs"
              onClick={handleCopyUserId}
            >
              复制
            </View>
          </View>
        </View>
      </View>
      
      <View className='text-sm text-gray-300 mx-4 mt-4 mb-4'>
        根据《个人信息保护法》，您的个人信息仅用于快递代取服务，可随时修改或删除。
      </View>

      {/* 当有修改时显示保存按钮 */}
      {modified && (
        <View className="mx-4">
          <Button 
            type="primary" 
            onClick={handleSave}
            className="w-full"
          >
            保存
          </Button>
        </View>
      )}
    </View>
  );
}
