import React, { useState, useEffect, useRef } from "react";
import { View } from "@tarojs/components";
import { Form, Cell, Field, Input, Button, Toast, Uploader } from "@taroify/core";
import Taro from "@tarojs/taro";

const Deliver = () => { 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  
  // 表单引用
  const formRef = useRef(null);
  
  // 初始化当前时间
  useEffect(() => {
    updateCurrentTime();
  }, []);
  
  // 更新当前时间格式为 YYYY-MM-DD HH:MM
  const updateCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}`);
  };

  // 表单提交处理
  const onSubmit = (event) => {
    const formData = event.detail.value;
    
    // 验证快递取件截图是否为空
    if (files.length === 0) {
      setToastMessage("请上传快递取件截图");
      setShowToast(true);
      return;
    }
    
    // 如果有图片，添加到表单数据
    if (files.length > 0) {
      // 实际应用中，这里可以使用 Taro.uploadFile 上传文件到服务器
      formData.imageFile = files[0];
    }
    
    // 显示表单数据（开发测试用）
    setToastMessage(JSON.stringify(formData));
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 上传图片处理函数
  const onUploadImages = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then((res) => {
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        const tempFilePath = res.tempFilePaths[0];
        
        // 使用新API获取文件信息
        const fsm = Taro.getFileSystemManager();
        fsm.getFileInfo({
          filePath: tempFilePath,
          success: (fileInfo) => {
            const newFile = {
              url: tempFilePath,
              type: "image",
              name: tempFilePath.substring(tempFilePath.lastIndexOf('/') + 1),
              size: fileInfo.size
            };
            
            setFiles([...files, newFile]);
          },
          fail: () => {
            const newFile = {
              url: tempFilePath,
              type: "image",
              name: tempFilePath.substring(tempFilePath.lastIndexOf('/') + 1)
            };
            
            setFiles([...files, newFile]);
          }
        });
      }
    }).catch(err => {
      console.error("选择图片失败:", err);
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    });
  };
  
  // 删除文件处理函数
  const onDeleteFile = (file) => {
    const newFiles = files.filter((item) => item.url !== file.url);
    setFiles(newFiles);
  };

  // 处理表单重置确认
  const confirmReset = () => {
    Taro.showModal({
      title: '确认重置',
      content: '确定要重置吗？所有已填写的信息将被清空。',
      success: function (res) {
        if (res.confirm) {
          // 手动重置表单
          if (formRef.current) {
            formRef.current.reset();
          }
          
          // 清空上传的图片
          setFiles([]);
          
          // 更新时间
          updateCurrentTime();
          
          // 显示提示
          Taro.showToast({
            title: '表单已重置',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  };

  return (
    <View>
      <Form 
        ref={formRef}
        onSubmit={onSubmit}
      >
        <Toast open={showToast} onClose={() => setShowToast(false)}>
          {toastMessage}
        </Toast>
        
        <Cell.Group inset>
          <Field label="取件码" name="expressid" rules={[{ required: true, message: "请填写取件码" }]}>
            <Input placeholder="取件码" />
          </Field>
          <Field label="地址" name="dromadd" rules={[{ required: true, message: "请填写地址" }]}>
            <Input placeholder="地址" />
          </Field>
          <Field label="电话号码" name="Phonenumber" rules={[{ required: true, message: "请填写电话号码" }]}>
            <Input placeholder="电话号码" />
          </Field>
          
          {/* 使用Taroify的Uploader组件 */}
          <Field label="快递取件截图(菜鸟驿站等)" name="uploader" rules={[{ required: true}]}>
            <Uploader
              value={files}
              maxFiles={1}
              onChange={setFiles}
              onDelete={onDeleteFile}
              onUpload={onUploadImages}
            />
          </Field>

          {/* 自动填充时间字段 */}
          <Field label="提交时间" name="submitTime" initialValue={currentTime}>
            <Input value={currentTime} readOnly />
          </Field>
        </Cell.Group>
        
        {/* 按钮组 */}
        <View style={{ margin: "16px", display: "flex", gap: "10px" }}>
          <Button 
            style={{ 
              flex: 1,
              background: "#f5f5f5",
              border: "none",
              color: "#666666"
            }}
            onClick={confirmReset}
          >
            重置
          </Button>
          <Button 
            style={{ 
              flex: 2,
              background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
              border: "none",
              color: "#000000"
            }}
            formType="submit"
          >
            提交订单
          </Button>
        </View>
      </Form>
    </View>
  );
};

export default Deliver;
