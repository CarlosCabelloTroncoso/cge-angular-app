import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  // ✅ El menú está cerrado por defecto
  menuClosed = true;

  // ✅ Abre o cierra el menú al presionar el botón
  toggleMenu() {
    this.menuClosed = !this.menuClosed;
  }

  // ✅ Cierra el menú cuando seleccionas una opción o haces clic fuera
  closeMenu() {
    this.menuClosed = true;
  }
}
