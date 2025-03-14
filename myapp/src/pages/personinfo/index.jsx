import { View,Text} from '@tarojs/components'
import { Avatar } from "@taroify/core"
import headpic from "../../assets/headpic.jpg";
import { Arrow } from "@taroify/icons";
import Taro from '@tarojs/taro';


export default function personinfo () {
  
  // 处理跳转到个人信息修改页面
  const handleNavigateToChangeInfo = () => {
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

  return (
    <View >
      {/* 头像 */}
      <View 
        className='flex items-start bg-[#ffffff] rounded-xl w-full h-20 pt-3'
        onClick={handleNavigateToChangeInfo}
      >
        <Avatar src={headpic} size="large" className='ml-4'/>
        <View className='ml-4 mt-1 flex flex-col justify-start text-lg'>
          束缚
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
    </View>
  )
}
