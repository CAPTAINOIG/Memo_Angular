import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './external-viewer.component.html',
  styleUrls: ['./external-viewer.component.css']
})
export class ExternalViewerComponent implements OnInit {
  itemId: string | null = null;
  status: string = "isLoading";
  message: string = "";
  isLoading: boolean = false;
  data: any = undefined;

  constructor(private http: HttpRequestService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      this.getData();
    });
  }


  getData(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!latitude || !longitude) {
          this.status = 'error';
          this.message = "Unable to retrieve your location coordinates.";
          this.isLoading = false;
          return;
        }

        this.isLoading = true;
        this.status = "isLoading";

        this.http.makeGetRequest(`/memo/get_mem_by_memuniqueid/?id=${this.itemId}&lat=${latitude}&long=${longitude}`)
          .subscribe(
            (response) => {
              console.log(response.data);
              this.data = response.data;
              this.status = "data";
              this.isLoading = false;
            },
            (error) => {
              this.status = 'error';
              this.message = error.error.message;
              console.error(error);
              this.isLoading = false;
            }
          );
      },
      (error: any) => {
        this.status = 'error';
        this.message = "This page requires your location to fetch the data";
        console.error('Error retrieving location:', error);
      },
      {
        enableHighAccuracy: true, // Request more accurate location data
        timeout: 10000, // Timeout after 10 seconds
        maximumAge: 0 // Do not use cached location
      }
    );
  }


}
