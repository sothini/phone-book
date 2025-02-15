import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export class ProfileManagementComponent implements OnInit {
  public updateMyProfileForm!: FormGroup;
  public updatePasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.updateMyProfileForm = this.formBuilder.group({
      name: [user.name ?? '', Validators.required],
      email: [user.email ?? '', [Validators.required, Validators.email]],
    });
    this.updatePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  updateProfile(): void {
    if (this.updateMyProfileForm?.valid) {
      this.apiService.updateProfile(this.updateMyProfileForm.value.name, this.updateMyProfileForm.value.email).pipe(
        tap((success) => {
          if (success) {
            alert('Updated successfully');
          } else {
            alert('Update failed');
          }
        }),
        catchError((error) => {
          alert('Update failed:'+error.error.message);
          console.error('An error occurred:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  updatePassword(): void {
    if (this.updatePasswordForm?.valid) {
      this.apiService.updatePassword(this.updatePasswordForm.value.currentPassword,
        this.updatePasswordForm.value.newPassword,this.updatePasswordForm.value.confirmPassword)
      .pipe(
        tap((success) => {
          if (success) {
            alert('Updated successfully');
          } else {
            alert('Update failed');
          }
        }),
        catchError((error) => {
          alert('Update failed:'+error.error.message);
          console.error('An error occurred:', error);
          return of(null);
        })
      ).subscribe();
    }
  }
}
