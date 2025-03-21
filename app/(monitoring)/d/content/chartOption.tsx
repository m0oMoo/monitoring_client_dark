import SquareToggleBtnGroup from "@/components/button/toggle/squareBtnGroup";
import ToggleSwitch from "@/components/button/toggle/toggleSwitch";
import TextInput from "@/components/input/textInput";
import ChartTypeSelector from "@/components/selector/chartTypeSelector";
import SliderToggle from "@/components/slider/sliderToggle";
import { useChartOptions } from "@/context/chartOptionContext";
import { DARK_COLOR_PALETTES } from "@/data/color/colorPalettes";
import { Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { HexAlphaColorPicker } from "react-colorful";

const ChartOption = () => {
  const {
    chartType,
    showLegend,
    fill,
    legendPosition,
    legendColor,
    isSingleColorMode,
    titleText,
    borderColor,
    backgroundColor,
    tooltipBgColor,
    tooltipMode,
    hoverMode,
    zoomMode,
    zoomSensitivity,
    crosshairColor,
    crosshairWidth,
    crosshairOpacity,
    xGridDisplay,
    yGridDisplay,
    showCrosshair,
    enableZoom,
    radius,
    tension,
    setOptions,
    displayMode,
    toggleDisplayMode,
  } = useChartOptions();

  const [isClient, setIsClient] = useState<boolean>(false);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [isPickerVisible2, setIsPickerVisible2] = useState<boolean>(false);
  const [isPickerVisible3, setIsPickerVisible3] = useState<boolean>(false);
  const [isPickerVisible4, setIsPickerVisible4] = useState<boolean>(false);
  const [isPickerVisible5, setIsPickerVisible5] = useState<boolean>(false);

  const [tempLegendColor, setTempLegendColor] = useState<string>(legendColor);
  const [tempTooltipColor, setTempTooltipColor] =
    useState<string>(tooltipBgColor);
  const [tempBackgroundColor, setTempBackgroundColor] =
    useState<string>(backgroundColor);
  const [tempCrosshairColor, setTempCrosshairColor] =
    useState<string>(crosshairColor);
  const [tempBorderColor, setTempBorderColor] = useState<string>(borderColor);

  const [selectedPalette, setSelectedPalette] = useState(
    DARK_COLOR_PALETTES[0]
  );

  const handlePaletteChange = (palette: any) => {
    if (!palette || !palette.borderColors || !palette.backgroundColors) {
      console.error("선택한 팔레트에 색상이 없습니다.");
      return;
    }

    setSelectedPalette(palette);
    setOptions({
      borderColors: palette.borderColors ?? [],
      backgroundColors: palette.backgroundColors ?? [],
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLegendColorChange = (color: any) => {
    setTempLegendColor(color);
  };

  const handleTooltipColorChange = (color: any) => {
    setTempTooltipColor(color);
  };

  const handleBackgroundColorChange = (color: any) => {
    setTempBackgroundColor(color);
  };

  const handleCrosshairColorChange = (color: any) => {
    setTempCrosshairColor(color);
  };

  const handleBorderColorChange = (color: any) => {
    setTempBorderColor(color);
  };

  const confirmLegendColorChange = () => {
    setOptions({ legendColor: tempLegendColor });
    setIsPickerVisible(false);
  };

  const confirmTooltipColorChange = () => {
    setOptions({ tooltipBgColor: tempTooltipColor });
    setIsPickerVisible2(false);
  };

  const confirmBackgroundColorChange = () => {
    setOptions({ backgroundColor: tempBackgroundColor });
    setIsPickerVisible3(false);
  };

  const confirmCrosshairColorChange = () => {
    setOptions({ crosshairColor: tempCrosshairColor });
    setIsPickerVisible4(false);
  };

  const confirmBorderColorChange = () => {
    setOptions({ borderColor: tempBorderColor });
    setIsPickerVisible5(false);
  };

  const togglePickerVisibility = () => {
    setIsPickerVisible((prevState) => !prevState);
    setIsPickerVisible2(false);
    setIsPickerVisible3(false);
    setIsPickerVisible5(false);
    setIsPickerVisible4(false);
  };

  const togglePickerVisibility2 = () => {
    setIsPickerVisible2((prevState) => !prevState);
    setIsPickerVisible(false);
    setIsPickerVisible3(false);
    setIsPickerVisible4(false);
    setIsPickerVisible5(false);
  };

  const togglePickerVisibility3 = () => {
    setIsPickerVisible3((prevState) => !prevState);
    setIsPickerVisible2(false);
    setIsPickerVisible(false);
    setIsPickerVisible5(false);
    setIsPickerVisible4(false);
  };

  const togglePickerVisibility4 = () => {
    setIsPickerVisible4((prevState) => !prevState);
    setIsPickerVisible2(false);
    setIsPickerVisible(false);
    setIsPickerVisible5(false);
    setIsPickerVisible3(false);
  };

  const togglePickerVisibility5 = () => {
    setIsPickerVisible5((prevState) => !prevState);
    setIsPickerVisible2(false);
    setIsPickerVisible(false);
    setIsPickerVisible4(false);
    setIsPickerVisible3(false);
  };

  return (
    <div
      className="bg-modern-bg border-l border-0.5 no-scrollbar border-modern-border
    py-8 pl-6 w-[300px] h-[100vh] overflow-y-auto"
    >
      {isClient && (
        <div className="w-full flex flex-col pb-24">
          <h2 className="text-lg font-semibold mb-4 text-modern-text">
            Chart Option
          </h2>
          {/* Display Mode */}
          <div className="flex flex-col gap-1 mb-6">
            <label className="text-sm2 text-modern-text">Row</label>
            <SquareToggleBtnGroup
              label="Display Mode"
              options={["table", "chart"]}
              selected={displayMode}
              onChange={() => toggleDisplayMode()}
            />
          </div>
          {/* Left options panel */}
          <div className="">
            {/* Chart type */}
            <div className="flex flex-col gap-1 mb-1.5">
              <label className="text-sm2 text-modern-text">차트 유형</label>
              <ChartTypeSelector
                chartType={chartType}
                setChartType={(type) => setOptions({ chartType: type })}
              />
            </div>
            {chartType === "line" && (
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-sm2 text-modern-text">채우기</label>
                <ToggleSwitch
                  checked={fill}
                  onChange={(checked) => setOptions({ fill: checked })}
                />
              </div>
            )}

            {/* Chart title */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">제목</label>
              <TextInput
                value={titleText}
                // onChange={(value) => setTitleText(value)}
                onChange={(value) => setOptions({ titleText: value })}
                placeholder="차트 제목"
                className="w-[200px]"
              />
            </div>

            {/* Show legend */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">범례 표시</label>
              <ToggleSwitch
                checked={showLegend}
                // onChange={handleLegendChange}
                onChange={(checked) => setOptions({ showLegend: checked })}
              />
            </div>

            {/* Legend position */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">범례 위치</label>
              <SquareToggleBtnGroup
                label="범례 위치"
                options={["top", "bottom", "right"]}
                selected={legendPosition}
                // onChange={setLegendPosition}
                onChange={(position) =>
                  setOptions({ legendPosition: position })
                }
              />
            </div>
            {/* ✅ 단일 색상 모드 토글 */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm2 text-modern-text">
                단일 색상 모드
              </label>
              <ToggleSwitch
                checked={isSingleColorMode}
                onChange={(checked) =>
                  setOptions({ isSingleColorMode: checked })
                }
              />
            </div>
            {!isSingleColorMode && (
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-sm2 text-modern-text">
                  색상 팔레트 선택
                </label>

                {/* 드롭다운 */}
                {/* <select
                className="w-full p-2 border rounded-md bg-white"
                onChange={(e) => {
                  const selected = COLOR_PALETTES.find(
                    (p) => p.name === e.target.value
                  );
                  if (selected) handlePaletteChange(selected);
                }}
                value={selectedPalette.name}
              >
                {COLOR_PALETTES.map((palette, index) => (
                  <option key={index} value={palette.name}>
                    {palette.name}
                  </option>
                ))}
              </select> */}

                {/* 팔레트 미리보기 */}
                <div className="flex flex-wrap gap-2 mt-2 w-[250px]">
                  {DARK_COLOR_PALETTES.map((palette, index) => (
                    <button
                      key={index}
                      className={`relative w-10 h-6 rounded ${
                        selectedPalette === palette
                          ? "border border-modern-border"
                          : ""
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(to bottom, ${
                          palette.borderColors?.join(", ") || "#000000"
                        })`,
                      }}
                      onClick={() => handlePaletteChange(palette)}
                    >
                      {selectedPalette === palette && (
                        <Check className="absolute top-[15%] right-1/3 w-4 h-4 text-white bg-transparent-gray rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Background color */}
            {isSingleColorMode && (
              <>
                <div className="flex flex-col gap-1 mb-6">
                  <label className="text-sm2 text-modern-text">차트 색상</label>
                  <div className="flex items-center">
                    <TextInput
                      value={backgroundColor}
                      onChange={handleBackgroundColorChange}
                      placeholder="색상 코드 입력"
                      className="w-[200px]"
                    />
                    <button
                      onClick={togglePickerVisibility3}
                      className="p-2 rounded-full focus:outline-none"
                    >
                      <div
                        style={{ backgroundColor: backgroundColor }}
                        className="w-6 h-6 border rounded-full"
                      />
                    </button>
                  </div>
                  {/* <ColorPaletteSelector /> */}
                </div>

                {/* Border color */}
                <div className="flex flex-col gap-1 mb-6">
                  <label className="text-sm2 text-modern-text">
                    테두리 색상
                  </label>
                  <div className="flex items-center">
                    <TextInput
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      placeholder="색상 코드 입력"
                      className="w-[200px]"
                    />
                    <button
                      onClick={togglePickerVisibility5}
                      className="p-2 rounded-full focus:outline-none"
                    >
                      {/* 색상 미리보기 박스 */}
                      <div
                        style={{ backgroundColor: borderColor }}
                        className="w-6 h-6 border rounded-full"
                      />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Legend color */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">범례 색상</label>
              <div className="flex items-center">
                <TextInput
                  value={legendColor}
                  onChange={handleLegendColorChange}
                  placeholder="색상 코드 입력"
                  className="w-[200px]"
                />
                <button
                  onClick={togglePickerVisibility}
                  className="p-2 rounded-full focus:outline-none"
                >
                  {/* 색상 미리보기 박스 */}
                  <div
                    style={{ backgroundColor: tempLegendColor }}
                    className="w-6 h-6 border rounded-full"
                  />
                </button>
              </div>
            </div>

            {/* Tooltip background color */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">툴팁 배경색</label>
              <div className="flex items-center">
                <TextInput
                  value={tooltipBgColor}
                  onChange={(value) => setOptions({ tooltipBgColor: value })}
                  placeholder="색상 코드 입력"
                  className="w-[200px]"
                />
                <button
                  onClick={togglePickerVisibility2}
                  className="p-2 rounded-full focus:outline-none"
                >
                  {/* 색상 미리보기 박스 */}
                  <div
                    style={{ backgroundColor: tempTooltipColor }}
                    className="w-6 h-6 border rounded-full"
                  />
                </button>
              </div>
            </div>

            {/* Tooltip mode */}
            {/* <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">툴팁 모드</label>
              <SquareToggleBtnGroup
                label="툴팁 모드"
                options={["index", "nearest"]}
                selected={tooltipMode}
                onChange={(mode) => setOptions({ tooltipMode: mode })}
              />
            </div> */}
            {/* Hover mode */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">툴팁 모드</label>
              <SquareToggleBtnGroup
                label="툴팁 모드"
                options={["index", "nearest"]}
                selected={hoverMode}
                onChange={(mode) => setOptions({ hoverMode: mode })}
              />
            </div>
            {/* tension */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">곡률</label>
              <SliderToggle
                value={tension}
                onChange={(value) => setOptions({ tension: value })}
                enabled={chartType === "line"}
                onToggle={() => {}}
                className="w-[200px]"
                max={1}
              />
            </div>
            {/* Show Crosshair */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">포인트 표시</label>
              <ToggleSwitch
                checked={chartType !== "line" ? false : showCrosshair}
                onChange={(checked) => setOptions({ showCrosshair: checked })}
              />
            </div>
            {/* Crosshair Color */}
            {/* <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">포인트 색상</label>
              <div className="flex items-center">
                <TextInput
                  value={crosshairColor}
                  onChange={(color) => setOptions({ crosshairColor: color })}
                  placeholder="색상 코드 입력"
                  className="w-[200px]"
                />
                <button
                  onClick={togglePickerVisibility4}
                  className="p-2 rounded-full focus:outline-none"
                >
                  <div
                    style={{ backgroundColor: tempCrosshairColor }}
                    className="w-6 h-6 border rounded-full"
                  />
                </button>
              </div>
            </div> */}
            {/* dot */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">포인트 크기</label>
              <SliderToggle
                value={radius}
                onChange={(value) => setOptions({ radius: value })}
                enabled={chartType !== "line" ? false : showCrosshair}
                onToggle={(enabled) => setOptions({ showCrosshair: enabled })}
                className="w-[200px]"
              />
            </div>
            {/* Crosshair Width */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">
                크로스헤어 두께
              </label>
              <SliderToggle
                value={crosshairWidth}
                onChange={(value) => setOptions({ crosshairWidth: value })}
                enabled={chartType !== "line" ? false : true}
                onToggle={() => {}}
                className="w-[200px]"
              />
            </div>

            {/* Grid Display */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">x축 표시</label>
              <ToggleSwitch
                checked={xGridDisplay}
                onChange={(checked) => setOptions({ xGridDisplay: checked })}
              />
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">y축 표시</label>
              <ToggleSwitch
                checked={yGridDisplay}
                onChange={(checked) => setOptions({ yGridDisplay: checked })}
              />
            </div>

            {/* Enable Zoom */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">줌 활성화</label>
              <ToggleSwitch
                checked={enableZoom}
                onChange={(checked) => setOptions({ enableZoom: checked })}
              />
            </div>

            {/* Zoom mode */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">줌 모드</label>
              <SquareToggleBtnGroup
                label="줌 모드"
                options={["xy", "x", "y"]}
                selected={zoomMode}
                onChange={(mode) => setOptions({ zoomMode: mode })}
              />
            </div>
            {/* <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm2 text-modern-text">줌 민감도</label>
              <SliderToggle
                value={zoomSensitivity}
                onChange={(value) => setOptions({ zoomSensitivity: value })}
                enabled={enableZoom}
                onToggle={(enabled) => setOptions({ enableZoom: enabled })}
                className="w-[200px]"
              />
            </div> */}
          </div>

          {isPickerVisible && (
            <div className="absolute z-10">
              <HexAlphaColorPicker
                color={tempLegendColor}
                onChange={handleLegendColorChange}
              />
              <button
                className="mt-2 float-right px-3 py-1 shadow-md bg-white border border-gray-2 rounded text-md1"
                onClick={confirmLegendColorChange}
              >
                확인
              </button>
            </div>
          )}
          {isPickerVisible2 && (
            <div className="absolute z-10">
              <HexAlphaColorPicker
                color={tempTooltipColor}
                onChange={handleTooltipColorChange}
              />
              <button
                className="mt-2 float-right px-3 py-1 shadow-md bg-white border border-gray-2 rounded text-md1"
                onClick={confirmTooltipColorChange}
              >
                확인
              </button>
            </div>
          )}
          {isPickerVisible3 && (
            <div className="absolute z-10">
              <HexAlphaColorPicker
                color={tempBackgroundColor}
                onChange={handleBackgroundColorChange}
              />
              <button
                className="mt-2 float-right px-3 py-1 shadow-md bg-white border border-gray-2 rounded text-md1"
                onClick={confirmBackgroundColorChange}
              >
                확인
              </button>
            </div>
          )}
          {isPickerVisible4 && (
            <div className="absolute z-10">
              <HexAlphaColorPicker
                color={tempCrosshairColor}
                onChange={handleCrosshairColorChange}
              />
              <button
                className="mt-2 float-right px-3 py-1 shadow-md bg-white border border-gray-2 rounded text-md1"
                onClick={confirmCrosshairColorChange}
              >
                확인
              </button>
            </div>
          )}
          {isPickerVisible5 && (
            <div className="absolute z-10">
              <HexAlphaColorPicker
                color={tempBorderColor}
                onChange={handleBorderColorChange}
              />
              <button
                className="mt-2 float-right px-3 py-1 shadow-md bg-white border border-gray-2 rounded text-md1"
                onClick={confirmBorderColorChange}
              >
                확인
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartOption;
