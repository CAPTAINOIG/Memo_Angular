import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
  selector: 'app-editmemo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editmemo.component.html',
  styleUrl: './editmemo.component.css'
})
export class EditmemoComponent {
memo: any;
createEditForm: FormGroup;
isLoading = false;
editMemo: any

constructor(private fb: FormBuilder, private sidebarService: ServicesidebarService){ }


ngOnInit() {
  this.editMemo = this.sidebarService.getEditMemo();
  console.log(this.editMemo);
}
onSubmit(){

}
// updateContent(content: string): string {
//   return content.replace(/<\/?p>/g, ''); // Removes <p> and </p> tags
// }
}
