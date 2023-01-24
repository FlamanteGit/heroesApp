import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css'],
})
export class AgregarComponent {
  publishers = ['DC Comics', 'Marvel Comics'];
  heroe: Heroe = {
    superhero: '',
    alt_img: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('edit')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.heroesService.getHeroeById(id)))
        .subscribe((heroe) => (this.heroe = heroe));
    }
  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      console.log(this.heroe.superhero);
      return;
    }

    if (this.heroe.id) {
      // Actualizar
      this.heroesService.actualizarHeroe(this.heroe).subscribe((heroe) => {
        console.log('Actualizando ', heroe);
        this.mostrarSnackbar('Heroe actualizado');
      });
    } else {
      // Crear
      this.heroesService.agregarHeroe(this.heroe).subscribe((heroe) => {
        this.router.navigate(['/heroes/editar', heroe.id]);
        this.mostrarSnackbar('Heroe creado');
      });
    }
  }

  borrar() {
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      data: { ...this.heroe },
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.heroesService.borrarHeroe(this.heroe.id!).subscribe((resp) => {
          this.router.navigate(['/heroes']);
          this.mostrarSnackbar('Heroe eliminado');
        });
      }
    });
  }

  mostrarSnackbar(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 2500,
    });
  }
}
