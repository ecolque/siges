import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-list-container',
  templateUrl: './search.list.container.component.html',
  styleUrls: ['./../search.component.css']
})
export class SearchListContainerComponent implements OnInit {
  @Input() list: any;
  constructor() { }

  ngOnInit() {
  }

}
