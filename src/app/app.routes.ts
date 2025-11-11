import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ClientesComponent } from './pages/clientes/clientes';
import { MedidoresComponent } from './pages/medidores/medidores';
import { BoletasComponent} from './pages/boletas/boletas';
import { LecturasComponent} from './pages/consumos/consumos';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'lecturas', component: LecturasComponent },
  { path: 'medidores', component: MedidoresComponent },
  { path: 'boletas', component: BoletasComponent },
  { path: 'consumos', component: LecturasComponent},
];
