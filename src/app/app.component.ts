import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet, IonContent, IonButton],
})
export class AppComponent implements OnInit {
  showSplash = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // If you want to show splash screen only on first visit,
    // you can check localStorage here
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      this.showSplash = false;
    }
  }

  navigateToTabs() {
    this.showSplash = false;
    localStorage.setItem('hasVisited', 'true');
    this.router.navigate(['/tabs']);
  }
}