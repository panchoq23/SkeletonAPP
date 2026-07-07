import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButtons, IonTextarea, IonSelect, IonSelectOption,
  IonSpinner, NavController, AlertController, ToastController
} from "@ionic/angular/standalone";
import { PostService, Post } from "../services/post.service";
import { CameraService }    from "../services/camera.service";
import { UserService }      from "../services/user.service";
import { addIcons }         from "ionicons";
import { add, camera, arrowBack, sendOutline } from "ionicons/icons";

const CATEGORIAS = ["Programación", "Diseño", "Matemáticas", "Historia", "Física", "General"];

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.page.html",
  styleUrls: ["./create-post.page.scss"],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    IonTextarea, IonSelect, IonSelectOption, IonSpinner,
    CommonModule, FormsModule
  ]
})
export class CreatePostPage implements OnInit {
  private readonly postService  = inject(PostService);
  private readonly cameraService = inject(CameraService);
  private readonly userService  = inject(UserService);
  private readonly navCtrl      = inject(NavController);
  private readonly alertCtrl    = inject(AlertController);
  private readonly toastCtrl    = inject(ToastController);

  newPost: Post = { title: "", body: "", category: "", sede: "" };
  photo: string | undefined = undefined;
  categories = CATEGORIAS;
  enviando = false;

  constructor() { addIcons({ add, camera, arrowBack, sendOutline }); }

  ngOnInit() {
    const u = this.userService.getUserData();
    if (u) {
      this.newPost.author = u.nombre || u.usuario;
      this.newPost.sede   = u.sede ?? "";
    }
  }

  async takePhoto() {
    this.photo = await this.cameraService.takePhoto();
  }

  async createPost() {
    if (!this.newPost.title || !this.newPost.body || !this.newPost.category) {
      const alert = await this.alertCtrl.create({
        header: "Campos incompletos",
        message: "Por favor completa el título, categoría y descripción.",
        buttons: ["Aceptar"]
      });
      await alert.present();
      return;
    }

    this.enviando = true;
    this.newPost.timestamp = "Recién ahora";

    this.postService.createPost(this.newPost).subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: "✅ Pregunta publicada en el foro",
        duration: 2000,
        color: "success",
        position: "top"
      });
      await toast.present();
      this.navCtrl.navigateRoot("/home");
    });
  }

  goBack() { this.navCtrl.back(); }
}
