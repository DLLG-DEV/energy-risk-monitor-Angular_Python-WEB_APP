import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    Navbar,
    Footer,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
