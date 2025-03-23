import React from "react";
import { View, Text } from "@tarojs/components";
import { Button, Image, Cell} from "@taroify/core";
import Taro from "@tarojs/taro";

export default function HistoryOrderInfo() {
  return (
    <View className="bg-gray-100 min-h-screen p-4">
      {/* 顶部：订单状态 */}
      <View className="bg-white p-4 rounded-md shadow-sm mb-4">
        <Text className="text-xl font-bold">订单已完成</Text>
        <Text className="text-sm text-gray-500 mt-1">
          感谢您惠顾，期待您下次光临
        </Text>
        <View className="flex space-x-2 mt-4">
          <Button variant="outlined" color="primary" size="small" className="flex-1">
            评价一下
          </Button>
          <Button color="primary" size="small" className="flex-1">
            再来一单
          </Button> 
        </View>
      </View>

      {/* 中部：门店及商品列表 */}
      <View className="bg-white p-4 rounded-md shadow-sm mb-4">
        {/* 门店名称 */}
        <Text className="text-lg font-bold mb-2">厦门宝龙一城店</Text>

        <Cell.Group>
          {/* 商品1 */}
          <Cell className="py-2 px-0 flex items-start">
            <Image
              className="w-16 h-16 object-cover mr-2"
              src="https://cdn.jsdelivr.net/gh/NervJS/taro@next/docs/avatar.png"
              mode="aspectFill"
            />
            <View className="flex-1">
              <Text className="block text-sm font-medium">多肉葡萄(首创)</Text>
              <Text className="block text-xs text-gray-500 mt-1">规格: 500ml, 少糖, 少冰</Text>
            </View>
            <View className="text-right">
              <Text className="block text-sm font-medium">¥18</Text>
            </View>
          </Cell>

          {/* 商品2 */}
          <Cell className="py-2 px-0 flex items-start">
            <Image
              className="w-16 h-16 object-cover mr-2"
              src="https://cdn.jsdelivr.net/gh/NervJS/taro@next/docs/avatar.png"
              mode="aspectFill"
            />
            <View className="flex-1">
              <Text className="block text-sm font-medium">小奶茶(超大杯)</Text>
              <Text className="block text-xs text-gray-500 mt-1">规格: 少糖, 少冰</Text>
            </View>
            <View className="text-right">
              <Text className="block text-sm font-medium">¥15</Text>
            </View>
          </Cell>

          {/* 商品3 */}
          <Cell className="py-2 px-0 flex items-start">
            <Image
              className="w-16 h-16 object-cover mr-2"
              src="https://cdn.jsdelivr.net/gh/NervJS/taro@next/docs/avatar.png"
              mode="aspectFill"
            />
            <View className="flex-1">
              <Text className="block text-sm font-medium">超多肉芒芒甘露</Text>
              <Text className="block text-xs text-gray-500 mt-1">规格: 少糖, 少冰</Text>
            </View>
            <View className="text-right">
              <Text className="block text-sm font-medium">¥20</Text>
            </View>
          </Cell>
        </Cell.Group>
      </View>

      {/* 底部：价格汇总 */}
      <View className="bg-white p-4 rounded-md shadow-sm mb-4">
        <View className="flex justify-between mb-1">
          <Text className="text-sm">商品总价</Text>
          <Text className="text-sm">¥103</Text>
        </View>
        <View className="flex justify-between mb-1">
          <Text className="text-sm">纸袋/PLA袋</Text>
          <Text className="text-sm">¥0</Text>
        </View>
        <View className="text-right text-sm text-gray-500 mt-2">
          共6件商品，合计 ¥103
        </View>
      </View>

      {/* 订单信息 */}
      <View className="bg-white p-4 rounded-md shadow-sm">
        <View className="flex justify-between items-center mb-2">
          <Text className="font-bold text-base">订单信息</Text>
          <View className="flex space-x-2">
            <Button variant="outlined" size="small" color="primary">
              订单发票
            </Button>
            <Button size="small" color="primary">
              立即开票
            </Button>
          </View>
        </View>
        <View className="flex justify-between mb-1">
          <Text className="text-sm text-gray-500">下单时间</Text>
          <Text className="text-sm">2025-02-05 20:48:35</Text>
        </View>
        <View className="flex justify-between mb-1">
          <Text className="text-sm text-gray-500">单号</Text>
          <Text className="text-sm">8362</Text>
        </View>
        <View className="flex justify-between mb-1">
          <Text className="text-sm text-gray-500">取餐码</Text>
          <Text className="text-sm">85623650769767041826</Text>
        </View>
        <Text className="text-gray-500 text-sm mt-2">
          温馨提示：超时不候，敬请自提
        </Text>
      </View>
    </View>
  );
}
