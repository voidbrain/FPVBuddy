import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "../../shared/UI/header/header";
import { Footer } from "../../shared/UI/footer/footer";

@Component({
  selector: 'app-batteries',
  imports: [
    CommonModule,
    Header,
    Footer,
  ],
  templateUrl: './batteries.html',
  styleUrl: './batteries.css',
})
export class Batteries implements OnInit {
  // private sqlite = inject(Sqlite);
  // private actionSheetController = inject(ActionSheetController);
  // private modalController = inject(ModalController);
  // private transloco = inject(TranslocoService);
  // private toast = inject(ToastService);

  // protected batteriesWithStatus = signal<BatteryWithStatus[]>([]);
  // protected groupedBatteries = signal<Map<string, BatteryWithStatus[]>>(new Map());
  // protected isLoading = signal(false);
  // protected settings = signal<Settings | null>(null);

  async ngOnInit() {

  }


}
