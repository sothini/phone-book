import { Component,  OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DataGridComponent } from "../../Shared/data-grid/data-grid.component";
import { Contact } from '../../models/contact.model';
import { tap } from 'rxjs/operators';
import { TableAction } from '../../models/table-action.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ModalComponent } from '../modal/modal.component';



@Component({
  selector: 'app-contacts-page',
  standalone: true,
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
  imports: [DataGridComponent,ModalComponent]
})
export class ContactsPageComponent implements OnInit {
  contacts: Contact[] = [];
  actions: TableAction[] = [];
  loading: boolean = true;
@ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(private apiService: ApiService, private apollo: Apollo) { }

  ngOnInit(): void {
    this.loading = true;
    this.actions = [
      {
        label: 'Send Message',
        icon: 'message',
        // action: (contact: Contact) => this.sendMessage(contact)
        action: (contact: Contact) => this.showModal(contact)
      }
    ];
    this.apiService.getContacts().pipe(
      tap((contacts) => {
        this.contacts = contacts;
        this.loading = false;
      })
    ).subscribe();
  }

  getHeaders(): string[] {
    return ['Name', 'Email', 'Phone'];
  }

  showModal(contact: Contact)
  {
    this.modalComponent.openModal(contact);
  }

  sendMessage(contact: Contact) {
    const type = prompt('Enter message type (text or email):');
    const body = prompt('Enter message body:');

    this.apollo.mutate({
      mutation: gql`
          mutation CreateMessage($contact_id: ID!, $type: String!, $body: String!, $user_id: ID!) {
            createMessage(contact_id: $contact_id, type: $type, body: $body, user_id: $user_id) {
              id
              type
              body
              status
            }
          }
        `,
      variables: {
        contact_id: contact.id,
        type,
        body,
        user_id: JSON.parse(localStorage.getItem('user') || '')?.id || ''
      }
    }).subscribe(result => {
      console.log('Message sent:', result);
    }, error => {
      console.error('Error sending message:', error);
    });
  }
}
