import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';

@Component({
  selector: 'app-esignature',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './esignature.component.html',
  styleUrl: './esignature.component.css'
})

export class EsignatureComponent implements OnInit {
  esignature = {
    title: '',
    image_path: ''
  };
  recordExists = false;

  constructor(private http: HttpRequestService) {}

  ngOnInit(): void {
    this.checkForExistingRecord();
  }

  checkForExistingRecord() {
    this.http.makeGetRequest('/api/esignatures').subscribe((data: any) => {
      if (data.length > 0) {
        this.esignature = data[0];
        this.recordExists = true;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.esignature.image_path = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addESignature() {
    console.log(this.esignature);
    this.http.makePostRequest('/api/esignatures', this.esignature).subscribe(() => {
      this.checkForExistingRecord();
    });
  }

  updateESignature() {
    // this.http.makePatchRequest(`/api/esignatures/${this.esignature.id}`, this.esignature).subscribe(() => {
    //   this.checkForExistingRecord();
    // });
  }
}
