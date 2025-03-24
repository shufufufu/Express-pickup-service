import { View, Text } from "@tarojs/components";
import { Button, Image, Cell, Loading, Avatar, SwipeCell } from "@taroify/core";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Arrow, ArrowLeft, PhotoOutlined, CommentOutlined, LocationOutlined, ClockOutlined, PhoneOutlined, StarOutlined } from "@taroify/icons";
import { useReady } from '@tarojs/taro';
import React,{ useState ,useEffect} from 'react';
import rider from "../../assets/rider.png";
import dayjs from "dayjs";

// 模拟快递员数据
const courierInfo = {
  name: "张师傅",
  avatar: rider,
  phone: "138****6789",
  rating: 5.0,
  deliveryCount: 1024,
  joinDate: "2022-01-01"
};
const HistoryOrderInfo =() => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [historyOrderInfo, setHistoryOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取路由参数
    const params = getCurrentInstance().router.params;
    console.log("params",params)
    console.log("params",'123123')
    const { id, expressid, dromadd, ordertime } = params;
    console.log("ordertime", ordertime);
    
    // 模拟从服务器获取数据
    setTimeout(() => {
      // 模拟订单详情数据
      const mockOrderData = {
        id: id || "XD" + Math.floor(Math.random() * 100000),
        expressid: expressid || "107-5-207", // 快递取件码
        dromadd: decodeURIComponent(dromadd || "南湖五栋207"), // 宿舍地址
        phone: "150****8888", // 联系电话
        submitTime: dayjs(Number(ordertime)).format('YYYY-MM-DD HH:mm:ss'), // 提交时间
        imageUrl: "https://img.yzcdn.cn/vant/cat.jpeg", // 取件截图
        
        comment: "请轻拿轻放，易碎物品", // 备注
        payment: { // 支付信息
          amount: "3.00",
          method: "微信支付",
          time: "2023-07-10 15:31",
          status: "已支付"
        },
        courierInfo: courierInfo, // 配送员信息
      };
      
      setHistoryOrderInfo(mockOrderData);
      setLoading(false);
    }, 800);
  }, []);

  // if (loading) {
  //   return (
  //     <View className="flex flex-col items-center justify-center h-screen bg-gray-50">
  //       <Loading type="spinner" className="text-blue-400" />
  //       <Text className="mt-4 text-gray-500">加载订单信息...</Text>
  //     </View>
  //   );
  // }



  useReady(() => {
    const pages = Taro.getCurrentPages();
  setCanGoBack(pages.length > 1); // 判断是否能返回
  });

  return (
    <View>
      {/* 顶部：navbar */}
      <View className="bg-black h-24 pt-8 flex items-center relative">
        {canGoBack && (
          <View 
            className="absolute left-4" 
            onClick={() => {
              Taro.navigateBack({ delta: 1 })
            }}
          >
            <ArrowLeft color="#fff" size="25" />
          </View>
        )}
        <View className="flex-1 text-center">
          <Text className="text-white text-ms">历史订单详情</Text>
        </View>
      </View>

      <View className="bg-[#F3F4EE] min-h-screen">
        {/* 顶部：订单状态 */}
        <View className="bg-black p-3 border-t-2 border-black h-16">
          <View className="bg-[#FEFFFB] p-4 shadow-sm h-40 w-full flex flex-col justify-cneter items-center">
            <View className="text-xl font-bold">订单已完成</View>
            <View className="text-sm text-gray-500 mt-2">
              感谢您信任我们，期待您下次光临
            </View>
            <View className="flex space-x-2 mt-6 gap-2">
              <View className="border border-[#00668c] text-[#00668c] py-2 px-4 rounded-sm text-sm">
                评价一下
              </View >
              <View className="border border-[#00668c] text-[#00668c] py-2 px-4 rounded-sm text-sm">
                再来一单
              </View>
            </View>
          </View>
        </View>

        {/* 会员权限 */}
        <View className="bg-[#FEFFFB] h-20 m-3 mt-32 pt-3 p-2"
        style={{background: "linear-gradient(to bottom, #d4eaf7, #FEFFFB)"}}
        >
          <View className="flex items-center">
            <View className='text-sm rounded-full w-16 pl-1'
            style={{background: "linear-gradient(to right, #d4eaf7, #b6ccd8)"}}>
              正式会员
            </View>
            <Text className="text-sm ml-2">本单已享以下会员优惠</Text>
          </View>
          <View className="mt-4 flex justify-between items-center">
            <View className="text-sm text-gray-500">
              获得 20 积分，可兑换精美礼品
            </View>
            <View className="flex items-center text-gray-500 text-sm">
              去兑换
              <Arrow />
            </View>
          </View>
        </View>

             
      {historyOrderInfo && (
        <View>
        /* 派送员信息 */
        <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
          <SwipeCell>
            <Cell>
              <View className="flex w-full py-2">
                <Avatar src={historyOrderInfo.courierInfo.avatar} size="large" />
                <View className="ml-3 flex-1">
                  <View className="flex justify-between">
                    <Text className="font-medium">{historyOrderInfo.courierInfo.name}</Text>
                    <View className="flex items-center">
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <Text className="text-yellow-500">{historyOrderInfo.courierInfo.rating}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500 mt-1">{historyOrderInfo.courierInfo.phone}</Text>
                  <View className="flex mt-2">
                  </View>
                </View>
              </View>
            </Cell>
          </SwipeCell>
        </View>

        /* 取件信息 */
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
      <Cell.Group>
        <Cell title="取件信息" icon={<PhotoOutlined />} />
        <Cell title="取件码">
          <View className="font-medium text-lg">{historyOrderInfo.expressid}</View>
        </Cell>
        <Cell title="地址" icon={<LocationOutlined />}>
          <View className="text-right">{historyOrderInfo.dromadd}</View>
        </Cell>
        <Cell title="联系电话" icon={<PhoneOutlined />}>
          <View className="text-right">{historyOrderInfo.phone}</View>
        </Cell>
        <Cell title="提交时间" icon={<ClockOutlined />}>
          <View className="text-right">{historyOrderInfo.submitTime}</View>
        </Cell>
        {historyOrderInfo.comment && (
          <Cell title="备注" icon={<CommentOutlined />}>
            <View className="text-right">{historyOrderInfo.comment}</View>
          </Cell>
        )}
      </Cell.Group>
    </View>
    
    
    /* 取件截图 */
    <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
      <Cell title="取件截图" />
      <View className="p-4">
        <Image 
          src={historyOrderInfo.imageUrl} 
          mode="widthFix" 
          className="w-full rounded-lg shadow-sm" 
          onClick={() => Taro.previewImage({
            current: historyOrderInfo.imageUrl,
            urls: [historyOrderInfo.imageUrl]
          })}
        />
        <Text className="text-xs text-gray-500 mt-2 block text-center">点击查看大图</Text>
      </View>
    </View>
    
    /* 支付信息 */
    <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
      <Cell title="支付信息" />
      <View className="p-4">
        <View className="flex justify-between mb-2">
          <Text className="text-gray-500">支付方式</Text>
          <Text>{historyOrderInfo.payment.method}</Text>
        </View>
        <View className="flex justify-between mb-2">
          <Text className="text-gray-500">支付时间</Text>
          <Text>{historyOrderInfo.payment.time}</Text>
        </View>
        <View className="flex justify-between mb-2">
          <Text className="text-gray-500">支付状态</Text>
          <Text className="text-green-500">{historyOrderInfo.payment.status}</Text>
        </View>
        <Divider />
        <View className="flex justify-between items-center">
          <Text className="text-gray-500">实付金额</Text>
          <Text className="text-xl font-bold">¥{historyOrderInfo.payment.amount}</Text>
        </View>
      </View>
    </View>
    </View>
      )}
      
      
      
      {/* 订单时间线 
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden mb-24">
        <Cell title="订单状态历史" />
        <View className="p-4">
          {historyOrderInfo.statusHistory.map((item, index) => (
            <View key={index} className="relative pl-6 pb-4">
              {index < historyOrderInfo.statusHistory.length - 1 && (
                <View className="absolute left-3 top-3 bottom-0 w-px bg-gray-200" />
              )}
              <View className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <View className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-400'}`} />
              </View>
              <View>
                <Text className="font-medium">{item.status}</Text>
                <Text className="text-xs text-gray-500 mt-1 block">{item.time}</Text>
                <Text className="text-sm text-gray-600 mt-1">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      */}
       
       
      </View>
    </View>
  );
}

export default HistoryOrderInfo;