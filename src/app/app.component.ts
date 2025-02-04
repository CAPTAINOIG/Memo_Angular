import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import "toastify-js/src/toastify.css";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet,],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'memoapp';
}
