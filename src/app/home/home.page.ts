import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonSegment, IonSegmentButton, IonLabel,
  IonFab, IonFabButton, IonIcon, IonChip, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  IonAvatar, IonSkeletonText
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { UserService }       from "../services/user.service";
import { MisDatosComponent } from "./components/mis-datos/mis-datos.component";
import { addIcons } from "ionicons";
import {
  add, thumbsUpOutline, chatbubbleOutline,
  earthOutline, businessOutline, alertCircleOutline, closeCircle
} from "ionicons/icons";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonMenuButton, IonSegment, IonSegmentButton, IonLabel,
    IonFab, IonFabButton, IonIcon, IonChip, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonButton,
    IonAvatar, IonSkeletonText,
    MisDatosComponent, CommonModule, FormsModule, RouterModule
  ],
})
export class HomePage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly router      = inject(Router);
  private readonly route       = inject(ActivatedRoute);

  usuario:         string = "";
  miSede:          string = "";
  selectedSegment: string = "foro";
  filterSede:      string = "todas";
  filterCategory:  string | null = null;

  allPosts:      Post[] = [];
  filteredPosts: Post[] = [];
  cargando:      boolean = true;

  constructor() {
    addIcons({ add, thumbsUpOutline, chatbubbleOutline, earthOutline, businessOutline, alertCircleOutline, closeCircle });
  }

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.nombre || userData.usuario;
      this.miSede  = userData.sede ?? "";
    }

    this.route.queryParams.subscribe(params => {
      if (params["segment"]) this.selectedSegment = params["segment"];
      this.filterCategory = params["category"] ?? null;
      this.loadPosts();
    });
  }

  loadPosts() {
    this.cargando = true;
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.allPosts = data;
        this.applyFilter();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  setFilter(filter: string) {
    this.filterSede = filter;
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.allPosts];
    if (this.filterSede === "mi-sede" && this.miSede) {
      result = result.filter(p => p.sede === this.miSede);
    }
    if (this.filterCategory) {
      result = result.filter(p => p.category === this.filterCategory);
    }
    this.filteredPosts = result;
  }

  clearCategory() {
    this.router.navigate([], { queryParams: { category: null }, queryParamsHandling: "merge" });
  }

  goToCreate() { this.router.navigate(["/create-post"]); }
}
