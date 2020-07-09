import React, { useMemo, useState, useCallback } from "react";
import { CellInterface, GridRef, CellPosition, AreaProps } from "./../Grid";
import { isNull } from "../helpers";

export interface FilterView {
  bounds: AreaProps;
  filters: Filter;
}

export type Filter = Record<string, FilterDefinition>;
export type FilterDefinition = {
  operator: ContainsTextOperators | DataValidationOperator;
  values: any[];
};
export type DataValidationOperator =
  | "between"
  | "notBetween"
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual";

export type ContainsTextOperators =
  | "containsText"
  | "notContainsText"
  | "containsBlanks"
  | "notContainsBlanks"
  | "containsErrors"
  | "notContainsErrors";

export interface FilterProps {
  /**
   * Returns filter component
   */
  getFilterComponent?: (cell: CellInterface | null) => React.ElementType | null;
  /**
   * Access grid methods
   */
  gridRef: React.MutableRefObject<GridRef | null>;
  /**
   * Get value of a cell
   */
  getValue: (cell: CellInterface) => any;
  /**
   * Width of the filter panel
   */
  width?: number;
  offset?: number;
}

export interface FilterResults {
  /**
   * Component to render filter
   */
  filterComponent: React.ReactNode;
  /**
   * Enable filter
   */
  showFilter: (
    cell: CellInterface,
    index: number,
    filterView: FilterView,
    filter?: FilterDefinition
  ) => void;
  /**
   * Hide filter component
   */
  hideFilter: () => void;
}

/* Default filter component */
const getDefaultFilerComponent = (cell: CellInterface | null) => null;

export interface FilterState {
  filterView: FilterView;
  filter?: FilterDefinition;
  index: number;
}

/**
 * Use filter hook
 * @param param0
 */
const useFilter = ({
  getFilterComponent = getDefaultFilerComponent,
  gridRef,
  width = 220,
  offset = 20,
  getValue,
}: FilterProps): FilterResults => {
  const [filterCell, setFilterCell] = useState<CellInterface | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterState | null>(null);
  const [position, setPosition] = useState<CellPosition>({
    x: 0,
    y: 0,
  });
  const FilterComponent = useMemo(() => {
    return getFilterComponent(filterCell);
  }, [filterCell]);

  /**
   * Show filter panel
   */
  const handleShowFilter = useCallback(
    (
      coords: CellInterface,
      index: number,
      filterView: FilterView,
      filter?: FilterDefinition
    ) => {
      if (!gridRef.current) return;
      /* Get actual coords for merged cells */
      coords = gridRef.current.getActualCellCoords(coords);

      /* Get scroll position */
      const scrollPosition = gridRef.current.getScrollPosition();

      /* Get cell position */
      const pos = gridRef.current.getCellOffsetFromCoords(coords);

      /* Set cell position */
      setPosition((prev) => {
        const left = pos.x as number;
        const top = pos.y as number;
        const cellWidth = pos.width as number;
        return {
          x:
            left + cellWidth < width
              ? left + cellWidth - offset
              : left + cellWidth - scrollPosition.scrollLeft - width,
          y: top - scrollPosition.scrollTop + offset,
        };
      });

      /* Set filter cell */
      setFilterCell(coords);

      /* set current filter */
      setCurrentFilter({ filter, filterView, index });

      /* Show filter */
      showFilter();
    },
    []
  );

  const hideFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  const showFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const values = useMemo(() => {
    if (!filterCell || !currentFilter) return [];
    const { filter, filterView } = currentFilter;
    const { columnIndex } = filterCell;
    const { bounds } = filterView;
    var values = new Set();
    for (let i = bounds.top + 1; i <= bounds.bottom; i++) {
      const cell = { rowIndex: i, columnIndex };
      const text = getValue(cell);
      const value = isNull(text) ? "" : text;
      values.add(value);
    }
    return [...values];
  }, [filterCell, currentFilter]);

  const filterComponent =
    isFilterVisible && FilterComponent ? (
      <FilterComponent
        position={position}
        width={width}
        values={values}
        index={currentFilter?.index}
        filter={currentFilter?.filter}
        columnIndex={filterCell?.columnIndex}
      />
    ) : null;

  return {
    filterComponent,
    showFilter: handleShowFilter,
    hideFilter,
  };
};

export default useFilter;
