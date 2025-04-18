import { View, Text, Image, Input, Button } from '@tarojs/components';
import { Popup, Picker } from "@taroify/core";
import React, { useState, useEffect, useMemo } from 'react';
import Taro from '@tarojs/taro';
import headpic from "../../assets/headpic2.png";
import { Arrow, Edit } from "@taroify/icons";
import { getUserId } from "../../utils/auth";
import { fetchGetPersonInfo, fetchChangePersonInfo,fetchUserImages } from "../../apis";

// 格式化手机号：显示前3位和后4位，中间用星号代替
const formatPhone = (iphone) => {
  if (!iphone || iphone.length < 7) return iphone;
  return `${iphone.substring(0, 3)}****${iphone.substring(iphone.length - 4)}`;
};

// 电话号码校验函数：允许为空，否则必须是以 1 开头的11位数字
const validatePhoneNumber = (iphone) => {
  if (!iphone) return true;
  const pattern = /^1\d{10}$/;
  return pattern.test(iphone);
};

export default function ChangeInfo() {
  // 本地存储的用户信息（头像、昵称等）
  const storedUserInfo = Taro.getStorageSync('userInfo') || {};
  const [userInfo, setUserInfo] = useState(storedUserInfo);
  // 从后端获取的用户信息（年龄、性别、电话、头像、昵称）
  const [userInfoBack, setUserInfoBack] = useState({ age: '', gender: '', iphone: '', avatarUrl: '', userName: '' });
  
  // 编辑时的临时数据
  const [editedUserInfo, setEditedUserInfo] = useState(userInfo);
  const [editedUserInfoBack, setEditedUserInfoBack] = useState(userInfoBack);
  
  // 是否有修改（显示保存按钮）
  const [modified, setModified] = useState(false);

  // 控制弹窗显示：用于选择年龄和性别
  const [openAgePicker, setOpenAgePicker] = useState(false);
  const [ageValue, setAgeValue] = useState("");
  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const [genderValue, setGenderValue] = useState("");

  // 用户ID
  const userId = getUserId();

  // 生成年龄选项，从16岁到70岁
  const ageColumns = useMemo(() => {
    const columns = [];
    for (let i = 16; i <= 70; i++) {
      columns.push({ label: i.toString(), value: i.toString() });
    }
    return columns;
  }, []);

  // 性别选项
  const genderColumns = useMemo(() => [
    { label: "男", value: "男" },
    { label: "女", value: "女" },
    { label: "其他", value: "其他" },
  ], []);

  // 加载后端数据
  useEffect(() => {
    fetchGetPersonInfo().then(({ data }) => {
      setUserInfoBack(data);
      setEditedUserInfoBack(data);
      // 更新用户信息，优先使用后端数据
      setUserInfo(prev => ({
        ...prev,
        avatarUrl: data.avatarUrl || prev.avatarUrl,
        userName: data.userName || prev.userName
      }));
      setEditedUserInfo(prev => ({
        ...prev,
        avatarUrl: data.avatarUrl || prev.avatarUrl,
        userName: data.userName || prev.userName
      }));
    }).catch(error => {
      console.error('获取后端个人信息失败:', error);
    });
  }, []);

  // 修改头像（使用图片选择器）
  const handleEditAvatar = async () => {
    try {
      const res = await Taro.chooseImage({ count: 1 });
      const tempFilePath = res.tempFilePaths[0];
      
      // 仅在本地预览头像
      setEditedUserInfo(prev => ({ ...prev, avatarUrl: tempFilePath }));
      setModified(true);
    } catch (error) {
      console.error('选择头像失败', error);
      Taro.showToast({
        title: error.message || '选择头像失败',
        icon: 'error',
        duration: 2000
      });
    }
  };

  // 修改昵称时处理输入
  const handleNickNameChange = (e) => {
    setEditedUserInfo(prev => ({ ...prev, userName: e.detail.value }));
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
      success: () => Taro.showToast({ title: '复制成功', icon: 'success', duration: 2000 })
    });
  };

  // 点击保存按钮，提交修改
  const handleSave = async () => {
    // 电话号码校验：为空或合法才允许保存
    if (!validatePhoneNumber(editedUserInfoBack.iphone)) {
      Taro.showToast({
        title: '请输入正确的电话号码',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    try {
      let avatarUrl = editedUserInfo.avatarUrl;
      
      // 如果头像是本地临时文件路径，则先上传头像
      if (avatarUrl && avatarUrl.startsWith('http://tmp/') || avatarUrl.startsWith('wxfile://')) {
        const uploadResult = await fetchUserImages(avatarUrl);
        avatarUrl = uploadResult.data.imageUrl;
      }

      // 调用后端接口更新用户信息
      await fetchChangePersonInfo({
        userName: editedUserInfo.userName,
        age: editedUserInfoBack.age,
        gender: editedUserInfoBack.gender,
        iphone: editedUserInfoBack.iphone,
        avatarUrl: avatarUrl
      });

      // 更新状态
      setUserInfo({ ...editedUserInfo, avatarUrl });
      setUserInfoBack(editedUserInfoBack);
      setModified(false);

      Taro.showToast({ title: '修改成功', icon: 'success', duration: 2000 });
    } catch (error) {
      console.error('保存个人信息失败:', error);
      Taro.showToast({
        title: '保存失败，请稍后重试',
        icon: 'error',
        duration: 2000
      });
    }
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
        {/* 昵称：使用 Input 编辑 */}
        <View className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
          <Text className="text-gray-600">昵称</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfo.userName}
              placeholder="请输入昵称"
              onInput={handleNickNameChange}
              className="text-right"
            />
            <Arrow className="ml-2" />
          </View>
        </View>

        {/* 年龄：点击后弹出 Picker 弹窗 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          onClick={() => setOpenAgePicker(true)}
        >
          <Text className="text-gray-600">年龄</Text>
          <View className="flex items-center">
            <Text className="text-right">{ageValue || editedUserInfoBack.age || '未设置'}</Text>
            <Arrow className="ml-2" />
          </View>
        </View>

        {/* 性别：点击后弹出 Picker 弹窗 */}
        <View 
          className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          onClick={() => setOpenGenderPicker(true)}
        >
          <Text className="text-gray-600">性别</Text>
          <View className="flex items-center">
            <Text className="text-right">{genderValue || editedUserInfoBack.gender || '未设置'}</Text>
            <Arrow className="ml-2" />
          </View>
        </View>

        {/* 手机号 */}
        <View className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
          <Text className="text-gray-600">手机号</Text>
          <View className="flex items-center">
            <Input 
              value={editedUserInfoBack.iphone}
              placeholder="未设置"
              onInput={(e) => handleBackFieldChange('iphone', e.detail.value)}
              className="text-right"
            />
            <Arrow className="ml-2" />
          </View>
        </View>

        {/* 用户ID，不可修改 */}
        <View className="flex justify-between items-center px-4 py-4">
          <Text className="text-gray-600">用户ID</Text>
          <View className="flex items-center">
            <Text>{userId || '未设置'}</Text>
            <View 
              className="ml-2 border border-[#b6ccd8] text-[#b6ccd8] px-2 py-0.5 rounded text-xs"
              onClick={handleCopyUserId}
            >
              复制
            </View>
          </View>
        </View>
      </View>
      
      <View className="text-sm text-gray-300 mx-4 mt-4 mb-4">
        根据《个人信息保护法》，您的个人信息仅用于快递代取服务，可随时修改或删除。
      </View>

      {modified && (
        <View className="mx-4 mt-4">
          <Button 
            type="primary" 
            onClick={handleSave}
            className="w-full h-10 rounded-full flex items-center justify-center"
            style={{ 
              background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
              color:"black",
            }}
          >
            保存
          </Button>
        </View>
      )}

      {/* 底部弹窗：年龄 Picker */}
      <Popup 
        open={openAgePicker} 
        rounded 
        placement="bottom" 
        onClose={() => setOpenAgePicker(false)}
      >
        <Picker
          title="请选择年龄"
          cancelText="取消"
          confirmText="确认"
          columns={ageColumns}
          onCancel={() => setOpenAgePicker(false)}
          onConfirm={(selectedValue) => {
            setAgeValue(selectedValue);
            handleBackFieldChange('age', selectedValue);
            setOpenAgePicker(false);
          }}
        />
      </Popup>

      {/* 底部弹窗：性别 Picker */}
      <Popup 
        open={openGenderPicker} 
        rounded 
        placement="bottom" 
        onClose={() => setOpenGenderPicker(false)}
      >
        <Picker
          title="请选择性别"
          cancelText="取消"
          confirmText="确认"
          columns={genderColumns}
          onCancel={() => setOpenGenderPicker(false)}
          onConfirm={(selectedValue) => {
            setGenderValue(selectedValue);
            handleBackFieldChange('gender', selectedValue);
            setOpenGenderPicker(false);
          }}
        />
      </Popup>
    </View>
  );
}
