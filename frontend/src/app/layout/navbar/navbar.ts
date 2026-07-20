import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { RolService } from '../../core/services/roles/roles.service';

interface MenuItem {

  label: string;
  route: string;
  icon: string;
  adminOnly?: boolean;

}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule,
    DividerModule,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  menuOpen = false;

  darkMode = false;

  // Después vendrá del JWT
  isLogged = false;

  isAdmin = true;

  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private rol: RolService
  ) {}

  ngOnInit(){

    this.darkMode =
      localStorage.getItem('darkmode') === 'true';

    document.documentElement.classList.toggle(
      'dark',
      this.darkMode
    );

    if(this.auth.isLogged()){
      const data = this.auth.decodeToken();
      this.menuItems = data.modulos;
      this.isLogged = true;
      
    }else if(!this.auth.isLogged()){

      this.rol.get_rol().subscribe({
        next: (menu) => {
          this.menuItems = menu;
        }
      })
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem(
      "darkmode",
      String(this.darkMode)
    )
    document.documentElement.classList.toggle('dark');
  }

  login(): void {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  goProfile(): void {
    this.closeMenu();
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}