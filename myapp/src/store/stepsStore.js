import { create } from 'zustand';

// 创建 steps 状态管理 store
const useStepsStore = create((set) => ({
  // 存储多个 OrderBox 的步骤状态
  orderSteps: {},
  
  // 获取特定 OrderBox 的当前步骤
  getCurrentStep: (orderId) => {
    const state = useStepsStore.getState();
    return state.orderSteps[orderId] || 1; // 默认为第一步
  },
  
  // 更新特定 OrderBox 的步骤
  setCurrentStep: (orderId, step) => set((state) => ({
    orderSteps: {
      ...state.orderSteps,
      [orderId]: step
    }
  })),
  
  // 特定 OrderBox 切换到下一步
  nextStep: (orderId) => set((state) => {
    const currentStep = state.orderSteps[orderId] || 1;
    return {
      orderSteps: {
        ...state.orderSteps,
        [orderId]: currentStep >= 3 ? 3 : currentStep + 1
      }
    };
  }),
  
  // 特定 OrderBox 切换到上一步
  prevStep: (orderId) => set((state) => {
    const currentStep = state.orderSteps[orderId] || 1;
    return {
      orderSteps: {
        ...state.orderSteps,
        [orderId]: currentStep <= 1 ? 1 : currentStep - 1
      }
    };
  }),
  
  // 重置特定 OrderBox 到第一步
  resetStep: (orderId) => set((state) => ({
    orderSteps: {
      ...state.orderSteps,
      [orderId]: 1
    }
  })),
  
  // 特定 OrderBox 步骤循环（用于测试）
  cycleStep: (orderId) => set((state) => {
    const currentStep = state.orderSteps[orderId] || 1;
    return {
      orderSteps: {
        ...state.orderSteps,
        [orderId]: currentStep >= 3 ? 1 : currentStep + 1
      }
    };
  }),
}));

export default useStepsStore; 