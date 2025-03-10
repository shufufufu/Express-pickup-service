import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'


export default function personinfo () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View >
      <View>xiaojiba1</View>
    </View>
  )
}
