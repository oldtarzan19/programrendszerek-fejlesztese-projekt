import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MatCardModule }     from '@angular/material/card';
import { TweetService, Tweet } from '../../services/tweet.service';
import { NewTweetComponent }   from '../new-tweet/new-tweet.component';
import {TweetCardComponent} from '../tweet-card/tweet-card.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, MatCardModule, NewTweetComponent, TweetCardComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  outputs: ['posted']
})
export class FeedComponent implements OnInit {
  tweets: Tweet[] = [];
  loading = false;
  error?: string;
  @Output() posted = new EventEmitter<void>();

  constructor(private tweetService: TweetService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.tweetService.getAll().subscribe({
      next: data => {
        this.tweets = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Could not load feed';
        this.loading = false;
      }
    });
  }
}
