import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  router:Router = inject(Router);


  logOut() {
   if(confirm(`Are you sure you want to log Out`)){
    this.authenticationService.logOut()
    this.router.navigate([""])
   }
  }
}
