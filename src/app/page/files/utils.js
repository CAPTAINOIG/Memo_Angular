{/* <div class="mb-4" *ngIf="!isLoading">
<ul id="file-filter" class="list-inline mb-3">
    <div>
        <span class="list-inline-item mb-0">
            <button [disabled]="isLoadingNext" class="btn btn-primary" (click)="previous()">
                <span *ngIf="isLoadingPrevious" class="spinner-border spinner-border-sm"
                    role="status" aria-hidden="true"></span>
                {{ isLoadingPrevious ? '' : 'Previous' }}
            </button>
        </span>

        <span class="list-inline-item mb-0">
            <button [disabled]="isLoadingPrevious" class="btn btn-primary" (click)="next()">
                <span *ngIf="isLoadingNext" class="spinner-border spinner-border-sm"
                    role="status" aria-hidden="true"></span>
                {{ isLoadingNext ? '' : 'Next' }}
            </button>
        </span>
    </div>
</ul>
<div class="d-flex justify-content-between" *ngFor="let item of allFile">
    
    <div class="form-group">
        <label>Search by Title</label>
        <input type="text" class="form-control" [(ngModel)]="searchTerm"
            placeholder="Enter title to search">
    </div>
    <div>
        <button class="btn btn-primary" (click)="approveMemo()">Approve</button>
        <button class="btn btn-primary" (click)="rejectMemo()">Reject</button>
    </div>
    <div>
        <button class="btn btn-primary">Approved Memo</button>
    </div>
</div>
</div> */}
