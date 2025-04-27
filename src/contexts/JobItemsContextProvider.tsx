import { createContext, useCallback, useMemo, useState } from "react";
import { useSearchQuery, useSearchTextContext } from "../lib/hooks";
import { RESULTS_PER_PAGE } from "../lib/constants";
import { SortBy, PageDirection, JobItem } from "../lib/types";

// 定义工作项Context的类型，包含工作项列表、排序、分页等相关状态和方法
type JobItemsContext = {
  jobItems: JobItem[] | undefined; // 原始工作项数据
  jobItemsSortedAndSliced: JobItem[]; // 排序和分页后的工作项
  isLoading: boolean; // 加载状态
  totalNumberOfResults: number; // 总结果数
  totalNumberOfPages: number; // 总页数
  currentPage: number; // 当前页码
  sortBy: SortBy; // 排序方式
  handleChangePage: (direction: PageDirection) => void; // 切换页面方法
  handleChangeSortBy: (newSortBy: SortBy) => void; // 更改排序方法
};

// 创建Context，初始值为null
export const JobItemsContext = createContext<JobItemsContext | null>(null);

// 工作项Context Provider组件
export default function JobItemsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 从SearchTextContext获取防抖后的搜索文本
  const { debouncedSearchText } = useSearchTextContext();

  // 使用搜索文本获取工作项数据
  const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);

  // 分页和排序状态
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("relevant");

  // 计算总结果数和总页数
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
  const jobItemsSorted = useMemo(
    () =>
      [...(jobItems || [])].sort((a, b) => {
        if (sortBy === "relevant") {
          return b.relevanceScore - a.relevanceScore;
        } else {
          return a.daysAgo - b.daysAgo;
        }
      }),
    [sortBy, jobItems]
  );

  const jobItemsSortedAndSliced = useMemo(
    () =>
      jobItemsSorted.slice(
        currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE
      ),
    [currentPage, jobItemsSorted]
  );

  // event handlers / actions
  const handleChangePage = useCallback((direction: PageDirection) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    }
  }, []);
  const handleChangeSortBy = useCallback((newSortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(newSortBy);
  }, []);

  const contextValue = useMemo(
    () => ({
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    }),
    [
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    ]
  );

  return (
    <JobItemsContext.Provider value={contextValue}>
      {children}
    </JobItemsContext.Provider>
  );
}
