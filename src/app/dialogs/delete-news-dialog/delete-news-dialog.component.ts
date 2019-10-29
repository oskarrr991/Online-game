import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewsService } from './../../services';

@Component({
  selector: 'app-delete-news-dialog',
  templateUrl: './delete-news-dialog.component.html',
  styleUrls: ['./delete-news-dialog.component.scss']
})
export class DeleteNewsDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteNewsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private article: NewsService) { }

  closeNewsDeleteDialog(): void {
    this.dialogRef.close();
  }

  deleteArticle(data): void {
    console.log('deleting...');
    this.article.delArticle(data);
    this.closeNewsDeleteDialog();
  }
}
