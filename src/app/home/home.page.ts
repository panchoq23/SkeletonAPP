import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonMenuButton, IonSegment, IonSegmentButton, IonLabel, 
  IonFab, IonFabButton, IonIcon,
  IonAvatar, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton,
  IonSearchbar
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { UserService } from "../services/user.service";
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
    IonFab, IonFabButton, IonIcon,
    IonAvatar, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton,
    IonSearchbar,
    MisDatosComponent, CommonModule, FormsModule, RouterModule
  ],
})
export class HomePage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  usuario: string = "";
  miSede: string = "";
  selectedSegment: string = "foro";
  filterSede: string = "todas"; 
  filterCategory: string | null = null;
  searchQuery: string = "";
  
  allPosts: Post[] = [];
  filteredPosts: Post[] = [];

  constructor() {
    addIcons({ 
      add, thumbsUpOutline, chatbubbleOutline, 
      earthOutline, businessOutline, alertCircleOutline, closeCircle 
    });
  }

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
      this.miSede = userData.sede || "";
    }

    this.route.queryParams.subscribe(params => {
      if (params["segment"]) {
        this.selectedSegment = params["segment"];
      }
      if (params["category"]) {
        this.filterCategory = params["category"];
      } else {
        this.filterCategory = null;
      }
      this.loadPosts();
    });
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

  onSearch(event: any) {
    this.searchQuery = event.detail.value?.toLowerCase() || "";
    this.applyFilter();
  }

  setFilter(filter: string) {
    this.filterSede = filter;
    this.applyFilter();
  }

  applyFilter() {
    let result = this.allPosts;

    if (this.filterSede === "mi-sede" && this.miSede) {
      result = result.filter(p => p.sede === this.miSede);
    }

    if (this.filterCategory) {
      result = result.filter(p => p.category === this.filterCategory);
    }

    if (this.searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(this.searchQuery) || 
        p.body.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredPosts = result;
  }

  clearCategory() {
    this.router.navigate([], { queryParams: { category: null }, queryParamsHandling: "merge" });
  }

  goToCreate() {
    this.router.navigate(["/create-post"]); 
  }
}
