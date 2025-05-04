import { Component, OnInit }   from '@angular/core';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { ActivatedRoute }       from '@angular/router';

import { User, UserService }   from '../../services/user.service';
import { AuthService }         from '../../core/auth.service';
import { FollowService }       from '../../services/follow.service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {Tweet, TweetService} from '../../services/tweet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgIf,
    NgFor
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId!: string;
  user?: User;
  form!: FormGroup;
  error?: string;
  isOwnProfile = false;
  followersCount = 0;
  followingCount = 0;
  isFollowing = false;

  userTweets: Tweet[] = [];
  tweetsLoading = false;
  tweetsError?: string;

  // Szerkesztéshez
  editingTweetId: string | null = null;
  editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private followService: FollowService,
    private tweetService: TweetService,
  ) {}

  ngOnInit(): void {
    // ha nincs :id param, akkor saját profil
    this.userId = this.route.snapshot.paramMap.get('id') || this.auth.currentUserId!;
    this.isOwnProfile = this.userId === this.auth.currentUserId;
    this.loadProfile();
    this.loadUserTweets();
  }

  loadProfile(): void {
    this.userService.getById(this.userId).subscribe({
      next: u => {
        this.user = u;
        this.initForm(u);
        this.loadFollowStats();
      },
      error: () => this.error = 'Could not load profile'
    });
  }

  initForm(u: User): void {
    this.form = this.fb.group({
      email:    [u.email, [Validators.required, Validators.email]],
      username: [u.username, Validators.required]
    });
  }

  save(): void {
    if (!this.form.valid) {
      this.error = 'Please fill in correctly';
      return;
    }
    this.userService.update(this.userId, this.form.value).subscribe({
      next: updated => {
        this.user = updated;
        this.error = undefined;
      },
      error: () => this.error = 'Update failed'
    });
  }

  loadFollowStats(): void {
    this.followService.getFollowers(this.userId).subscribe(list => {
      this.followersCount = list.length;
      this.isFollowing = list.some(f => f.follower._id === this.auth.currentUserId);
    });
    this.followService.getFollowing(this.userId).subscribe(list => {
      this.followingCount = list.length;
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      // keresd meg a follow ID-t és töröld
      this.followService
        .getFollowers(this.userId)
        .subscribe(list => {
          const rel = list.find(f => f.follower._id === this.auth.currentUserId);
          if (rel) {
            this.followService.unfollow(rel._id).subscribe(() => this.loadFollowStats());
          }
        });
    } else {
      this.followService
        .follow(this.userId)
        .subscribe(() => this.loadFollowStats());
    }
  }

 /** Kilistázzuk a profil tweetjeit */
 loadUserTweets(): void {
       this.tweetsLoading = true;
       this.tweetService.getByUser(this.userId).subscribe({
           next: tws => {
             this.userTweets = tws;
             this.tweetsLoading = false;
           },
           error: () => {
             this.tweetsError = 'Could not load tweets';
             this.tweetsLoading = false;
           }
       });
 }

 /** Törlés után újratöltjük */
 deleteTweet(tweet: Tweet): void {
       this.tweetService.delete(tweet._id).subscribe({
           next: () => this.loadUserTweets(),
           error: () => this.tweetsError = 'Delete failed'
         });
 }

  /** Szerkesztés indítása */
  startEdit(tweet: Tweet): void {
    this.editingTweetId = tweet._id;
    this.editForm = this.fb.group({
      content: [ tweet.content, Validators.required ]
    });
  }

  /** Szerkesztés elvetése */
  cancelEdit(): void {
    this.editingTweetId = null;
  }

  /** Szerkesztés mentése */
  saveEdit(tweet: Tweet): void {
    if (!this.editForm.valid) return;
    const newContent = this.editForm.value.content;
    this.tweetService.update(tweet._id, newContent)
      .subscribe({
        next: updated => {
          // frissítjük a listát
          this.editingTweetId = null;
          this.loadUserTweets();
        },
        error: () => this.tweetsError = 'Could not update tweet'
      });
  }

  /** Ki tud szerkeszteni? */
  canEdit(tweet: Tweet): boolean {
    return this.auth.currentUserId === tweet.user._id;
  }
}
