import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewsService } from 'src/app/services';

@Component({
  selector: 'app-edit-news-dialog',
  templateUrl: './edit-news-dialog.component.html',
  styleUrls: ['./edit-news-dialog.component.scss']
})
export class EditNewsDialogComponent implements OnInit {
  articleId: string;

  constructor(public dialogRef: MatDialogRef<EditNewsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private article: NewsService) { }

  ngOnInit() {
    this.articleId = this.data.id;
  }

  closeNewsEditDialog(): void {
    this.dialogRef.close();
  }

  updateNews(id: string, name: string, version: string, content: string): void {
    this.article.updateArticle(id, name, version, content);
    this.closeNewsEditDialog();
  }
}
