import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
  IonItem, IonLabel, IonInput, IonButton, IonIcon, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, NavController, IonButtons 
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { CameraService } from "../services/camera.service";
import { addIcons } from "ionicons";
import { add, trash, pencil, camera, arrowBack } from "ionicons/icons";

@Component({
  selector: "app-api-test",
  templateUrl: "./api-test.page.html",
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
    IonItem, IonLabel, IonInput, IonButton, IonIcon, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    CommonModule, FormsModule
  ]
})
export class ApiTestPage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly cameraService = inject(CameraService);
  private readonly navCtrl = inject(NavController);

  posts: Post[] = [];
  newPost: Post = { title: "", body: "" };
  photo: string | undefined = undefined;

  constructor() {
    addIcons({ add, trash, pencil, camera, arrowBack });
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(res => this.posts = res);
  }

  async takePhoto() {
    this.photo = await this.cameraService.takePhoto();
  }

  createPost() {
    if (!this.newPost.title || !this.newPost.body) return;
    this.postService.createPost(this.newPost).subscribe(() => {
      this.loadPosts();
      this.newPost = { title: "", body: "" };
      this.photo = undefined;
      this.navCtrl.back();
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
