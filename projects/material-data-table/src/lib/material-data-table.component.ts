import { NgComponentOutlet, NgStyle } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription } from 'rxjs';
import { IColumnMap, ITableOptions } from './material-data-table.interfaces';

@Component({
  selector: 'mat-data-table',
  imports: [
    NgStyle,
    NgComponentOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  standalone: true,
  templateUrl: './material-data-table.component.html',
  styleUrl: './material-data-table.component.scss',
})
export class MaterialDataTableComponent<T> implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  /**
   * The data to be displayed in the table.
   * Can be provided as a static array of objects (`T[]`) or an `Observable<T[]>`.
   * If an Observable is provided, the table will update automatically when the Observable emits new data.
   */
  @Input({ required: true }) tableData: Observable<T[]> | T[] | null = null;
  /**
   * An array of column definitions that map data properties to table columns.
   * Each object in the array must conform to the `IColumnMap<T>` type.
   * @see IColumnMap
   */
  @Input({ required: true }) columnMappings: IColumnMap<T>[] = [];
  /**
   * Optional configuration object to customize the table's features and behavior.
   * If not provided, default options will be used.
   * @see ITableOptions
   */
  @Input() tableOptions: ITableOptions<T> = {};

  public mergedOptions: ITableOptions<T> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _defaultTableOptions: ITableOptions<T> = {
    showFilter: true,
    filterOptions: { label: 'Filter' },
    showPaginator: true,
    paginatorOptions: { pageSizeOptions: [5, 10, 25, 100] },
    showSorter: true,
    sorterOptions: { defaultSortDirection: 'asc' },
    showActions: false,
  };

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  private dataSubscription: Subscription | null = null;
  private isViewInitialized = false;

  constructor() {
    //empty constructor
  }

  ngOnInit(): void {
    this._mergeOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableOptions']) {
      this._mergeOptions();
    }
    // When a new Observable is passed in...
    if (changes['tableData'] && this.isViewInitialized) {
      // If the view is ready, we can safely re-subscribe to the new observable.
      this.subscribeToData();
    }
  }

  private _mergeOptions(): void {
    const defaults = this._defaultTableOptions;
    const user = this.tableOptions || {};

    // Deep merge the options, with user options taking precedence.
    this.mergedOptions = {
      ...defaults, ...user,
      filterOptions: { ...defaults.filterOptions, ...user.filterOptions },
      paginatorOptions: { ...defaults.paginatorOptions, ...user.paginatorOptions },
      sorterOptions: { ...defaults.sorterOptions, ...user.sorterOptions },
      actionOptions: { ...defaults.actionOptions, ...user.actionOptions },
    };
  }

  ngAfterViewInit(): void {
    this.isViewInitialized = true;

    // Connect the paginator and filter to the data source ONCE.
    // The MatTableDataSource will handle updates automatically from here.
    if (this.mergedOptions.showPaginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.mergedOptions.showFilter && this.mergedOptions.filterOptions?.filterPredicate) {
      this.dataSource.filterPredicate = this.mergedOptions.filterOptions.filterPredicate;
    }

    this.subscribeToData(); // Now subscribe to data changes.
  }

  private subscribeToData(): void {
    this.dataSubscription?.unsubscribe();
    if (this.tableData) {
      if (this.tableData instanceof Observable) {

        this.dataSubscription = this.tableData.subscribe(data => {
          // Only update the data. The paginator and filter are already connected.
          this.dataSource.data = data ?? [];
          this.connectSort();
        });
      } else {
        this.dataSource.data = this.tableData ?? [];
        this.connectSort();
      }
    }
  }

  private connectSort(): void {
    // Connect sort only once, after the first data load, to avoid race conditions.
    if (this.mergedOptions.showSorter && this.sort && !this.dataSource.sort) {
      this.dataSource.sort = this.sort;
      if (this.mergedOptions.sorterOptions?.sortData) {
        this.dataSource.sortData = this.mergedOptions.sorterOptions.sortData;
      }
      if (this.mergedOptions.sorterOptions?.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = this.mergedOptions.sorterOptions?.sortingDataAccessor;
      }
    }
  }

  generateDisplayColumns(): string[] {
    const displayColumns = this.columnMappings.map(col => col.key as string);
    if (this.mergedOptions.showActions) {
      displayColumns.push('actions');
    }
    return displayColumns;
  }

    /**
   * Returns the tooltip text for a cell.
   * It handles both static string tooltips and function-based tooltips.
   * @param column The column definition, which may contain the tooltip.
   * @param row The data for the current row.
   * @returns The tooltip string, or an empty string if no tooltip is defined.
   */
    public getTooltipText(column: IColumnMap<T>, row: T): string {
      if (column.tooltip === undefined) {
        return '';
      }
  
      if (typeof column.tooltip === 'function') {
        return (column.tooltip)(row[column.key as never]);
      }
  
      return column.tooltip;
    }
  
    public getComponentInputs(column: IColumnMap<T>, row: T): { [key: string]: unknown } {
      return {
        data: row[column.key as keyof T],
        ...column.componentInputs
      };
    }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks when the component is destroyed.
    this.dataSubscription?.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
