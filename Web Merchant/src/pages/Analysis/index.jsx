import { useEffect, useState, useRef } from "react";
import { Card, Tabs, Spin, message } from "antd";
import { init, getInstanceByDom, use } from "echarts/core";
import {
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { LineChart, PieChart } from "echarts/charts";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { generateMockData } from "./components/mockData";
import { fetchAnalysisData } from "@/apis";

// 注册必要的组件
use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

const { TabPane } = Tabs;

const OrderAnalysis = () => {
  const [activeTab, setActiveTab] = useState("week");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const lineChartRef = useRef(null);
  const statusPieRef = useRef(null);
  const timePieRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 监听屏幕宽度变化
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 获取数据
  useEffect(() => {
    setLoading(true);

    // 调用真实API
    fetchAnalysisData(activeTab)
      .then((response) => {
        if (response.success && response.data) {
          // 处理API返回的数据
          processApiData(response.data, activeTab);
        } else {
          messageApi.error(response.errorMsg || "获取数据失败");
          // 如果API调用失败，使用模拟数据
          const mockResponse = generateMockData(activeTab);
          processApiData(mockResponse.data, activeTab);
        }
      })
      .catch((error) => {
        console.error("获取数据失败:", error);
        messageApi.error("获取数据失败，使用模拟数据");
        // 如果API调用出错，使用模拟数据
        const mockResponse = generateMockData(activeTab);
        processApiData(mockResponse.data, activeTab);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, messageApi]);

  // 处理API返回的数据，转换为图表所需格式
  const processApiData = (apiData, timeRange) => {
    // 根据当前选中的时间范围生成日期数组
    const generateDates = () => {
      const today = new Date();
      const dataLength = apiData.length;

      switch (timeRange) {
        case "week":
          // 近一周，以天为单位
          return apiData.map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (dataLength - 1 - index));
            return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")}`;
          });

        case "month":
          // 近一个月，以天为单位
          return apiData.map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (dataLength - 1 - index));
            return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")}`;
          });

        case "quarter":
          // 近三个月，以周为单位
          return apiData.map((_, index) => {
            // 计算当前周的开始日期（从今天往前算，每7天为一周）
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - (dataLength - 1 - index) * 7);

            // 计算当前周的结束日期
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // 格式化为 MM-DD~MM-DD 格式
            return `${(weekStart.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${weekStart
              .getDate()
              .toString()
              .padStart(2, "0")}~${(weekEnd.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${weekEnd
              .getDate()
              .toString()
              .padStart(2, "0")}`;
          });

        case "halfYear":
          // 近半年，以月为单位
          return apiData.map((_, index) => {
            const date = new Date(today);
            date.setMonth(today.getMonth() - (dataLength - 1 - index));
            return `${(date.getMonth() + 1).toString().padStart(2, "0")}月`;
          });

        default:
          // 默认以天为单位
          return apiData.map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (dataLength - 1 - index));
            return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")}`;
          });
      }
    };

    const dates = generateDates();
    const totalOrders = [];
    const completedOrders = [];
    const failedOrders = [];
    const timeDistribution = [];

    // Process data for each date
    apiData.forEach((item) => {
      totalOrders.push(item.all);
      completedOrders.push(item.worked);
      failedOrders.push(item.unWorked);
      timeDistribution.push(item.array || [0, 0, 0, 0, 0, 0]); // Ensure we always have valid time distribution data
    });

    setChartData({
      dates,
      totalOrders,
      completedOrders,
      failedOrders,
      timeDistribution,
    });
  };

  // 初始化图表
  useEffect(() => {
    if (!chartData || loading) return;

    // 初始化图表实例
    let lineChart = getInstanceByDom(lineChartRef.current);
    if (!lineChart) {
      lineChart = init(lineChartRef.current);
    }

    let statusPieChart = getInstanceByDom(statusPieRef.current);
    if (!statusPieChart) {
      statusPieChart = init(statusPieRef.current);
    }

    let timePieChart = getInstanceByDom(timePieRef.current);
    if (!timePieChart) {
      timePieChart = init(timePieRef.current);
    }

    // 检查是否有订单数据，所有图表都使用这个变量
    const hasOrders = chartData.totalOrders.some((value) => value > 0);

    // 判断是否为小屏幕
    const isSmallScreen = screenWidth < 768;

    // 设置折线图配置
    const lineOption = {
      title: {
        text: "订单量趋势",
        left: "center",
        subtext: hasOrders ? "" : "暂无订单数据",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["总订单量", "已完成订单", "未完成订单"],
        bottom: 10,
        // 不使用scroll模式，让图例自然换行
        type: "plain",
        // 减小图例项之间的间距
        itemGap: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        // 为图例预留足够的空间，根据屏幕大小调整
        bottom: isSmallScreen ? "25%" : "20%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.dates,
        // 对于长日期标签（如周格式），增加轴标签的旋转角度
        axisLabel: {
          rotate: activeTab === "quarter" ? 30 : 0,
          interval: "auto",
          formatter: function (value) {
            // 对于长日期标签，可以考虑缩短显示
            if (activeTab === "quarter" && value.includes("~")) {
              return value.split("~")[0]; // 只显示开始日期
            }
            return value;
          },
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "总订单量",
          type: "line",
          smooth: true,
          data: chartData.totalOrders,
          itemStyle: {
            color: "#5470c6",
          },
        },
        {
          name: "已完成订单",
          type: "line",
          smooth: true,
          data: chartData.completedOrders,
          itemStyle: {
            color: "#91cc75",
          },
        },
        {
          name: "未完成订单",
          type: "line",
          smooth: true,
          data: chartData.failedOrders,
          itemStyle: {
            color: "#ee6666",
          },
        },
      ],
    };

    // 设置状态饼图配置
    const statusPieOption = {
      title: {
        text: "订单状态分布",
        left: "center",
        subtext: hasOrders ? "" : "暂无订单数据",
        // 调整标题与图表的距离
        top: 0,
        bottom: 10,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "horizontal",
        // 将图例放在底部，预留足够空间
        bottom: 0,
        type: "plain",
        // 减小图例项之间的间距
        itemGap: 10,
        data: ["已完成订单", "未完成订单"],
      },
      series: [
        {
          name: "订单状态",
          type: "pie",
          // 调整饼图的大小和位置，使其不会与图例重叠
          radius: ["30%", "60%"],
          // 将饼图向上移动，为底部图例腾出空间
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          // 根据hasOrders条件决定是否显示数据
          data: hasOrders
            ? [
                {
                  value: chartData.completedOrders[0],
                  name: "已完成订单",
                  itemStyle: { color: "#91cc75" },
                },
                {
                  value: chartData.failedOrders[0],
                  name: "未完成订单",
                  itemStyle: { color: "#ee6666" },
                },
              ]
            : [],
        },
      ],
    };

    // 设置时间饼图配置
    const timePieOption = {
      title: {
        text: "订单时间分布",
        left: "center",
        subtext: hasOrders ? "" : "暂无订单数据",
        // 调整标题与图表的距离
        top: 0,
        bottom: 10,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "horizontal",
        // 将图例放在底部，预留足够空间
        bottom: 0,
        type: "plain",
        // 减小图例项之间的间距
        itemGap: isSmallScreen ? 5 : 10,
        // 小屏幕时减小图例标记的大小
        itemWidth: isSmallScreen ? 15 : 25,
        itemHeight: isSmallScreen ? 10 : 14,
        // 小屏幕时减小字体大小
        textStyle: {
          fontSize: isSmallScreen ? 10 : 12,
        },
        data: [
          "凌晨 (0-4点)",
          "早晨 (4-8点)",
          "上午 (8-12点)",
          "下午 (12-16点)",
          "傍晚 (16-20点)",
          "晚上 (20-24点)",
        ],
      },
      series: [
        {
          name: "下单时间",
          type: "pie",
          // 调整饼图的大小和位置，使其不会与图例重叠
          radius: ["30%", "60%"],
          // 将饼图向上移动，为底部图例腾出空间
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: hasOrders
            ? chartData.timeDistribution[0].map((value, index) => {
                const timeLabels = [
                  "凌晨 (0-4点)",
                  "早晨 (4-8点)",
                  "上午 (8-12点)",
                  "下午 (12-16点)",
                  "傍晚 (16-20点)",
                  "晚上 (20-24点)",
                ];
                const colors = [
                  "#5470c6",
                  "#91cc75",
                  "#fac858",
                  "#ee6666",
                  "#73c0de",
                  "#3ba272",
                ];

                return {
                  value,
                  name: timeLabels[index],
                  itemStyle: { color: colors[index] },
                };
              })
            : [],
        },
      ],
    };

    // 渲染图表
    lineChart.setOption(lineOption);
    statusPieChart.setOption(statusPieOption);
    timePieChart.setOption(timePieOption);

    // 设置联动
    lineChart.on("updateAxisPointer", (event) => {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        const dimension = xAxisInfo.value;

        // 检查当前时间点是否有订单
        const hasDimensionOrders = chartData.totalOrders[dimension] > 0;

        // 更新状态饼图
        statusPieChart.setOption({
          series: [
            {
              data: hasDimensionOrders
                ? [
                    {
                      value: chartData.completedOrders[dimension],
                      name: "已完成订单",
                      itemStyle: { color: "#91cc75" },
                    },
                    {
                      value: chartData.failedOrders[dimension],
                      name: "未完成订单",
                      itemStyle: { color: "#ee6666" },
                    },
                  ]
                : [],
            },
          ],
          title: {
            text: `订单状态分布 (${chartData.dates[dimension]})`,
            subtext: hasDimensionOrders ? "" : "暂无订单数据",
          },
        });

        // 更新时间饼图
        timePieChart.setOption({
          series: [
            {
              data: hasDimensionOrders
                ? chartData.timeDistribution[dimension].map((value, i) => ({
                    value,
                    name: [
                      "凌晨 (0-4点)",
                      "早晨 (4-8点)",
                      "上午 (8-12点)",
                      "下午 (12-16点)",
                      "傍晚 (16-20点)",
                      "晚上 (20-24点)",
                    ][i],
                    itemStyle: {
                      color: [
                        "#5470c6",
                        "#91cc75",
                        "#fac858",
                        "#ee6666",
                        "#73c0de",
                        "#3ba272",
                      ][i],
                    },
                  }))
                : [],
            },
          ],
          title: {
            text: `订单时间分布 (${chartData.dates[dimension]})`,
            subtext: hasDimensionOrders ? "" : "暂无订单数据",
          },
        });
      }
    });

    // 监听窗口大小变化，调整图表大小
    const handleResize = () => {
      lineChart.resize();
      statusPieChart.resize();
      timePieChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lineChart.dispose();
      statusPieChart.dispose();
      timePieChart.dispose();
    };
  }, [chartData, loading, screenWidth, activeTab]);

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Card title="订单流水分析" className="shadow-md">
      {contextHolder}
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="近一周（天）" key="week" />
        <TabPane tab="近一月（天）" key="month" />
        <TabPane tab="近三月（周）" key="quarter" />
        <TabPane tab="近半年（月）" key="halfYear" />
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-[600px]">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <div className="mt-4">
          <div className="w-full h-[300px]" ref={lineChartRef} />

          <div className="flex flex-col md:flex-row mt-6">
            {/* 增加容器高度，为图例预留更多空间 */}
            <div className="w-full md:w-1/2 h-[350px]" ref={statusPieRef} />
            <div className="w-full md:w-1/2 h-[350px]" ref={timePieRef} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderAnalysis;
