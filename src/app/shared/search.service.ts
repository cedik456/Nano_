import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new Subject<string>();
  searchTerm$ = this.searchTerm.asObservable();

  setSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }
}
