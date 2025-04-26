import { Component, OnInit }   from '@angular/core';
import { CommonModule }        from '@angular/common';
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private followService: FollowService
  ) {}

  ngOnInit(): void {
    // ha nincs :id param, akkor saját profil
    this.userId = this.route.snapshot.paramMap.get('id') || this.auth.currentUserId!;
    this.isOwnProfile = this.userId === this.auth.currentUserId;
    this.loadProfile();
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
}
