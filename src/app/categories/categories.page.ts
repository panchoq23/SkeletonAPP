import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonIcon, IonButtons, IonMenuButton
} from "@ionic/angular/standalone";
import { Router } from "@angular/router";
import { addIcons } from "ionicons";
import { chevronForwardOutline, codeSlashOutline, colorPaletteOutline, calculatorOutline, bookOutline, flaskOutline, globeOutline } from "ionicons/icons";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonList, IonItem, IonLabel, IonIcon, IonButtons, IonMenuButton,
    CommonModule
  ]
})
export class CategoriesPage {
  private readonly router = inject(Router);

  categories = [
    { name: "Programación", icon: "code-slash-outline" },
    { name: "Diseño", icon: "color-palette-outline" },
    { name: "Matemáticas", icon: "calculator-outline" },
    { name: "Historia", icon: "book-outline" },
    { name: "Física", icon: "flask-outline" },
    { name: "General", icon: "globe-outline" }
  ];

  constructor() {
    addIcons({ chevronForwardOutline, codeSlashOutline, colorPaletteOutline, calculatorOutline, bookOutline, flaskOutline, globeOutline });
  }

  filterByCategory(category: string) {
    this.router.navigate(["/home"], { queryParams: { category } });
  }
}
