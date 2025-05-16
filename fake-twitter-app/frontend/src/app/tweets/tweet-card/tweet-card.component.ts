import { Component, Input } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule }     from '@angular/material/card';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { Tweet, TweetService } from '../../services/tweet.service';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-tweet-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.scss']
})
export class TweetCardComponent {
  @Input() tweet!: Tweet;
  @Input() refreshFeed!: () => void;

  constructor(private tweetService: TweetService, public auth: AuthService) {}

  get isLiked(): boolean {
    const me = this.auth.currentUserId;
    return !!me && this.tweet.likes.includes(me);
  }

  toggleLike(): void {
    const call = this.isLiked
      ? this.tweetService.unlike(this.tweet._id)
      : this.tweetService.like(this.tweet._id);

    call.subscribe({
      next: updated => {
        this.tweet.likes = updated.likes;
      },
      error: () => console.error('Like/Unlike failed')
    });
  }

  retweet(): void {
    this.tweetService.retweet(this.tweet._id).subscribe({
      next: _ => {
        if (this.refreshFeed) {
          this.refreshFeed();
        }
      },
      error: () => console.error('Retweet failed')
    });
  }

  deleteTweet(): void {
    this.tweetService.delete(this.tweet._id).subscribe({
      next: () => this.refreshFeed?.(),
      error: () => console.error('Delete tweet failed')
    });
  }

  /** admin vagy a tweet tulajdonosa */
  canDelete(): boolean {
    const me = this.auth.currentUserId;
    return this.auth.isAdmin || (me !== null && me === this.tweet.user._id);
  }
}
