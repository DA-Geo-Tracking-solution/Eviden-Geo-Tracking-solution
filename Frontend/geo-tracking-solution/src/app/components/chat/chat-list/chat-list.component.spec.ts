import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatListComponent } from './chat-list.component';
import { RestService } from '../../../services/REST/rest.service';
import { MessageService } from '../../../services/message/message.service';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Chat, Contact } from '../../../models/interfaces';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;
  let mockRestService: jasmine.SpyObj<RestService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockCookieSettingsService: jasmine.SpyObj<CookieSettingsService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // Mock Services
    mockRestService = jasmine.createSpyObj('RestService', ['GET', 'POST']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['init']);
    mockCookieSettingsService = jasmine.createSpyObj('CookieSettingsService', ['getLanguage']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['use']);

    mockCookieSettingsService.getLanguage.and.returnValue('en'); // Default language

    await TestBed.configureTestingModule({
      declarations: [ChatListComponent],
      providers: [
        { provide: RestService, useValue: mockRestService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: CookieSettingsService, useValue: mockCookieSettingsService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Avoid errors for missing child components in the template
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display chats on initialization', () => {
    const mockChats = [
      {
        chatId: '1',
        chatName: 'Test Chat 1',
        members: [
          { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' }
        ]
      },
      {
        chatId: '2',
        chatName: 'Test Chat 2',
        members: [
          { firstname: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com' }
        ]
      }
    ];

    mockRestService.GET.and.returnValue(of(mockChats)); // Mock the response of GET request

    component.ngOnInit();

    expect(mockRestService.GET).toHaveBeenCalledWith('member/chats');
    expect(component.chats.length).toBe(2); // Expecting 2 chats to be loaded
    expect(component.filteredChats.length).toBe(2); // The filtered chats should also be 2
    expect(component.chats[0].chatName).toBe('Test Chat 1');
    expect(component.chats[1].chatName).toBe('Test Chat 2');
  });

  it('should filter chats based on search input', () => {
    component.chats = [
      { chatId: '1', chatName: 'Test Chat 1', users: [{ name: 'John Doe', email: 'john.doe@example.com' }] },
      { chatId: '2', chatName: 'Test Chat 2', users: [{ name: 'Jane Doe', email: 'jane.doe@example.com' }] }
    ];

    component.searchContact = 'john'; // Set search input to 'john'
    component.filterChats();

    expect(component.filteredChats.length).toBe(1); // Only 'Test Chat 1' should be displayed
    expect(component.filteredChats[0].chatName).toBe('Test Chat 1');
  });

  it('should add a new chat', () => {
    const newChat: Chat = {
      chatId: '3',
      chatName: 'New Chat',
      users: [
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Doe', email: 'jane.doe@example.com' }
      ]
    };

    mockRestService.POST.and.returnValue(of({ message: 'Chat created successfully' }));

    component.addNewChat(newChat);

    expect(mockRestService.POST).toHaveBeenCalledWith('member/chat', {
      chatName: 'New Chat',
      userEmails: ['john.doe@example.com', 'jane.doe@example.com']
    });
    expect(component.chats.length).toBeGreaterThan(0); // Ensure that the new chat is added
  });

  it('should emit chat selection on chat click', () => {
    const chat: Chat = { chatId: '1', chatName: 'Test Chat', users: [] };
    spyOn(component.chatSelected, 'emit'); // Spy on the chatSelected emitter

    component.selectChat(chat);

    expect(component.chatSelected.emit).toHaveBeenCalledWith(chat); // Ensure that the correct chat is emitted
  });
});
