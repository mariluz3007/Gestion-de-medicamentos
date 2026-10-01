import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicamentoService } from '../services/medicamento.service';
import { Medicamento } from '../interfaces/medicamento.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  medicamentos: Medicamento[] = [];

  constructor(
    private medicamentoService: MedicamentoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;
        console.log('Medicamentos:', data);
      },
      error: (error) => {
        console.error('Error al obtener medicamentos:', error);
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}