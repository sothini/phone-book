import { Contact } from './../../models/contact.model';
import { Component, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import gql from 'graphql-tag';
import { Message } from '../../models/message.model';

declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() contact: Contact = {} as Contact;
  submitForm!: FormGroup;
  isSubmitButtonHidden :boolean = false;
  selectedContact: Contact | null = null;
  modalInstance: any;

  constructor(private formBuilder: FormBuilder,private apollo: Apollo) {}

  ngOnInit(): void {
      this.submitForm = this.formBuilder.group({
        type: ['', [Validators.required]],
        body: ['', Validators.required]
      });
    }

  openModal(contact: Contact) {
    this.contact = contact;
    const modalElement = document.getElementById('sendMessageModal');

    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  viewModal(message : Message)
  {
    const modalElement = document.getElementById('sendMessageModal');

    this.isSubmitButtonHidden = true;
    this.submitForm.setValue({
      type: message.type,
      body: message.body
    });

    this.submitForm.get('type')?.disable();
    this.submitForm.get('body')?.disable();


    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {

    const modalElement = document.getElementById('sendMessageModal');

    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  sendMessage()
  {
    if(this.contact && this.submitForm?.valid)
    {
      const type = this.submitForm.value.type;
      const body = this.submitForm.value.body;

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
          contact_id: this.contact.id,
          type,
          body,
          user_id: JSON.parse(localStorage.getItem('user') || '')?.id || ''
        }
      }).subscribe(result => {
        alert('Message sent');
        console.log('Message sent:', result);
      }, error => {
        alert('Error sending message');
        console.error('Error sending message:', error);
      });

      this.closeModal();
    }
  }
}
