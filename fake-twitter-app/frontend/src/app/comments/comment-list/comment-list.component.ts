import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { ActivatedRoute }           from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor }              from '@angular/common';
import { MatListModule }            from '@angular/material/list';
import { MatCardModule }            from '@angular/material/card';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { CommentService, Comment }  from '../../services/comment.service';
import { AuthService }              from '../../core/auth.service';
import {NewCommentComponent} from '../new-comment/new-comment.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    NewCommentComponent,
  ],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  tweetId!: string;
  comments: Comment[] = [];
  loading = true;
  error?: string;

  // szerkesztéshez
  editingCommentId: string | null = null;
  editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    public auth: AuthService,
    private fb: FormBuilder
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

  /** Csak szerző vagy admin */
  canModify(comment: Comment): boolean {
    const me = this.auth.currentUserId;
    return this.auth.isAdmin || (me !== null && me === comment.user._id);
  }

  /** Szerkesztés indítása */
  startEdit(comment: Comment): void {
    this.editingCommentId = comment._id;
    this.editForm = this.fb.group({
      content: [ comment.content, Validators.required ]
    });
  }

  /** Mentés */
  saveEdit(comment: Comment): void {
    if (!this.editForm.valid) { return; }
    const newContent = this.editForm.value.content;
    this.commentService.update(comment._id, newContent)
      .subscribe({
        next: () => {
          this.editingCommentId = null;
          this.loadComments();
        },
        error: () => this.error = 'Could not update comment'
      });
  }

  /** Mégse */
  cancelEdit(): void {
    this.editingCommentId = null;
  }
}
