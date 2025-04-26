import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { TweetService }       from '../../services/tweet.service';

@Component({
  selector: 'app-new-tweet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.scss']
})
export class NewTweetComponent {
  @Output() posted = new EventEmitter<void>();
  form: FormGroup;
  error?: string;

  constructor(private fb: FormBuilder, private tweetService: TweetService) {
    this.form = this.fb.group({
      content: ['', Validators.required]
    });
  }

  submit(): void {
    if (!this.form.valid) return;
    this.tweetService.create(this.form.value.content).subscribe({
      next: () => {
        this.form.reset();
        this.posted.emit();
      },
      error: () => {
        this.error = 'Could not post tweet';
      }
    });
  }
}
