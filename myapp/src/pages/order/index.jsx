import { View, Swiper, SwiperItem } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
//import { useLoad } from '@tarojs/taro'

export default function Order() {
  const marginStyle = {
    margin: '10px'
  }

  return (
    <View>
      <Swiper
        className="test-h"
        indicatorColor="#999"
        indicatorActiveColor="#333"
        vertical
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem>
          <View className="demo-text-1">100</View>
        </SwiperItem>
        <SwiperItem>
          <View className="demo-text-2">2</View>
        </SwiperItem>
        <SwiperItem>
          <View className="demo-text-3">3</View>
        </SwiperItem>
      </Swiper>
      <View className="text-[#acc855] text-[100px]">Hello world!</View>
      <Button openType="share" style={marginStyle}>
        Share
      </Button>
      <Button type="primary" style={marginStyle} className="h-16 w-16">
        Primary
      </Button>
    </View>
  );
}
