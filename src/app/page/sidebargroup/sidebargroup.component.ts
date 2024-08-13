import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebargroup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebargroup.component.html',
  styleUrl: './sidebargroup.component.css',
})
export class SidebargroupComponent {
  @Input() prop: boolean;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  handleClick() {
    const data = 'Hello from Child!';
    this.dataEmitter.emit(data); // Emit the data to the parent
  }
}
