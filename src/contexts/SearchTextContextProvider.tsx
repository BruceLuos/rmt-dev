import { createContext, useState } from "react";
import { useDebounce } from "../lib/hooks";

// 定义搜索文本Context的类型，包含搜索文本、防抖后的搜索文本和更新方法
type SearchTextContext = {
  searchText: string; // 原始搜索文本
  debouncedSearchText: string; // 防抖后的搜索文本
  handleChangeSearchText: (newSearchText: string) => void; // 更新搜索文本的方法
};

// 创建Context，初始值为null
export const SearchTextContext = createContext<SearchTextContext | null>(null);

// 搜索文本Context Provider组件
export default function SearchTextContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 搜索文本状态
  const [searchText, setSearchText] = useState("");

  // 使用防抖hook处理搜索文本，延迟250ms
  const debouncedSearchText = useDebounce(searchText, 250);

  // 更新搜索文本的处理函数
  const handleChangeSearchText = (newSearchText: string) => {
    setSearchText(newSearchText);
  };

  return (
    <SearchTextContext.Provider
      value={{
        searchText,
        debouncedSearchText,
        handleChangeSearchText,
      }}
    >
      {children}
    </SearchTextContext.Provider>
  );
}
