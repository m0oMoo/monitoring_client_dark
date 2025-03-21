"use client";

import React, { useState, useEffect } from "react";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";

interface TableProps {
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  title?: string;
}

const CustomTable: React.FC<TableProps> = ({ columns, data, title }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedColumns: ColumnDefinition[] = columns.map((col) => ({
    field: col.key, // key를 Tabulator의 field로 매핑
    title: col.label, // label을 title로 변경
  }));

  return (
    <div className="p-4 w-full bg-[#333333]">
      {/* <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white w-full"> */}
      {/* {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>} */}

      {isClient ? (
        <ReactTabulator
          columns={formattedColumns}
          data={data}
          layout="fitColumns"
          options={{
            movableColumns: true, // 컬럼 이동 가능
            resizableColumns: true, // 컬럼 크기 조절 가능
            pagination: "local",
            paginationSize: 10,
          }}
          className="w-full custom-tabulator" // custom-tabulator 클래스를 사용하여 스타일 적용
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CustomTable;
