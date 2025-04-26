// src/app/comments/comment-list/comment-list.component.ts
import { Component, OnInit }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { ActivatedRoute }              from '@angular/router';
import { CommentService, Comment }     from '../../services/comment.service';
import { MatListModule }               from '@angular/material/list';
import { MatCardModule }               from '@angular/material/card';
import { NewCommentComponent }  from '../new-comment/new-comment.component';
import {AuthService} from '../../core/auth.service';
import { MatIcon }                     from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule, NewCommentComponent, MatIcon, MatButtonModule],
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
    private commentService: CommentService,
    public auth: AuthService
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

  canDelete(comment: Comment): boolean {
    const me = this.auth.currentUserId;
    const result = this.auth.isAdmin || (me !== null && me === comment.user._id);
    console.log('Can delete?', result, 'User:', me, 'Comment owner:', comment.user._id);
    return result;
  }

  deleteComment(comment: Comment): void {
    this.commentService.delete(comment._id).subscribe({
      next: () => this.loadComments(),
      error: () => this.error = 'Could not delete comment'
    });
  }
}
