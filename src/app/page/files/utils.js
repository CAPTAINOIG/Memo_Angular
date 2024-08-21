{/* <div class="mb-4">
    <div class="table-responsive" *ngIf="!isLoading">
        <table class="table table-borderless table-hover mb-0">
            <thead>
            <tr>
                <th>Name</th>
                <th>Date Created</th>
                <th>Label</th>
            </tr>
            </thead>
            <tbody *ngFor="let item of allFolder">
            <tr>
                <td>
                    <a href="#">
                        <figure class="avatar avatar-sm mr-2">
                            <span class="avatar-title bg-warning text-black-50 rounded-pill">
                                <i class="ti-folder"></i>
                            </span>
                        </figure>
                        {{item?.MemTitle}}
                    </a>
                </td>
                
                <td>{{item?.CreatedAt}}</td>
               
                <td>
                    {{item?.MemFold?.MemFoldName}}
                </td>
               
                <td class="text-right">
                    <div class="dropdown">
                        <a href="#" class="btn btn-floating" data-toggle="dropdown">
                            <i class="ti-more-alt"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            
                             <span class="dropdown-item" (click)="editFiles(allFolder)">Edit</span>
                           
                        </div>
                    </div>
                </td>
            </tr>
           
            </tbody>
        </table>
    </div>
</div> */}