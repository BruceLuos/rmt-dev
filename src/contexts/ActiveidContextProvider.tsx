import { createContext } from "react";
import { useActiveId } from "../lib/hooks";

// 定义当前激活ID的Context类型
type ActiveIdContext = {
  activeId: number | null; // 当前激活的工作项ID，如果没有激活项则为null
};

// 创建Context，初始值为null
export const ActiveIdContext = createContext<ActiveIdContext | null>(null);

// 当前激活ID的Context Provider组件
export default function ActiveIdContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 使用自定义hook获取当前激活的ID
  const activeId = useActiveId();

  return (
    <ActiveIdContext.Provider
      value={{
        activeId,
      }}
    >
      {children}
    </ActiveIdContext.Provider>
  );
}
