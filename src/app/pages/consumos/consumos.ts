import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturaService } from '../../services/consumo';
import { Lectura } from '../../models/consumo.model';

@Component({
  selector: 'app-lecturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consumos.html',
  styleUrls: ['./consumos.css']
})
export class LecturasComponent implements OnInit {
  lecturas: Lectura[] = [];
  nuevaLectura: Lectura = {
    id_medidor: 0,
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    lectura_kwh: 0,
    observacion: ''
  };
  mensaje: string = '';
  filtroMedidor: number | null = null;

  private STORAGE_KEY = 'filtro_medidor'; // nombre del localStorage

  constructor(private lecturaService: LecturaService) {}

  ngOnInit(): void {
    // 🔹 Restaurar filtro guardado
    const filtroGuardado = localStorage.getItem(this.STORAGE_KEY);
    if (filtroGuardado) {
      this.filtroMedidor = Number(filtroGuardado);
      this.filtrarPorMedidor(); // aplica el filtro automáticamente
    } else {
      this.cargarLecturas();
    }
  }

  cargarLecturas() {
    this.lecturaService.getLecturas().subscribe({
      next: (data) => (this.lecturas = data),
      error: (err) => console.error('Error al obtener lecturas:', err)
    });
  }

  agregarLectura() {
    if (
      !this.nuevaLectura.id_medidor ||
      !this.nuevaLectura.anio ||
      !this.nuevaLectura.mes ||
      this.nuevaLectura.lectura_kwh <= 0
    ) {
      this.mensaje = 'Completa todos los campos correctamente.';
      return;
    }

    this.lecturaService.addLectura(this.nuevaLectura).subscribe({
      next: () => {
        this.mensaje = 'Lectura agregada correctamente.';
        this.cargarLecturas();
        this.nuevaLectura = {
          id_medidor: 0,
          anio: new Date().getFullYear(),
          mes: new Date().getMonth() + 1,
          lectura_kwh: 0,
          observacion: ''
        };
      },
      error: (err) => {
        console.error('Error al agregar lectura:', err);
        this.mensaje = 'Error al agregar lectura.';
      }
    });
  }

  filtrarPorMedidor() {
    if (!this.filtroMedidor || this.filtroMedidor <= 0) {
      this.mensaje = 'Ingrese un ID de medidor válido para filtrar.';
      return;
    }

    // 🔹 Guardar filtro en localStorage
    localStorage.setItem(this.STORAGE_KEY, String(this.filtroMedidor));

    this.lecturaService.getLecturas(this.filtroMedidor).subscribe({
      next: (data) => {
        this.lecturas = data;
        this.mensaje = `Mostrando lecturas del medidor #${this.filtroMedidor}.`;
      },
      error: (err) => {
        console.error('Error al filtrar:', err);
        this.mensaje = 'No se pudieron obtener lecturas para ese medidor.';
      }
    });
  }

  limpiarFiltro() {
    this.filtroMedidor = null;
    this.mensaje = '';
    localStorage.removeItem(this.STORAGE_KEY); // 🔹 Elimina filtro guardado
    this.cargarLecturas();
  }
}
