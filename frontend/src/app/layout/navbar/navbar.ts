import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';

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
    RouterLink
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

  menuItems: MenuItem[] = [

    {
      label: 'Dashboard',
      route: '/',
      icon: 'pi-home'
    },

    {
      label: 'Eventos',
      route: '/eventos',
      icon: 'pi-list'
    },

    {
      label: 'Mapa de calor',
      route: '/heatmap',
      icon: 'pi-map'
    },

    {
      label: 'Forecast',
      route: '/forecast',
      icon: 'pi-chart-line'
    },

    {
      label: 'Alarmas',
      route: '/alarmas',
      icon: 'pi-bell'
    },

    {
      label: 'Administración',
      route: '/admin',
      icon: 'pi-cog',
      adminOnly: true
    }

  ];

  constructor(private router: Router) {}

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