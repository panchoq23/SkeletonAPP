import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonMenuButton, IonSegment, IonSegmentButton, IonLabel, 
  IonList, IonItem, IonFab, IonFabButton, IonIcon, IonSpinner,
  IonAvatar, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { UserService } from "../services/user.service";
import { MisDatosComponent } from "./components/mis-datos/mis-datos.component";
import { addIcons } from "ionicons";
import { 
  add, thumbsUpOutline, chatbubbleOutline, 
  earthOutline, businessOutline, alertCircleOutline 
} from "ionicons/icons";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonMenuButton, IonSegment, IonSegmentButton, IonLabel, 
    IonList, IonItem, IonFab, IonFabButton, IonIcon, IonSpinner,
    IonAvatar, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton,
    MisDatosComponent, CommonModule, FormsModule
  ],
})
export class HomePage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  usuario: string = "";
  miSede: string = "";
  selectedSegment: string = "foro";
  filterSede: string = "todas"; 
  
  allPosts: Post[] = [];
  filteredPosts: Post[] = [];

  constructor() {
    addIcons({ 
      add, thumbsUpOutline, chatbubbleOutline, 
      earthOutline, businessOutline, alertCircleOutline 
    });
  }

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
      this.miSede = userData.sede || "";
    }
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.allPosts = data;
        this.applyFilter();
      },
      error: (err) => console.error("Error cargando posts", err)
    });
  }

  setFilter(filter: string) {
    this.filterSede = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filterSede === "mi-sede" && this.miSede) {
      this.filteredPosts = this.allPosts.filter(p => p.sede === this.miSede);
    } else {
      this.filteredPosts = this.allPosts;
    }
  }

  goToCreate() {
    this.router.navigate(["/api-test"]); 
  }
}
