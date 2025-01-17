import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
  ],
})
export class Tab3Page implements OnInit {

  dataList: any[] = [];

  collectionName = 'reviews';


  myForm: FormGroup = new FormGroup({
    score: new FormControl('', Validators.required),
    opinion: new FormControl('', Validators.required),
  });


  constructor(private providerService: ProviderService) {}


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.providerService.readCollection(this.collectionName).subscribe((data: any[]) => {
      this.dataList = data.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
    });
  }

  /* Enviar datos a Firestore */
  onSubmit() {
    if (this.myForm.valid) {
      const formData = {
        ...this.myForm.value,
        timestamp: new Date(), // Agregar marca de tiempo
      };

      this.providerService
        .createDocument(this.collectionName, formData)
        .then(() => {
          this.myForm.reset();
        })
        .catch((error) => {
          console.error('Error al enviar los datos:', error);
        });
    }
  }
}