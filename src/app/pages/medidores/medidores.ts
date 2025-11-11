import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedidorService } from '../../services/medidores';
import { Medidor } from '../../models/medidor.model';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medidores.html'
})
export class MedidoresComponent implements OnInit {
  medidores: Medidor[] = [];
  nuevoMedidor: Medidor = this.nuevoModelo();
  editando: boolean = false;
  mensaje: string | null = null;
  error: string | null = null;
  cargando: boolean = false;

  constructor(private medidorService: MedidorService) {}

  ngOnInit(): void {
    this.cargarMedidores();
  }

  private nuevoModelo(): Medidor {
    return {
      codigo_medidor: '',
      id_cliente: 0,
      direccion_suministro: '',
      estado: true
    };
  }

  private limpiarMensajes() {
    this.mensaje = null;
    this.error = null;
  }

  private mostrarMensaje(mensaje: string, tipo: 'ok' | 'error' = 'ok') {
    if (tipo === 'ok') this.mensaje = mensaje;
    else this.error = mensaje;

    setTimeout(() => {
      this.mensaje = null;
      this.error = null;
    }, 4000);
  }

  // 🔹 Cargar lista de medidores
  cargarMedidores() {
    this.cargando = true;
    this.medidorService.getMedidores().subscribe({
      next: (data) => {
        this.medidores = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarMensaje('No se pudieron cargar los medidores.', 'error');
        this.cargando = false;
      }
    });
  }

  // 🔹 Guardar (agregar o editar)
  guardarMedidor() {
    this.limpiarMensajes();

    if (!this.nuevoMedidor.codigo_medidor.trim()) {
      this.mostrarMensaje('Debe ingresar un código de medidor.', 'error');
      return;
    }

    if (this.nuevoMedidor.id_cliente <= 0) {
      this.mostrarMensaje('Debe ingresar un ID de cliente válido.', 'error');
      return;
    }

    if (!this.nuevoMedidor.direccion_suministro.trim()) {
      this.mostrarMensaje('Debe ingresar una dirección de suministro.', 'error');
      return;
    }

    if (this.editando && this.nuevoMedidor.id_medidor) {
      // Actualizar
      this.medidorService.updateMedidor(this.nuevoMedidor.id_medidor, this.nuevoMedidor).subscribe({
        next: () => {
          this.cargarMedidores();
          this.mostrarMensaje('✏️ Medidor actualizado correctamente.');
          this.nuevoMedidor = this.nuevoModelo();
          this.editando = false;
        },
        error: () => this.mostrarMensaje('Error al actualizar el medidor.', 'error')
      });
    } else {
      // Crear
      this.medidorService.addMedidor(this.nuevoMedidor).subscribe({
        next: () => {
          this.cargarMedidores();
          this.nuevoMedidor = this.nuevoModelo();
          this.mostrarMensaje('✅ Medidor agregado correctamente.');
        },
        error: () => this.mostrarMensaje('Error al agregar el medidor.', 'error')
      });
    }
  }

  // 🔹 Eliminar
  eliminarMedidor(id: number) {
    if (confirm('¿Seguro que deseas eliminar este medidor?')) {
      this.medidorService.deleteMedidor(id).subscribe({
        next: () => {
          this.cargarMedidores();
          this.mostrarMensaje('🗑️ Medidor eliminado correctamente.');
        },
        error: () => this.mostrarMensaje('No se pudo eliminar el medidor.', 'error')
      });
    }
  }

  // 🔹 Cambiar estado
  cambiarEstado(id: number) {
    this.medidorService.cambiarEstado(id).subscribe({
      next: () => {
        this.cargarMedidores();
        this.mostrarMensaje('🔄 Estado del medidor actualizado.');
      },
      error: () => this.mostrarMensaje('Error al cambiar estado.', 'error')
    });
  }

  // 🔹 Cargar datos en el formulario
  updateMedidor(medidor: Medidor) {
    this.nuevoMedidor = { ...medidor }; // Copiamos el medidor al formulario
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
  }

  // 🔹 Cancelar edición
  cancelarEdicion() {
    this.nuevoMedidor = this.nuevoModelo();
    this.editando = false;
  }
}
