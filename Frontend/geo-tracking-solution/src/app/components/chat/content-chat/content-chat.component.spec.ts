import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentChatComponent } from './content-chat.component';
import { RestService } from '../../../services/REST/rest.service';
import { ServerDataService } from '../../../services/server-data/server-data.service';
import { MessageService } from '../../../services/message/message.service';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { CookieSettingsService } from '../../../services/Cookies/cookie-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Chat, ChatMessage } from '../../../models/interfaces';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChanges } from '@angular/core';

describe('ContentChatComponent', () => {
  let component: ContentChatComponent;
  let fixture: ComponentFixture<ContentChatComponent>;
  let mockRestService: jasmine.SpyObj<RestService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockKeycloakService: jasmine.SpyObj<KeycloakService>;
  let mockCookieSettingsService: jasmine.SpyObj<CookieSettingsService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // Mock Services
    mockRestService = jasmine.createSpyObj('RestService', ['POST']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['getMessages']);
    mockKeycloakService = jasmine.createSpyObj('KeycloakService', ['getUser']);
    mockCookieSettingsService = jasmine.createSpyObj('CookieSettingsService', ['getLanguage']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['use']);

    // Define mock user getter in KeycloakService
    mockKeycloakService.getUser.and.returnValue({ email: 'test@example.com' });

    mockCookieSettingsService.getLanguage.and.returnValue('en'); // Return 'en' as default language
    mockMessageService.getMessages.and.callFake((chatId: string, callback: (message: ChatMessage) => void) => {
      // Mock message retrieval
      const mockMessage: ChatMessage = { chatId: '2', messageId: '3', authorEmail: 'user1', content: 'Hello', timestamp: new Date().getTime() };
      callback(mockMessage); // Immediately call the callback with a mock message
    });

    await TestBed.configureTestingModule({
      declarations: [ContentChatComponent],
      providers: [
        { provide: RestService, useValue: mockRestService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: CookieSettingsService, useValue: mockCookieSettingsService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Avoid Angular errors for missing child components in the template
    }).compileComponents();

    fixture = TestBed.createComponent(ContentChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch messages when chat changes', () => {
    const chat: Chat = { chatId: '123', chatName: 'Test Chat', users: [] };

    // Set input and trigger ngOnChanges
    component.chat = chat;
    const changes: SimpleChanges = {
      chat: {
        previousValue: null,  // No previous value
        currentValue: chat,  // Current chat value
        firstChange: true,  // Indicates this is the first change
        isFirstChange: () => true,  // Function to indicate this is the first change
      },
    };
    component.ngOnChanges(changes);

    expect(component.messages.length).toBeGreaterThan(0);  // Ensure messages are fetched
    expect(component.messages[0].content).toBe('Hello');  // Verify the correct message
  });

  it('should send message', () => {
    const chat: Chat = { chatId: '123', chatName: 'Test Chat', users: [] };
    component.chat = chat;
    component.message = 'Test Message';

    mockRestService.POST.and.returnValue(of('Message sent'));

    component.sendMessage();  // Call sendMessage method

    expect(mockRestService.POST).toHaveBeenCalledWith(`member/chat/123/message`, 'Test Message');
    expect(component.message).toBe('');  // Ensure input is cleared after sending
  });

  it('should toggle navbar state', () => {
    expect(component.navbarOpen).toBeFalse(); // Initial state

    component.toggleNavbar();  // Toggle navbar state

    expect(component.navbarOpen).toBeTrue(); // Navbar should now be open
  });

  it('should return user email from KeycloakService', () => {
    expect(component.userEmail).toBe('test@example.com');  // Ensure email is returned correctly
  });

  it('should set the language in TranslateService', () => {
    expect(mockTranslateService.use).toHaveBeenCalledWith('en');  // Verify that the language was set correctly
  });
});
