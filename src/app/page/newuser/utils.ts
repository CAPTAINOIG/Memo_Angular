<app-navigation></app-navigation>
<app-sidebar></app-sidebar>

<div class="">
  <div class="col-md-8 col-lg-5 col-sm-3 mx-auto mt-5 shadow px-5 py-3">
      <h3 class="mt-5 text-center">Create User</h3>
      
      <!-- form -->
      <form [formGroup]="createUserForm" (ngSubmit)="onSubmit()">

        <div class="form-group">
            <label for="full_name">Full Name</label>
            <input
              type="text"
              class="form-control"
              formControlName="full_name"
              placeholder="Full Name"
              required> 
          </div>

        <div class="form-group">
            <label for="email">Email address</label>
            <input formControlName="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your
                email with
                anyone else.
            </small>
        </div>

      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input
          type="tel"
          class="form-control"
          formControlName="phone"
          placeholder="Phone Number"
          required>
      </div>

      <div class="form-group">
        <label for="role_id">Select Role</label>
        <select
          class="form-control"
          formControlName="role_id"
          required>
          <option value="" disabled selected>Select Role</option>
          <option *ngFor="let role of userRoles" [value]="role.id">{{ role.RoleName }}</option>
        </select>
      </div>

      <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-block w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
        {{ isLoading ? 'Submitting...' : 'Create User' }}
      </button>

    </form>
  </div>
</div>
