import React, { useState } from "react";
import { Card, Tag, Button, Space, Modal } from "antd";
import Steps from "./Steps";
import Countdown from "./Countdown";
import {
  STEP_STATES,
  testStatusSequence,
  getStatusDesc,
  getStatusColor,
} from "./STEP_STATES";

const OrderCard = ({ order }) => {
  // 使用本地状态存储当前状态的索引
  const [statusIndex, setStatusIndex] = useState(order.statusIndex || 0);
  const currentStatus = testStatusSequence[statusIndex];

  // 处理步骤切换
  const handleCycleStatus = (e) => {
    e.stopPropagation();
    setStatusIndex((prev) => (prev + 1) % testStatusSequence.length);
  };

  // 处理卡片点击，显示订单详情
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showOrderDetail = () => {
    setIsModalOpen(true);
  };

  return (
    <Card
      className="mb-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={showOrderDetail}
      style={{ background: "linear-gradient(to right, #d4eaf7, #b6ccd8)" }}
    >
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium text-gray-800">
          {order.expressId}
        </div>
        <Space>
          <Tag color={getStatusColor(currentStatus)}>
            {getStatusDesc(currentStatus)}
          </Tag>
          <Button
            size="small"
            onClick={handleCycleStatus}
            className="bg-white/20 border-none text-gray-700 hover:bg-white/30"
          >
            测试状态
          </Button>
        </Space>
      </div>

      <div className="mt-2 text-gray-700">{order.dormAdd}</div>

      {/* 倒计时容器 - 固定高度 */}
      <div className="h-[40px] flex items-center mt-3">
        {currentStatus === STEP_STATES.STEP1.WAITING && (
          <>
            <div className="text-gray-700 text-sm mr-2">剩余时间</div>
            <Countdown value={order.downTime} />
          </>
        )}
      </div>

      {/* 使用Steps组件，传递当前状态 */}
      <div className="mt-2">
        <Steps status={currentStatus} />
      </div>

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            关闭
          </Button>,
          <Button
            key="action"
            type="primary"
            disabled={currentStatus === STEP_STATES.STEP3.DELIVERED}
          >
            {getActionButtonText(currentStatus)}
          </Button>,
        ]}
        width={700}
      >
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p>
              <strong>订单号:</strong> {order.expressId}
            </p>
            <p>
              <strong>送达地址:</strong> {order.dormAdd}
            </p>
            <p>
              <strong>联系电话:</strong> {order.iphoneNumber}
            </p>
            <p>
              <strong>下单时间:</strong> {order.createTime}
            </p>
            <p>
              <strong>状态:</strong> {getStatusDesc(currentStatus)}
            </p>
          </div>
          <div>
            <p>
              <strong>截止时间:</strong>{" "}
              {new Date(order.downTime).toLocaleString()}
            </p>
            <p>
              <strong>备注:</strong> {order.comment || "无"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Steps status={currentStatus} />
        </div>

        {order.image && (
          <div className="mt-4">
            <p>
              <strong>包裹图片:</strong>
            </p>
            <img
              src={order.image || "/placeholder.svg"}
              alt="包裹图片"
              className="mt-2 max-w-full h-auto max-h-[200px] rounded-md"
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

// 根据当前状态获取操作按钮文本
const getActionButtonText = (status) => {
  switch (status) {
    case STEP_STATES.STEP1.WAITING:
      return "接单";
    case STEP_STATES.STEP1.ACCEPTED:
      return "开始取件";
    case STEP_STATES.STEP2.PICKING:
      return "确认取件";
    case STEP_STATES.STEP2.SUCCESS:
      return "开始配送";
    case STEP_STATES.STEP3.DELIVERING:
      return "确认送达";
    case STEP_STATES.STEP1.REJECTED:
    case STEP_STATES.STEP2.FAILED:
    case STEP_STATES.STEP3.DELIVERED:
      return "完成";
    default:
      return "操作";
  }
};

export default OrderCard;
