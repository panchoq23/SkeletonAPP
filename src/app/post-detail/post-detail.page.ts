import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
  IonAvatar, IonBadge, IonFooter, IonInput, NavController, AlertController
} from "@ionic/angular/standalone";
import { PostService, Post, Comment } from "../services/post.service";
import { UserService } from "../services/user.service";
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
  private readonly route       = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly navCtrl     = inject(NavController);
  private readonly alertCtrl   = inject(AlertController);

  post: Post | undefined;
  newComment: string = "";
  private postId: number = 0;

  constructor() {
    addIcons({ arrowBack, thumbsUpOutline, chatbubbleOutline, checkmarkCircle, sendOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.postId = Number(id);
      this.postService.getPostById(this.postId).subscribe(res => {
        this.post = res;
        if (!res) this.navCtrl.navigateBack("/home");
      });
    }
  }

  addComment() {
    if (!this.newComment.trim()) return;

    const autor = this.userService.getUserData()?.usuario ?? "Anónimo";
    this.postService.addComment(this.postId, {
      author: autor,
      body: this.newComment,
      timestamp: "Ahora mismo",
      isCorrect: false,
    });

    this.postService.getPostById(this.postId).subscribe(p => this.post = p);
    this.newComment = "";
  }

  markAsCorrect(comment: Comment) {
    this.postService.markCommentCorrect(this.postId, comment.id);
    this.postService.getPostById(this.postId).subscribe(p => this.post = p);
  }

  goBack() { this.navCtrl.back(); }

  inicialAvatar(nombre: string): string {
    return (nombre ?? "?").charAt(0).toUpperCase();
  }
}
