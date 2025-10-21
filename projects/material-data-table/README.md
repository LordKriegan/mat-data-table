# @lordkriegan/mat-data-table

[![npm version](https://badge.fury.io/js/%40lordkriegan%2Fmat-data-table.svg)](https://badge.fury.io/js/%40lordkriegan%2Fmat-data-table)
[![npm license](https://img.shields.io/npm/l/%40lordkriegan%2Fmat-data-table)](https://www.npmjs.com/package/@lordkriegan/mat-data-table)

A powerful, dynamic, and easy-to-configure data table component for Angular, built on top of Angular Material. This standalone component simplifies the process of displaying data with features like client-side filtering, sorting, pagination, and highly customizable rendering.

## Features

- **Dynamic Columns:** Define columns from a simple configuration object.
- **Type-Safe:** Ensures type safety between your data and column definitions.
- **Client-Side Operations:** Built-in filtering, sorting, and pagination.
- **Custom Cell Rendering:** Use your own Angular components to render complex cell content.
- **Component Inputs:** Pass custom data and configuration directly to your cell components.
- **Data Transformers:** Easily format data like dates and currency using simple functions.
- **Row & Global Actions:** Add a configurable actions menu to each row and/or to the table header.
- **Styling Hooks:** Customize the look of the table, rows, cells, and action buttons.
- **Tooltips:** Add static or dynamic tooltips to any data cell.
- **Custom "No Data" Template:** Display a custom component when the table is empty.
- **Observable Support:** Accepts data as a static array or an `Observable`.

## Peer Dependencies

This library requires you to have the following packages installed in your project:

```json
{
  "@angular/common": "^19.0.0 || ^20.0.0",
  "@angular/core": "^19.0.0 || ^20.0.0",
  "@angular/material": "^19.0.0 || ^20.0.0"
}
```

## Installation

```bash
npm install @lordkriegan/mat-data-table
```

## Quick Start

1.  **Import `MaterialDataTableComponent`** into your component or module.

    ```typescript
    // your-feature.component.ts
    import { Component } from '@angular/core';
    import { MaterialDataTableComponent } from '@lordkriegan/mat-data-table';

    @Component({
      selector: 'app-my-feature',
      standalone: true,
      imports: [MaterialDataTableComponent],
      // ...
    })
    export class MyFeatureComponent { /* ... */ }
    ```

2.  **Add the component to your template.**

    ```html
    <!-- your-feature.component.html -->
    <mat-data-table
      [tableData]="users"
      [columnMappings]="userColumns"
      [tableOptions]="options">
    </mat-data-table>
    ```

3.  **Provide the data and configuration in your component class.**

    ```typescript
    // your-feature.component.ts
    import { IColumnMap, ITableOptions } from '@lordkriegan/mat-data-table';

    // Define your data structure
    interface User {
      id: number;
      name: string;
      email: string;
      registeredOn: Date;
    }

    // Component class
    export class MyFeatureComponent {
      // 1. Provide the data
      users: User[] = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', registeredOn: new Date() },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', registeredOn: new Date() },
      ];

      // 2. Define the columns
      userColumns: IColumnMap<User>[] = [
        { key: 'id', label: 'ID', sort: true },
        { key: 'name', label: 'Full Name', sort: true },
        { key: 'email', label: 'Email Address' },
      ];

      // 3. (Optional) Configure table features
      options: ITableOptions<User> = {
        showFilter: true,
        showPaginator: true,
      };
    }
    ```

---

## API Reference

### Component Inputs

| Input            | Type                             | Required | Description                                                                                           |
| ---------------- | -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `tableData`      | `T[] \| Observable<T[]> \| null` | Yes      | The data to display in the table.                                                                     |
| `columnMappings` | `IColumnMap<T>[]`                | Yes      | An array of objects that define the table's columns.                                                  |
| `tableOptions`   | `ITableOptions<T>`               | No       | An object to configure optional features like filtering, sorting, pagination, and actions.            |

### Column Configuration (`IColumnMap<T>`)

Each object in the `columnMappings` array configures a single column.

| Property           | Type                                   | Description                                                                                             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `key`              | `keyof T`                              | The property key from your data object `T` to display in this column.                                   |
| `label`            | `string`                               | The text to display in the column header.                                                               |
| `sort`             | `boolean`                              | (Optional) Set to `true` to make this column sortable. Defaults to `false`.                             |
| `dataCellStyles`   | `object`                               | (Optional) A map of CSS styles to apply to the data cells (`<td>`) in this column.                      |
| `headerCellStyles` | `object`                               | (Optional) A map of CSS styles to apply to the header cell (`<th>`).                                    |
| `component`        | `Type<IMaterialTableCell<T[K]>>`       | (Optional) An Angular component to render the cell content. Overrides `transformer`.                    |
| `componentInputs`  | `object`                               | (Optional) An object of inputs to pass to the custom `component`. The `data` input is passed automatically. |
| `transformer`      | `(data: T[K]) => string`               | (Optional) A function to format the cell data for display. Ignored if `component` is provided.          |
| `tooltip`          | `string \| ((data: T[K]) => string)`   | (Optional) The text to display in the cell's tooltip. Can be a static string or a function.             |

### Table Configuration (`ITableOptions<T>`)

Customize the table's features with this optional input.

| Property           | Type            | Description                                                                                             |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------- |
| `showFilter`       | `boolean`       | Show or hide the filter input. Defaults to `true`.                                                      |
| `filterOptions`    | `object`        | Configure the filter's `label`, `placeholder`, or provide a custom `filterPredicate` function.          |
| `showPaginator`    | `boolean`       | Show or hide the paginator. Defaults to `true`.                                                         |
| `paginatorOptions` | `object`        | Configure the `pageSizeOptions` array.                                                                  |
| `showSorter`       | `boolean`       | Enable or disable sorting for the entire table. Defaults to `true`.                                     |
| `sorterOptions`    | `object`        | Set the `defaultSortColumn`, `defaultSortDirection`, or provide custom sorting logic.                   |
| `showActions`      | `boolean`       | Show or hide the row actions column. Defaults to `false`.                                               |
| `actionOptions`    | `object`        | Configure row actions, including an array of `actions` and `buttonStyles`.                              |
| `showTableActions` | `boolean`       | Show or hide the global table actions menu in the header. Defaults to `false`.                          |
| `tableActionOptions`| `object`       | Configure global table actions, including an array of `actions` and `buttonStyles`.                     |
| `noTableRow`       | `Type<unknown>` | (Optional) A custom component to display when the table has no data.                                  |
| `tableStyles`      | `object`        | (Optional) A map of CSS styles to apply to the `<table>` element.                                       |

### Default Options

The component has a set of default options. If the `tableOptions` input is not provided, or if specific properties within it are omitted, these defaults will be used.

```typescript
const defaultTableOptions = {
  showFilter: true,
  filterOptions: {
    label: 'Filter',
  },
  showPaginator: true,
  paginatorOptions: {
    pageSizeOptions: [5, 10, 25, 100],
  },
  showSorter: true,
  sorterOptions: {
    defaultSortDirection: 'asc',
  },
  showActions: false,
  showTableActions: false,
};
```

---

## Advanced Examples

### 1. Using a Data Transformer

Use a `transformer` function to format data, such as a `Date` object.

```typescript
import { IColumnMap } from '@lordkriegan/mat-data-table';

userColumns: IColumnMap<User>[] = [
  // ... other columns
  {
    key: 'registeredOn',
    label: 'Registration Date',
    transformer: (date: Date) => new Intl.DateTimeFormat('en-US').format(date),
    dataCellStyles: { 'font-style': 'italic' }
  }
];
```

### 2. Adding Row Actions

Enable `showActions` and provide an array of actions. Use `{ divider: true }` to add a separator in the menu. You can also style the action button using `buttonStyles`.

```typescript
import { ITableOptions, IMenuAction } from '@lordkriegan/mat-data-table';

rowActions: IMenuAction<User>[] = [
  {
    icon: 'edit',
    label: 'Edit User',
    fxn: (row: User) => console.log('Editing user:', row.id),
  },
  { divider: true },
  {
    icon: 'delete',
    label: 'Delete User',
    fxn: (row: User) => console.warn('Deleting user:', row.id),
  },
];

options: ITableOptions<User> = {
  showActions: true,
  actionOptions: {
    buttonStyles: { color: 'blue' },
    actions: this.rowActions,
  },
};
```

### 3. Using a Custom Cell Component

For complex cell content, provide your own component. This example also shows how to pass additional inputs to it using `componentInputs` and display a dynamic `tooltip`.

**a. Create the custom cell component:**

```typescript
// status-label.component.ts
import { Component, Input } from '@angular/core';
import { IMaterialTableCell } from '@lordkriegan/mat-data-table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatIconModule],
  template: `<span class="status-chip" [class]="data">{{ data }} <mat-icon *ngIf="showIcon">check_circle</mat-icon></span>`,
  styles: [`.status-chip { padding: 4px 8px; border-radius: 12px; color: white; } .active { background-color: green; } .inactive { background-color: gray; }`]
})
export class StatusLabelComponent implements IMaterialTableCell<'active' | 'inactive'> {
  @Input() data!: 'active' | 'inactive';
  @Input() showIcon: boolean = false; // Custom input
}
```

**b. Use it in your column definition:**

```typescript
import { StatusLabelComponent } from './status-label.component';

userColumns: IColumnMap<User>[] = [
  // ... other columns
  {
    key: 'status',
    label: 'Status',
    component: StatusLabelComponent,
    componentInputs: { showIcon: true }, // Pass the input here
    tooltip: (status) => `The user is currently ${status}`, // Dynamic tooltip
  }
];
```

### 4. Adding Global Table Actions

Add a menu to the table header for actions that apply to the entire table, like "Export" or "Add New".

```typescript
import { ITableOptions, IMenuAction } from '@lordkriegan/mat-data-table';

tableActions: IMenuAction<void>[] = [
  {
    icon: 'add',
    label: 'Add New User',
    fxn: () => console.log('Adding a new user...'),
  },
  {
    icon: 'download',
    label: 'Export as CSV',
    fxn: () => console.log('Exporting data...'),
  },
];

options: ITableOptions<User> = {
  showTableActions: true,
  tableActionOptions: {
    buttonStyles: { color: 'rebeccapurple' },
    actions: this.tableActions,
  },
};
```

### 5. Customizing "No Data" and Table Styles

You can provide a custom component to show when the table is empty and apply global styles to the table element.

**a. Create the "no data" component:**

```typescript
// empty-table.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<div style="padding: 2rem; text-align: center;"><h3>No Users Found</h3><p>Why not add one?</p></div>`,
})
export class EmptyTableComponent {}
```

**b. Configure `noTableRow` and `tableStyles` in your options:**

```typescript
import { EmptyTableComponent } from './empty-table.component';

options: ITableOptions<User> = {
  noTableRow: EmptyTableComponent,
  tableStyles: { 'box-shadow': 'none', 'border': '1px solid #e0e0e0' }
};
```

## License

This project is licensed under the MIT License.