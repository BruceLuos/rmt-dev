import { createContext } from "react";
import { useJobItems, useLocalStorage } from "../lib/hooks";
import { JobItemExpanded } from "../lib/types";

// 定义书签Context的类型，包含书签ID列表、切换书签的方法、已书签的工作项和加载状态
type BookmarksContext = {
  bookmarkedIds: number[]; // 存储已书签的工作项ID
  handleToggleBookmark: (id: number) => void; // 切换书签状态的方法
  bookmarkedJobItems: JobItemExpanded[]; // 已书签的工作项详细信息
  isLoading: boolean; // 加载状态标志
};

// 创建Context，初始值为null
export const BookmarksContext = createContext<BookmarksContext | null>(null);

// 书签Context Provider组件
export default function BookmarksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 使用localStorage持久化存储书签ID列表
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
    "bookmarkedIds",
    []
  );

  // 获取已书签的工作项详细信息
  const { jobItems: bookmarkedJobItems, isLoading } =
    useJobItems(bookmarkedIds);

  // 切换书签状态的处理函数
  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      // 如果ID已存在，则移除
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      // 如果ID不存在，则添加
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
        bookmarkedJobItems,
        isLoading,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
