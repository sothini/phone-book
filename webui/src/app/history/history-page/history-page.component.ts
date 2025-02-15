import { Component, ViewChild } from '@angular/core';
import { DataGridComponent } from '../../Shared/data-grid/data-grid.component';
import { Message } from '../../models/message.model';
import { TableAction } from '../../models/table-action.model';
import { ModalComponent } from '../../contacts/modal/modal.component';
import { ApiService } from '../../services/api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [DataGridComponent,ModalComponent],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss'
})
export class HistoryPageComponent {
   messages: Message[] = [];
    actions: TableAction[] = [];
    loading: boolean = true;
    @ViewChild(ModalComponent) modalComponent!: ModalComponent;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loading = true;
        this.actions = [
          {
            label: 'View Message',
            icon: 'message',
            action: (message:Message) => this.showModal(message)
          }
        ];
        this.apiService.getMessages().pipe(
          tap((messages) => {
            this.messages = messages;
            this.loading = false;
          })
        ).subscribe();
      }

    getHeaders(): string[] {
      return ['Type', 'To', 'Status','created_at'];
    }

     showModal(message: Message)
    {
      this.modalComponent.viewModal(message);
    }

}
