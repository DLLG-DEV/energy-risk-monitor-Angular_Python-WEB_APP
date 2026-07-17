import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { RolService } from '../../services/roles/roles.service';

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

    if(this.auth.isLogged()){
      // AUN NECESTIO EL INTERRPRETADOR DEL TOKEN
      this.auth.getToken()

    }else if(!this.auth.isLogged()){

      this.rol.rolDefault().subscribe({
        next: (menu) => {
          this.menuItems = menu.modules;
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
    // Aquí después limpiarás el JWT
    this.router.navigate(['/login']);
  }

}