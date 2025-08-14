import { SortDirection, MatSort } from "@angular/material/sort";
import { Type } from "@angular/core";

/**
 * Represents the interface that a custom cell component should implement.
 * This allows for rendering complex cell content using Angular components.
 *
 * @template V The type of the data passed to the cell.
 */
export interface IMaterialTableCell<V> {
  /** The data for the current cell. */
  data: V;
}

/**
 * Defines the configuration for a single column in the data table.
 * It's a mapped type that ensures type safety between your data object `T` and the column definitions.
 *
 * @template T The type of the data object for a single row.
 */
export type IColumnMap<T> = {
  [K in Extract<keyof T, string>]: {
    /** The key of the property in the data object `T` to display in this column. */
    key: K;
    /** The text to display in the column header. */
    label: string;
    /**
     * Whether this column should be sortable.
     * @default false
     */
    sort?: boolean;
    /**
     * An object of CSS styles to apply to the data cells (`<td>`) in this column.
     * @example { 'text-align': 'right', 'width': '100px' }
     */
    dataCellStyles?: { [key: string]: string | number };
    /**
     * An object of CSS styles to apply to the header cell (`<th>`) for this column.
     * @example { 'font-weight': 'bold' }
     */
    headerCellStyles?: { [key: string]: string | number };
    /**
     * An Angular component to use for rendering the cell content.
     * The component must implement the `IMaterialTableCell` interface.
     */
    component?: Type<IMaterialTableCell<T[K]>>;
    /**
     * A function to transform the cell data before it's displayed.
     * This is useful for formatting dates, numbers, etc.
     * This is ignored if a `component` is provided.
     * @param data The original cell data.
     * @returns The transformed string to display.
     */
    transformer?: (data: T[K]) => string;
  }
}[Extract<keyof T, string>];

/**
 * Defines the configurable options for the Material Data Table.
 * These options allow you to customize the table's features and behavior.
 *
 * @template T The type of the data object for a single row.
 */
export interface ITableOptions<T> {
  /**
   * Whether to display the filter input field.
   * @default true
   */
  showFilter?: boolean;
  /**
   * Configuration for the filter functionality.
   */
  filterOptions?: {
    /**
     * The label for the filter input field.
     * @default 'Filter'
     */
    label?: string;
    /** The placeholder text for the filter input field. */
    placeholder?: string;
    /**
     * A custom predicate function for filtering.
     * If not provided, the default MatTableDataSource filter will be used, which checks if the row's string representation includes the filter string.
     * @param data The data for a single row.
     * @param filter The filter string.
     * @returns `true` if the row should be included, `false` otherwise.
     */
    filterPredicate?: (data: T, filter: string) => boolean;
  }
  /**
   * Whether to display the paginator.
   * @default true
   */
  showPaginator?: boolean;
  /**
   * Configuration for the paginator.
   */
  paginatorOptions?: {
    /**
     * The set of page size options to display to the user.
     * @default [5, 10, 25, 100]
     */
    pageSizeOptions?: number[];
  }
  /**
   * Whether to enable sorting for the table.
   * Individual columns must also have `sort: true` in their `IColumnMap` definition.
   * @default true
   */
  showSorter?: boolean;
  /**
   * Configuration for the sorting functionality.
   */
  sorterOptions?: {
    /** The ID of the column to sort by default. Must match a `key` in `IColumnMap`. */
    defaultSortColumn?: string;
    /**
     * The default sort direction.
     * @default 'asc'
     */
    defaultSortDirection?: SortDirection;
    /**
     * A custom function to override the default sorting behavior of the `MatTableDataSource`.
     * @param data The array of data to sort.
     * @param sort The `MatSort` directive instance.
     * @returns The sorted array of data.
     */
    sortData?: (data: T[], sort: MatSort) => T[];
    /**
     * A custom function to access the data property for sorting.
     * By default, the data accessor will attempt to access a property with the name of the `sortHeaderId`.
     * @param data The data for a single row.
     * @param sortHeaderId The ID of the column header being sorted.
     * @returns The value to be used for sorting.
     */
    sortingDataAccessor?: (data: T, sortHeaderId: string) => string | number;
  }
  /**
   * Whether to display the actions column with a menu for each row.
   * @default false
   */
  showActions?: boolean;
  /**
   * Configuration for the row actions menu.
   */
  actionOptions?: {
    /** An array of actions to display in the menu for each row. */
    actions?: IMenuAction<T>[];
  }
}

/**
 * Defines a single action or a divider in the row actions menu.
 *
 * @template T The type of the data object for a single row.
 */
export type IMenuAction<T> = {
  /** The name of the Material Icon to display. */
  icon?: string;
  /** The text to display for the menu item. */
  label: string;
  /**
   * The function to execute when the menu item is clicked.
   * @param row The data object for the row on which the action was clicked.
   */
  fxn: (row: T) => void;
  /** This property should not be used for a standard action. */
  divider?: never;
} | {
  /** Set to `true` to display a divider instead of a menu item. */
  divider: true;
  /** This property is not used for a divider. */
  icon?: never;
  /** This property is not used for a divider. */
  label?: never;
  /** This property is not used for a divider. */
  fxn?: never;
}