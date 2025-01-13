import {Component, Input} from '@angular/core';
import {CommentType} from '../../../../types/article/comment.type';

@Component({
  selector: 'app-comment-card',
  standalone: false,
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {

  @Input() comment: CommentType;

  constructor() {

    this.comment = {
      id: "0",
      text: "Интересно, это было экспертное мнение или личный опыт автора?",
      date: "21.01.2023 03:22",
      likesCount: 12,
      dislikesCount: 5,
      user: {
        id: "0",
        name: "Влад"
      }
    }

  }

}
