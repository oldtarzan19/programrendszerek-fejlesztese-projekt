import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }      from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { CommentService }     from '../../services/comment.service';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss']
})
export class NewCommentComponent {
  /** A tweetId-t a parent passzolja be */
  @Input() tweetId!: string;
  /** Jelezze a parent-nek, hogy új komment született */
  @Output() commented = new EventEmitter<void>();

  form: FormGroup;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService
  ) {
    this.form = this.fb.group({
      content: ['', Validators.required]
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.error = 'Comment cannot be empty';
      return;
    }
    this.commentService.create(this.tweetId, this.form.value.content)
      .subscribe({
        next: () => {
          this.form.reset();
          this.commented.emit();
        },
        error: () => {
          this.error = 'Could not post comment';
        }
      });
  }
}
