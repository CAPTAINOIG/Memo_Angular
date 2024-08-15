import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  // handleClick() {
  //   const data = 'Hello from Child!';
  //   this.dataEmitter.emit(data); // Emit the data to the parent
  // }

}
