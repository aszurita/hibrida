import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, peopleCircle,clipboardOutline,rocket, homeSharp, locationOutline, settingsOutline, clipboardSharp, locationSharp, settingsSharp, homeOutline, peopleCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({homeOutline,clipboardOutline,peopleCircleOutline,settingsOutline,homeSharp,clipboardSharp,locationSharp,settingsSharp,locationOutline,peopleCircle,triangle,ellipse,square,rocket});
  }
  
}
