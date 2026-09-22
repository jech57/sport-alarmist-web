import { Component } from '@angular/core';
import { EmptyStateDoodle } from '../../shared/illustrations/empty-state-doodle/empty-state-doodle';

@Component({
  selector: 'app-home',
  imports: [EmptyStateDoodle],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
