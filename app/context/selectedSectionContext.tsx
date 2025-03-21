"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ 선택 가능한 섹션 타입 정의
type SectionType = "chartOption" | "widgetOption";

// ✅ Context 생성
interface SelectedSectionContextProps {
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}

const SelectedSectionContext = createContext<
  SelectedSectionContextProps | undefined
>(undefined);

// ✅ Provider 컴포넌트 (전역 상태 관리)
export const SelectedSectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedSection, setSelectedSection] =
    useState<SectionType>("chartOption");

  return (
    <SelectedSectionContext.Provider
      value={{ selectedSection, setSelectedSection }}
    >
      {children}
    </SelectedSectionContext.Provider>
  );
};

// ✅ Hook을 이용해서 Context 사용 (편리하게 가져다 씀)
export const useSelectedSection = () => {
  const context = useContext(SelectedSectionContext);
  if (!context) {
    throw new Error(
      "useSelectedSection must be used within a SelectedSectionProvider"
    );
  }
  return context;
};
