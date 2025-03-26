import React, { useState } from 'react'
import { Cell, Calendar } from "@taroify/core"

// 格式化选择的日期范围
function formatDateRange(dates) {
  if (dates.length === 2) {
    const start = dates[0].toLocaleDateString()
    const end = dates[1].toLocaleDateString()
    return `选择了从 ${start} 到 ${end} 的时间`
  }
  return ''
}

function DateRangeSelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState([])
  const [formatValue, setFormatValue] = useState('')

  // 获取最近三个月的开始和结束日期
  const getDateRange = () => {
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3) // 三个月前的日期

    return {
      minDate: threeMonthsAgo,
      maxDate: today
    }
  }

  // 打印选择的起始和结束日期
  const handleConfirm = (newValue) => {
    if (newValue.length === 2) {
      // 输出选择的日期范围
      console.log(`选中的起始时间: ${newValue[0]}`)
      console.log(`选中的结束时间: ${newValue[1]}`)
      setFormatValue(formatDateRange(newValue))
    } else {
      console.log('未选择完整的日期范围')
    }
    setOpen(false)
  }

  const { minDate, maxDate } = getDateRange()

  return (
    <>
      {/* 调整后的悬浮导航栏，缩小尺寸 */}
      <div className="fixed top-5 left-0 z-50 p-2 bg-white shadow-lg rounded-full cursor-pointer hover:scale-105 transition-transform" onClick={() => setOpen(true)}>
        <Cell title="筛选" isLink children={formatValue} />
      </div>

      {/* 日历组件，限制日期范围 */}
      <Calendar
        type="range"
        value={value}
        poppable
        showPopup={open}
        onClose={() => setOpen(false)}
        onChange={setValue}
        onConfirm={handleConfirm}
        minDate={minDate}  // 设置最小日期（三个月前）
        maxDate={maxDate}  // 设置最大日期（今天）
      />
    </>
  )
}

export default DateRangeSelector