import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { MaterialDataTableComponent, IColumnMap, ITableOptions } from 'material-data-table'
import { AsyncPipe } from '@angular/common';

interface IBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  image: string;
  published: string;
  publisher: string;
}

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MaterialDataTableComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'Test Material Data Table'

  private http = inject(HttpClient)

  refreshTrigger$ = new BehaviorSubject<void>(undefined);
  booksSubject = new BehaviorSubject<IBook[]>([]);
  books$: Observable<IBook[]> = this.booksSubject.asObservable()

  columnMappings: IColumnMap<IBook>[] = [
    {
      key: 'id',
      label: 'ID',
      sort: true
    },
    {
      key: 'title',
      label: 'Title',
      sort: true
    },
    {
      key: 'author',
      label: 'Author',
      sort: true
    },
    {
      key: 'genre',
      label: 'Genre',
      sort: true
    },
    {
      key: 'description',
      label: 'Description',
      sort: true
    }
  ]

  get tableOptions(): ITableOptions<IBook> {
    return {
      showFilter: false,
      sorterOptions: {
        defaultSortColumn: 'id',
        defaultSortDirection: 'asc'
      },
      paginatorOptions: {
        pageSizeOptions: [5, 10, 20, 50]
      },
      showActions: true,
      actionOptions: {
        actions: [
          {
            icon: 'remove_red_eye',
            label: 'View Book',
            fxn: (row: IBook) => {
              alert(`
                ID: ${row.id}
                Title: ${row.title}
                Author: ${row.author}
                Genre: ${row.genre}
                Description: ${row.description}
                ISBN: ${row.isbn}
                Published: ${row.published}
                Publisher: ${row.publisher}
              `)
            }
          }
        ]
      },
      showTableActions: true,
      tableActionOptions: {
        actions: [
          {
            icon: 'refresh',
            label: 'Refresh',
            fxn: () => this.refresh()
          }
        ]
      }
    }
  }

  ngOnInit(): void {
    this.refreshTrigger$.pipe(
      switchMap(() => this.http.get<{ data: IBook[] }>('https://fakerapi.it/api/v2/books?_quantity=100'))
    ).subscribe({
      next: ({ data: response }) => {
        this.booksSubject.next(response)
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  refresh() {
    this.refreshTrigger$.next()
  }

}
