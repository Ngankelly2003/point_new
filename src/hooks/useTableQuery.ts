import { useState } from "react";
import { TableProps } from "antd";
import { SorterResult } from "antd/es/table/interface";

type TableChange = TableProps<any>["onChange"];
type Sorter = SorterResult<any>;

export const useTableQuery = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [sortedInfo, setSortedInfo] = useState<Sorter>({});
  const [currentFilters, setCurrentFilters] = useState<
    { key: string; value: string[] }[]
  >([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const onChange: TableChange = (paginationTable, filters, sorter) => {
    //  filter
    const transformedFilters = Object.entries(filters)
      .filter(([_, value]) => Array.isArray(value) && value.length > 0)
      .map(([key, value]) => ({
        key,
        value: value as string[],
      }));

    //  sorter
    setSortedInfo(sorter as Sorter);

    // phân trang
    setPagination({
      pageNumber: paginationTable.current || 1,
      pageSize: paginationTable.pageSize || 10,
    });

    setCurrentFilters(transformedFilters);
  };

  return {
    pagination,
    sortedInfo,
    currentFilters,
    searchValue,
    setSearchValue,
    onChange,
  };
};
