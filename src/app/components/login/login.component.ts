import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });


  constructor(private authService: AuthService, private toast: HotToastService, private router: Router) { }

  ngOnInit(): void {
  }


  submit() {
    if (!this.loginForm.valid) {
      this.toast.error('Invalid or missing data');
      return;
    }
    else{
      const { email, password } = this.loginForm.value;
      this.authService.login(email || '', password || '').pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: ({ message }) => ` ${message} `
        })
      ).subscribe(() => {
        this.router.navigate(['/'])
      })
  }

}


}
