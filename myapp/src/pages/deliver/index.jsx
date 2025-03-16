import React, { useState, useEffect, useRef } from "react";
import { View } from "@tarojs/components";
import { Form, Cell, Field, Input, Button, Toast, Uploader,Empty } from "@taroify/core";
import Taro from "@tarojs/taro";
import LoginPopup from '../../components/LoginPopup';
import useAuthStore from '../../store/authStore';
import UnLogin from "../../assets/unlogin.png";

const Deliver = () => { 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  
  // 表单引用
  const formRef = useRef(null);
  
  // 初始化当前时间
  useEffect(() => {
    // 更新当前时间
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

  // 表单提交处理（图片单独上传，其他数据以 JSON 提交）
  const onSubmit = (event) => {
    const formData = event.detail.value;
    
    // 验证快递取件截图是否为空
    if (files.length === 0) {
      setToastMessage("请上传快递取件截图");
      setShowToast(true);
      return;
    }
    
    // 先单独上传图片（不处理返回的 imageUrl，由后端自行关联）
    Taro.uploadFile({
      url: "https://your-image-upload.com/upload", // 替换为你的图片上传接口地址
      filePath: files[0].url,           // 小程序本地临时文件路径
      name: "Image",                    // 后端接收图片的字段名
      // 图片上传成功与否不影响表单数据的提交
      success: (uploadRes) => {
        console.log("图片上传成功:", uploadRes);
      },
      fail: (uploadErr) => {
        console.error("图片上传失败:", uploadErr);
        Taro.showToast({
          title: "图片上传失败:" + uploadErr.errMsg,
          icon: "none"
        });
      }
    });
    
    // 再提交其他表单数据（JSON 格式，不包含图片信息）
    Taro.request({
      url: "https://example.com/submit", // 替换为你的表单数据提交接口地址
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: formData,
      success: (res) => {
        console.log("表单提交成功:", res.data);
        setToastMessage("提交成功：" + res.data);
        setShowToast(true);
      },
      fail: (err) => {
        console.error("表单提交失败:", err);
        setToastMessage("提交失败：" + err.errMsg);
        setShowToast(true);
      }
    });
    
    // 隔一段时间自动关闭 Toast
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

  // 处理登录弹窗关闭
  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  return (
    <>
    {useAuthStore.getState().needLogin ? 
    <View className="mt-32">
      <Empty>
      <Empty.Image
        className="custom-empty__image"
        src={UnLogin}
      />
      <Empty.Description>授权登录后使用完整功能</Empty.Description>
      <View className="mt-4">
      <Button shape="round" className="bottom-button w-40" style={{ 
                background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
                fontSize: "16px",
              }}
              onClick={() => setLoginPopupOpen(true)}
      >
        授权登录
      </Button>
  </View>
    </Empty>
  </View>
    :
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
            <Field label="备注" name="comment" rules={[{ required: false, message: "请填写备注" }]}>
              <Input placeholder="备注" />
            </Field>
            
            {/* 使用 Taroify 的 Uploader 组件 */}
            <Field label="快递取件截图(菜鸟驿站等)" name="uploader" rules={[{ required: true }]}>
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
            {currentTime && <Input value={currentTime} readOnly />}
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
    }
      
      
      {/* 登录弹窗 */}
      <LoginPopup 
        open={loginPopupOpen} 
        onClose={handleCloseLoginPopup} 
      />
    </>
  );
};

export default Deliver;
