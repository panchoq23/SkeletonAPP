import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonLabel, IonButton, IonIcon, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, NavController, IonButtons,
  IonAvatar, IonBadge, IonFooter, IonInput
} from "@ionic/angular/standalone";
import { PostService, Post, Comment } from "../services/post.service";
import { addIcons } from "ionicons";
import { arrowBack, thumbsUpOutline, chatbubbleOutline, checkmarkCircle, sendOutline } from "ionicons/icons";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.page.html",
  styleUrls: ["./post-detail.page.scss"],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonItem, IonLabel, IonButton, IonIcon, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    IonAvatar, IonBadge, IonFooter, IonInput,
    CommonModule, FormsModule
  ]
})
export class PostDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly navCtrl = inject(NavController);

  post: Post | undefined;
  comments: Comment[] = [];
  newComment: string = "";

  constructor() {
    addIcons({ arrowBack, thumbsUpOutline, chatbubbleOutline, checkmarkCircle, sendOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.postService.getPostById(Number(id)).subscribe(res => {
        this.post = res;
        this.loadMockComments();
      });
    }
  }

  loadMockComments() {
    this.comments = [
      {
        id: 1,
        author: "María González",
        body: "¡Hola! Para que eso funcione debes inicializar el plugin en el ngOnInit del app.component.ts.",
        timestamp: "Hace 1 h",
        isCorrect: true
      },
      {
        id: 2,
        author: "Carlos Soto",
        body: "Yo tuve el mismo error y lo solucioné limpiando el cache de Android Studio.",
        timestamp: "Hace 30 min",
        isCorrect: false
      }
    ];
  }

  addComment() {
    if (!this.newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: "Yo",
      body: this.newComment,
      timestamp: "Ahora mismo",
      isCorrect: false
    };
    
    this.comments.push(comment);
    this.newComment = "";
  }

  markAsCorrect(comment: Comment) {
    this.comments.forEach(c => c.isCorrect = false);
    comment.isCorrect = true;
  }

  goBack() {
    this.navCtrl.back();
  }
}
