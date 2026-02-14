import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Background } from './components/background/background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Background],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Nahuel Guillermo');
}
