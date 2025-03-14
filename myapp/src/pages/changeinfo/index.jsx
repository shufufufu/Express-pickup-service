import { View, Text, Image } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import headpic from "../../assets/headpic.jpg";
import { Arrow, Edit } from "@taroify/icons";

// 模拟后端数据 (包含完整手机号)
const mockUserInfo = {
  nickname: "束缚",
  age: 22,
  gender: "男",
  phone: "13312345950", // 完整手机号
  userId: "29814123",
  avatar: headpic
};

// 格式化手机号: 显示前3位和后4位，中间用星号代替
const formatPhone = (phone) => {
  if (!phone || phone.length < 7) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`;
};

export default function ChangeInfo() {
  // 数据状态
  const [userInfo, setUserInfo] = useState(mockUserInfo);

  // 模拟加载数据
  useEffect(() => {
    // 这里可以替换为实际的API调用
    // 例如: fetch('/api/userinfo').then(res => res.json()).then(data => setUserInfo(data));
  }, []);


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

  // 修改信息处理
  const handleEditInfo = (field) => {
    // 这里可以添加不同字段的编辑逻辑
    Taro.showToast({
      title: `编辑${field}`,
      icon: 'none'
    });
  };

  // 修改头像
  const handleEditAvatar = () => {
    Taro.showToast({
      title: '编辑头像',
      icon: 'none'
    });
  };

  return (
    <View className="bg-gray-100 min-h-screen">
      {/* 头像区域 */}
      <View className="flex justify-center items-center py-10 relative">
        <Image src={userInfo.avatar} className="w-24 h-24 rounded-full" onClick={handleEditAvatar}/>
        <View 
          className="absolute bottom-10 right-[37%] bg-sky-300 text-white rounded-full w-6 h-6 flex items-center justify-center"
          onClick={handleEditAvatar}
        >
          <Edit />
        </View>
      </View>

      {/* 信息列表 */}
      <View className="mx-4 bg-white rounded-lg overflow-hidden">
        {/* 昵称 */}
        <View className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
          <Text className="text-gray-600">昵称</Text>
          <View className='flex items-center'>
            <Text>
              {userInfo.nickname}
            </Text>
          <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 年龄 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          onClick={() => handleEditInfo('年龄')}
        >
          <Text className="text-gray-600">年龄</Text>
          <View className="flex items-center">
            <Text>{userInfo.age}</Text>
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 性别 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          onClick={() => handleEditInfo('性别')}
        >
          <Text className="text-gray-600">性别</Text>
          <View className="flex items-center">
            <Text>{userInfo.gender}</Text>
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 手机号 - 显示格式化的手机号，但保留完整号码在userInfo.phone中 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          onClick={() => handleEditInfo('手机号')}
        >
          <Text className="text-gray-600">手机号</Text>
          <View className="flex items-center">
            <Text>{formatPhone(userInfo.phone)}</Text>
            <Arrow className='ml-2'/>
          </View>
        </View>

        {/* 用户ID */}
        <View className="flex justify-between items-center px-4 py-4">
          <Text className="text-gray-600">用户ID</Text>
          <View className="flex items-center">
            <Text>{userInfo.userId}</Text>
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
        根据《个人信息保护法》，您的手机号仅用于快递代取服务，可随时修改或删除。
      </View>
    </View>
  );
} 