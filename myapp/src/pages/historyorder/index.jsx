import { BackTop } from "@taroify/core"

function HistoryOrder() {
  const list = [...Array(50).keys()]

  return (
    <View>
      <Cell.Group>
        {list.map((v) => {
          return <Cell key={v}>{v}</Cell>
        })}
      </Cell.Group>
      <BackTop>返回顶部</BackTop>
    </View>
  )
}

export default HistoryOrder