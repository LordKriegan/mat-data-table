# @lordkriegan/mat-data-table

[!npm version](https://www.npmjs.com/package/@lordkriegan/mat-data-table)
[!npm license](https://www.npmjs.com/package/@lordkriegan/mat-data-table)

A powerful, dynamic, and easy-to-configure data table component for Angular, built on top of Angular Material. This standalone component simplifies the process of displaying data with features like client-side filtering, sorting, and pagination.

## Features

- **Dynamic Columns:** Define columns from a simple configuration object.
- **Type-Safe:** Ensures type safety between your data and column definitions.
- **Client-Side Operations:** Built-in filtering, sorting, and pagination.
- **Custom Cell Rendering:** Use your own Angular components to render complex cell content.
- **Data Transformers:** Easily format data like dates and currency using simple functions.
- **Row Actions:** Add a configurable actions menu to each row.
- **Observable Support:** Accepts data as a static array or an `Observable`.

## Peer Dependencies

This library requires you to have the following packages installed in your project:

```json
{
  "@angular/common": "^18.0.0 || ^19.0.0",
  "@angular/core": "^18.0.0 || ^19.0.0",
  "@angular/material": "^18.0.0 || ^19.0.0"
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

| Input              | Type                               | Required | Description                                                                                             |
| ------------------ | ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `tableData`        | `T[] \| Observable<T[]> \| null`   | Yes      | The data to display in the table.                                                                       |
| `columnMappings`   | `IColumnMap<T>[]`                  | Yes      | An array of objects that define the table's columns.                                                    |
| `tableOptions`     | `ITableOptions<T>`                 | No       | An object to configure optional features like filtering, sorting, pagination, and row actions.          |

### Column Configuration (`IColumnMap<T>`)

Each object in the `columnMappings` array configures a single column.

| Property           | Type                                     | Description                                                                                             |
| ------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `key`              | `keyof T`                                | The property key from your data object `T` to display in this column.                                   |
| `label`            | `string`                                 | The text to display in the column header.                                                               |
| `sort`             | `boolean`                                | (Optional) Set to `true` to make this column sortable. Defaults to `false`.                             |
| `dataCellStyles`   | `object`                                 | (Optional) A map of CSS styles to apply to the data cells (`<td>`) in this column.                      |
| `headerCellStyles` | `object`                                 | (Optional) A map of CSS styles to apply to the header cell (`<th>`).                                    |
| `component`        | `Type<IMaterialTableCell<T[K]>>`         | (Optional) An Angular component to render the cell content. Overrides `transformer`.                    |
| `transformer`      | `(data: T[K]) => string`                 | (Optional) A function to format the cell data for display. Ignored if `component` is provided.          |

### Table Configuration (`ITableOptions<T>`)

Customize the table's features with this optional input.

| Property         | Type      | Description                                                                                             |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `showFilter`     | `boolean` | Show or hide the filter input. Defaults to `true`.                                                      |
| `filterOptions`  | `object`  | Configure the filter's `label`, `placeholder`, or provide a custom `filterPredicate` function.          |
| `showPaginator`  | `boolean` | Show or hide the paginator. Defaults to `true`.                                                         |
| `paginatorOptions`| `object`  | Configure the `pageSizeOptions` array.                                                                  |
| `showSorter`     | `boolean` | Enable or disable sorting for the entire table. Defaults to `true`.                                     |
| `sorterOptions`  | `object`  | Set the `defaultSortColumn`, `defaultSortDirection`, or provide custom sorting logic.                   |
| `showActions`    | `boolean` | Show or hide the row actions column. Defaults to `false`.                                               |
| `actionOptions`  | `object`  | Provide an array of `actions` to display in the menu for each row.                                      |

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

Enable `showActions` and provide an array of actions. Use `{ divider: true }` to add a separator in the menu.

```typescript
import { ITableOptions, IMenuAction } from '@lordkriegan/mat-data-table';

rowActions: IMenuAction<User>[] = [
  {
    icon: 'edit',
    label: 'Edit User',
    fxn: (row: User) => console.log('Editing user:', row.id),
  },
  {
    icon: 'content_copy',
    label: 'Duplicate User',
    fxn: (row: User) => console.log('Duplicating user:', row.id),
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
    actions: this.rowActions,
  },
};
```

### 3. Using a Custom Cell Component

For complex cell content, you can provide your own component.

**a. Create the custom cell component:**

```typescript
// status-label.component.ts
import { Component, Input } from '@angular/core';
import { IMaterialTableCell } from '@lordkriegan/mat-data-table';

@Component({
  standalone: true,
  template: `<span class="status-chip" [class]="data">{{ data }}</span>`,
  styles: [`.status-chip { padding: 4px 8px; border-radius: 12px; color: white; } .active { background-color: green; } .inactive { background-color: gray; }`]
})
export class StatusLabelComponent implements IMaterialTableCell<'active' | 'inactive'> {
  @Input() data!: 'active' | 'inactive';
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
    component: StatusLabelComponent
  }
];
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
