// src/app/comments/comment-list/comment-list.component.ts
import { Component, OnInit }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { ActivatedRoute }              from '@angular/router';
import { CommentService, Comment }     from '../../services/comment.service';
import { MatListModule }               from '@angular/material/list';
import { MatCardModule }               from '@angular/material/card';
import { NewCommentComponent }  from '../new-comment/new-comment.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, NewCommentComponent],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  tweetId!: string;
  comments: Comment[] = [];
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // A route-ot állítottad be: /feed/:id/comments, tehát itt 'id'-t kapsz
    this.tweetId = this.route.snapshot.paramMap.get('id')!;
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.commentService.getByTweet(this.tweetId).subscribe({
      next: data => {
        this.comments = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load comments';
        this.loading = false;
      }
    });
  }
}
