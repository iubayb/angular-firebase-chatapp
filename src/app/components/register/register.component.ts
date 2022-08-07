import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    }
  );

  constructor(private toast: HotToastService, private authService : AuthService, private router: Router,private userService: UserService) { }

  ngOnInit(): void {
  }


  submit() {
    if (!this.registerForm.valid) {
      this.toast.error('Invalid or missing data');  
      return;
    }
    else{
      const { name, email, password } = this.registerForm.value;
      this.authService.register(email || '', password || '').pipe(
        switchMap(({user: {uid}}) => this.userService.addUser({uid, name: name || ''})),
        this.toast.observe({
          success: 'Registered successfully',
          loading: 'Registering...',
          error: ({ message }) => ` ${message} `
        })
      ).subscribe(() => {
        this.router.navigate(['/'])
      })
  }

  }

}
