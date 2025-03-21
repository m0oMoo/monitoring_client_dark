import React, { useState } from "react";
import { X } from "lucide-react";

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataBindingPanel: React.FC<PanelProps> = ({ isOpen, onClose }) => {
  const [bindingType, setBindingType] = useState<"api" | "query">("api");
  const [apiUrl, setApiUrl] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-8 shadow-lg transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-80 p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">데이터 바인딩</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-white font-semibold">
          데이터 소스 선택
        </label>
        <select
          className="p-2 bg-gray-7 text-white rounded-md w-full"
          value={bindingType}
          onChange={(e) => setBindingType(e.target.value as "api" | "query")}
        >
          <option value="api">API 기반 데이터</option>
          <option value="query">쿼리 기반 데이터</option>
        </select>

        {bindingType === "api" && (
          <div>
            <label className="block text-white mb-2">API URL:</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-7 text-white"
              placeholder="https://api.example.com/data"
            />
          </div>
        )}

        {bindingType === "query" && (
          <div>
            <label className="block text-white mb-2">쿼리문:</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-7 text-white"
              placeholder="SELECT * FROM table_name"
              rows={4}
            />
          </div>
        )}

        <button
          className="w-full p-2 bg-gray-6 border border-gray-4 rounded-md
          text-white hover:bg-gray-7"
          onClick={onClose}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default DataBindingPanel;
