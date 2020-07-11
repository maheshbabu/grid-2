import React, { memo, useCallback, useMemo, useState } from "react";
import { Cell, RendererProps } from "@rowsncolumns/grid";
import {
  number2Alpha,
  DARK_MODE_COLOR,
  HEADER_BORDER_COLOR,
} from "../constants";
import { Rect } from "react-konva";
import { ShapeConfig } from "konva/types/Shape";
import { AXIS } from "../types";
import { ThemeType } from "../styled";

export interface HeaderCellProps extends RendererProps {
  isActive?: boolean;
  isHidden?: boolean;
  onResize?: (axis: AXIS, index: number, dimension: number) => void;
  isLightMode?: boolean;
  theme: ThemeType;
}

interface DraggableRectProps
  extends Pick<ShapeConfig, "x" | "y" | "height" | "width" | "onDblClick"> {
  axis?: AXIS;
  columnIndex: number;
  rowIndex: number;
  onResize?: (axis: AXIS, index: number, dimension: number) => void;
  onAdjustColumn?: (columnIndex: number) => void;
  parentX: number;
  parentY: number;
}
const DRAG_HANDLE_WIDTH = 5;
const DraggableRect: React.FC<DraggableRectProps> = memo((props) => {
  const {
    axis = AXIS.X,
    x = 0,
    y = 0,
    height = 0,
    width = 0,
    columnIndex,
    rowIndex,
    onResize,
    parentX = 0,
    parentY = 0,
  } = props;
  const cursor = axis === AXIS.X ? "e-resize" : "n-resize";
  const index = useMemo(() => (axis === AXIS.X ? columnIndex : rowIndex), [
    axis,
  ]);
  return (
    <Rect
      perfectDrawEnabled={false}
      fill="#4C90FD"
      draggable
      strokeScaleEnabled={false}
      shadowForStrokeEnable={false}
      hitStrokeWidth={5}
      onMouseEnter={() => (document.body.style.cursor = cursor)}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      onMouseDown={(e) => e.evt.stopPropagation()}
      dragBoundFunc={(pos) => {
        return {
          ...pos,
          ...(axis === AXIS.X ? { y: 0 } : { x: 0 }),
        };
      }}
      onDragMove={(e) => {
        const node = e.target;
        const dimension =
          axis === AXIS.X
            ? node.x() - parentX + DRAG_HANDLE_WIDTH
            : node.y() - parentY + DRAG_HANDLE_WIDTH;

        onResize?.(axis, index, dimension);
      }}
      x={x}
      y={y}
      width={width}
      height={height}
      {...props}
    />
  );
});

const HeaderCell: React.FC<HeaderCellProps> = memo((props) => {
  const [showResizer, setShowResizer] = useState(false);
  const {
    rowIndex,
    columnIndex,
    isActive,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    isHidden,
    isLightMode,
    theme,
  } = props;
  const { onResize, onAdjustColumn, ...rest } = props;
  const isCorner = rowIndex === columnIndex;
  const value = isCorner
    ? ""
    : rowIndex === 0
    ? number2Alpha(columnIndex - 1)
    : rowIndex.toString();
  const isRowHeader = rowIndex === 0;
  const fill = isLightMode
    ? isActive
      ? "#E9EAED"
      : "#F8F9FA"
    : isActive
    ? theme.colors.gray[700]
    : DARK_MODE_COLOR;
  const textColor = isLightMode ? "#333" : "white";
  const stroke = isLightMode ? HEADER_BORDER_COLOR : theme.colors.gray[600];
  const handleMouseEnter = useCallback(() => {
    setShowResizer(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setShowResizer(false);
  }, []);
  const handleAdjustColumn = useCallback(() => {
    onAdjustColumn?.(columnIndex);
  }, []);
  if (isHidden) return null;
  return (
    <Cell
      {...rest}
      x={x + 0.5}
      y={y + 0.5}
      fill={fill}
      align="center"
      value={value}
      textColor={textColor}
      stroke={stroke}
      fontSize={10}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isCorner && showResizer ? (
        <DraggableRect
          parentX={x}
          parentY={y}
          x={isRowHeader ? x + width - DRAG_HANDLE_WIDTH : x}
          y={isRowHeader ? y : y + height - DRAG_HANDLE_WIDTH}
          width={isRowHeader ? DRAG_HANDLE_WIDTH : width}
          height={isRowHeader ? height : DRAG_HANDLE_WIDTH}
          axis={isRowHeader ? AXIS.X : AXIS.Y}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          onResize={onResize}
          onDblClick={handleAdjustColumn}
        />
      ) : null}
    </Cell>
  );
});

export default HeaderCell;
