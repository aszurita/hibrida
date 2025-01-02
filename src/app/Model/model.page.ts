import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUploadOutline, trashOutline, checkmarkCircleOutline,
  warningOutline, alertCircleOutline, refreshOutline
} from 'ionicons/icons';
import { TeachablemachineService } from '../services/teachablemachine.service';
import { NgClass, NgIf, NgFor, NgStyle } from '@angular/common';

interface InfoSection {
  agentes_causales: string[];
  sintomas: string[];
  diagnostico: string[];
  tratamiento: string[];
  prevencion: string[];
}

interface Info {
  "NEUMONÍA VIRAL": InfoSection;
  "NEUMONÍA BACTERIAL": InfoSection;
}

@Component({
  selector: 'app-model-page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonButton, IonIcon,
    NgClass, NgIf, NgFor, NgStyle
  ]
})
export class ModelPage {
  private readonly info: Info = {
    "NEUMONÍA VIRAL": {
      "agentes_causales": [
        "Virus como el de la influenza",
        "Virus sincitial respiratorio (VSR)",
        "Coronavirus"
      ],
      "sintomas": [
        "Inicio gradual con fiebre moderada a alta",
        "Tos seca persistente",
        "Dolor de garganta y malestar general",
        "Posibles síntomas gastrointestinales como náuseas y diarrea, especialmente en niños"
      ],
      "diagnostico": [
        "Evaluación clínica y antecedentes del paciente",
        "Pruebas de laboratorio y estudios de imagen para confirmar el diagnóstico"
      ],
      "tratamiento": [
        "No responde a antibióticos",
        "Reposo y adecuada hidratación",
        "Medicamentos para aliviar la fiebre y la tos",
        "Antivirales específicos en algunos casos (como en la influenza)"
      ],
      "prevencion": [
        "Vacunación anual contra la influenza",
        "Prácticas de higiene como lavado frecuente de manos y uso de mascarillas",
        "Evitar el contacto cercano con personas infectadas",
        "Mantener un estilo de vida saludable para fortalecer el sistema inmunológico"
      ]
    },
    "NEUMONÍA BACTERIAL": {
      "agentes_causales": [
        "Streptococcus pneumoniae",
        "Haemophilus influenzae",
        "Staphylococcus aureus"
      ],
      "sintomas": [
        "Aparición repentina de fiebre alta y escalofríos",
        "Tos productiva con esputo de color amarillo, verde o con sangre",
        "Dolor en el pecho que empeora con la respiración profunda o la tos",
        "Dificultad para respirar y fatiga"
      ],
      "diagnostico": [
        "Evaluación clínica detallada",
        "Radiografía de tórax que muestra consolidaciones pulmonares",
        "Cultivos de esputo y hemocultivos para identificar el agente bacteriano"
      ],
      "tratamiento": [
        "Antibióticos dirigidos según el tipo de bacteria identificada",
        "Completar el curso completo de antibióticos según la prescripción médica",
        "En casos graves, hospitalización para administración intravenosa de antibióticos y soporte respiratorio"
      ],
      "prevencion": [
        "Vacunación con la vacuna antineumocócica (niños menores de 2 años, adultos mayores de 65 años, personas con condiciones médicas crónicas o sistemas inmunitarios debilitados)",
        "Vacunación contra Haemophilus influenzae tipo b (Hib) en niños",
        "Prácticas de higiene adecuadas y evitar el tabaquismo para mantener la salud pulmonar"
      ]
    }
  };

  isDragging = signal(false);
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  processing = signal(false);
  diagnosis: string | null = null;

  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  constructor(private teachablemachine: TeachablemachineService) {
    addIcons({
      cloudUploadOutline,
      trashOutline,
      refreshOutline,
      checkmarkCircleOutline,
      warningOutline,
      alertCircleOutline
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    if (file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona una imagen en formato JPG o PNG.');
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.diagnosis = null;
  }

  async processImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.processing.set(true);
    try {
      const predictions = await this.teachablemachine.predict(this.imageElement.nativeElement);
      const prediction = predictions.sort((a, b) => b.probability - a.probability)[0].className
      const translator: Record<string, string> = {
        "NORMAL": "NORMAL",
        "PNEUMONIA_BACTERIA": "NEUMONÍA BACTERIAL",
        "PNEUMONIA_VIRAL": "NEUMONÍA VIRAL"
      };
      this.diagnosis = translator[prediction] || prediction;
      console.log(this.diagnosis);
    } catch (error) {
      console.error(error);
      alert('Error al procesar la imagen.');
    } finally {
      this.processing.set(false);
    }
  }


  getDiagnosisIcon(): string {
    if (!this.diagnosis) return '';
    const className = this.diagnosis.toLowerCase();
    if (className.includes('normal')) return 'checkmark-circle-outline';
    if (className.includes('viral')) return 'warning-outline';
    return 'alert-circle-outline';
  }

  reset(): void {
    this.removeFile();
    this.processing.set(false);
  }

  getDiagnosisInfo(): InfoSection | null {
    if (!this.diagnosis) return null;
    if (this.diagnosis.includes('VIRAL')) return this.info["NEUMONÍA VIRAL"];
    if (this.diagnosis.includes('BACTERIAL')) return this.info["NEUMONÍA BACTERIAL"];
    return null;
  }

  getInfoSections(): (keyof InfoSection)[] {
    return ['agentes_causales', 'sintomas', 'diagnostico', 'tratamiento', 'prevencion'];
  }

  getTitle(section: string): string {
    return section.replace('_', ' ').toUpperCase();
  }
}

