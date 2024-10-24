import { Component } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 

@Component({
  selector: 'app-createfolder',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './createfolder.component.html',
  styleUrl: './createfolder.component.css'
})
export class CreatefolderComponent {
  isLoading = false;
  name: string = '';
  folder: any;
  constructor(private httpRequest: HttpRequestService) { }


  onSubmit() {
    if(!this.name){
      console.log('here');
      Toastify({
        text: 'invalid',
        gravity: 'top',
        duration: 3000,
        backgroundColor: 'red',
        position: 'right',
      }).showToast();
      return;
    }
    this.isLoading = true;
    this.httpRequest.makePostRequest('/memo/folder/create', { name: this.name }).subscribe(
      (response) => {
        this.folder = response.data
        console.log(this.folder);
        this.isLoading = false;
        Toastify({
          text: "successful!",
          duration: 3000,
          gravity: "top",
          position: "right", 
          backgroundColor: "blue",
        }).showToast();
      },
      (error) => {
        console.error('Error updating memo:', error);
        this.isLoading = false;
        Toastify({
          text: `${error.error.message}`,
          duration: 3000,
          gravity: "top",
          position: "right", 
          backgroundColor: "red",
        }).showToast();
      }
    );
  }
}
