import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonMenuButton, IonSegment, IonSegmentButton, IonLabel, 
  IonList, IonItem, IonFab, IonFabButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { PostService, Post } from '../services/post.service';
import { UserService } from '../services/user.service';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonMenuButton, IonSegment, IonSegmentButton, IonLabel, 
    IonList, IonItem, IonFab, IonFabButton, IonIcon, IonSpinner,
    MisDatosComponent, CommonModule, FormsModule
  ],
})
export class HomePage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  usuario: string = '';
  selectedSegment: string = 'foro';
  posts: Post[] = [];

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.usuario = userData.usuario;
    }
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Error cargando posts', err)
    });
  }

  goToCreate() {
    this.router.navigate(['/api-test']); 
  }
}
