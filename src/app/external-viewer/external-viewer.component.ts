import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-external-viewer',
  standalone: true,
  imports: [],
  templateUrl: './external-viewer.component.html',
  styleUrl: './external-viewer.component.css'
})
export class ExternalViewerComponent implements OnInit {
  itemId: string | null = null;
  constructor(private http:HttpRequestService,private route: ActivatedRoute){

  }
  public data:any=undefined;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
    });
    
  }

  getData(){
    this.http.makeGetRequest("/memo/get_mem_by_memuniqueid/?id="+this.itemId).subscribe((response)=>{
      console.log(response)

    })
  }




}
