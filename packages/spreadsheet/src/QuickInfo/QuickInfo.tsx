import React, { memo } from "react";
import { Text, Box, useColorMode } from "@chakra-ui/core";
import { SelectionArea, isNull } from "@rowsncolumns/grid";
import { Cells } from "../Spreadsheet";
import { isNumeric } from "../constants";

export interface QuickInfoProps {
  selections: SelectionArea[];
  cells: Cells;
}
const QuickInfo: React.FC<QuickInfoProps> = memo(({ selections, cells }) => {
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const bg = isLight ? "white" : "#000";
  const color = isLight ? "#333" : "#ccc";
  const shadow = isLight
    ? "0 0 2px 1px rgba(0,0,0,0.2)"
    : "0 0 2px 1px rgba(255,255,255,0.2)";

  let count = 0;
  let avg = 0;
  let sum = 0;
  for (let i = 0; i < selections.length; i++) {
    const { bounds } = selections[i];
    for (let j = bounds.top; j <= bounds.bottom; j++) {
      for (let k = bounds.left; k <= bounds.right; k++) {
        const cell = cells[j]?.[k];
        if (cell === void 0) continue;
        if (!isNull(cell.text) && isNumeric(cell)) {
          count += 1;
          sum += Number(cell.text);
        }
      }
    }
  }

  if (count === 0 && sum === 0 && avg === 0) return null;

  return (
    <Box display="flex" alignItems="center" pr={2} pl={2}>
      {count !== 0 && (
        <Box
          ml={2}
          boxShadow={shadow}
          bg={bg}
          color={color}
          borderRadius={5}
          pl={2}
          pr={2}
          pt={1}
          pb={1}
        >
          <Text fontSize="xs">Count: {count}</Text>
        </Box>
      )}
      {count > 0 && (
        <Box
          ml={2}
          boxShadow={shadow}
          bg={bg}
          color={color}
          borderRadius={5}
          pl={2}
          pr={2}
          pt={1}
          pb={1}
        >
          <Text fontSize="xs">Sum: {sum}</Text>
        </Box>
      )}
      {count > 0 && (
        <Box
          ml={2}
          boxShadow={shadow}
          bg={bg}
          color={color}
          borderRadius={5}
          pl={2}
          pr={2}
          pt={1}
          pb={1}
        >
          <Text fontSize="xs">Avg: {avg}</Text>
        </Box>
      )}
    </Box>
  );
});

export default QuickInfo;
