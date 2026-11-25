import { Component } from '@angular/core';
import { Header } from '../../shared/UI/header/header';
import { Footer } from '../../shared/UI/footer/footer';

@Component({
  selector: 'app-batteries',
  imports: [Header, Footer],
  templateUrl: './batteries.html',
  styleUrl: './batteries.css',
})
export class Batteries {}
