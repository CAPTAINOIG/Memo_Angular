import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';

@Component({
  selector: 'app-editmemo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './editmemo.component.html',
  styleUrls: ['./editmemo.component.css']
})
export class EditmemoComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  editor: Editor;
  createEditForm: FormGroup;
  isLoading = false;
  editMemo: any;

  constructor(private fb: FormBuilder, private httpRequest: HttpRequestService, private sidebarService: ServicesidebarService) {
    this.editor = new Editor();
    this.createEditForm = this.fb.group({
      title: [''],
      memo: [''],
    });
  }

  ngOnInit() {
    this.editMemo = this.sidebarService.getEditMemo();
    console.log(this.editMemo);
    
    // Populate the form with editMemo data
    if (this.editMemo) {
      this.createEditForm.patchValue({
        title: this.editMemo.MemTitle,
        memo: this.editMemo.MemContents,
      });
    }
  }

  onSubmit() {
    this.isLoading=true;
    // Create the memo object using form values
    const memo = {
      title: this.createEditForm.value.title,
      memo: this.createEditForm.value.memo,
      memId: this.editMemo.MemUniqueId,
      memFold: this.editMemo.MemFoldId || null,
    };

    console.log(memo); // Log the memo object to check its structure

    // Make the PATCH request
    this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
      (response) => {
        console.log(response); 
        this.createEditForm.reset();
        this.isLoading= false; 
      },
      (error) => {
        console.error('Error updating memo:', error);
        this.isLoading= false
      }
    );
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}
