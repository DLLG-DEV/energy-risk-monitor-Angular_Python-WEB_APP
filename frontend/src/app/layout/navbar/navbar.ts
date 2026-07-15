import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  darkMode: boolean = false;
  menuOpen: boolean = false;
  
  toggleDarkMode() {
      this.darkMode = !this.darkMode;

    document.documentElement.classList.toggle('dark');
  }

}
