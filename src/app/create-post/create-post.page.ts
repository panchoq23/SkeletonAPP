import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonLabel, IonInput, IonButton, IonIcon, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, NavController, IonButtons,
  IonTextarea, IonSelect, IonSelectOption
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { CameraService } from "../services/camera.service";
import { UserService } from "../services/user.service";
import { addIcons } from "ionicons";
import { add, camera, arrowBack, sendOutline } from "ionicons/icons";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.page.html",
  styleUrls: ["./create-post.page.scss"],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonItem, IonLabel, IonInput, IonButton, IonIcon, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    IonTextarea, IonSelect, IonSelectOption,
    CommonModule, FormsModule
  ]
})
export class CreatePostPage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly cameraService = inject(CameraService);
  private readonly userService = inject(UserService);
  private readonly navCtrl = inject(NavController);

  newPost: Post = { title: "", body: "", category: "", sede: "" };
  photo: string | undefined = undefined;
  categories = ["Programación", "Diseño", "Matemáticas", "Historia", "Física", "General"];

  constructor() {
    addIcons({ add, camera, arrowBack, sendOutline });
  }

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.newPost.author = userData.usuario;
      this.newPost.sede = userData.sede || "";
    }
  }

  async takePhoto() {
    this.photo = await this.cameraService.takePhoto();
  }

  createPost() {
    if (!this.newPost.title || !this.newPost.body || !this.newPost.category) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    this.newPost.timestamp = "Recién ahora";
    this.newPost.votes = 0;
    this.newPost.repliesCount = 0;

    this.postService.createPost(this.newPost).subscribe(() => {
      this.navCtrl.navigateRoot("/home");
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
