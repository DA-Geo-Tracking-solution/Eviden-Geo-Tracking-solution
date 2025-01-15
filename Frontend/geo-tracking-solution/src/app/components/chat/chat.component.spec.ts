import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ThemeService } from '../../services/Theme/theme.service';
import { of } from 'rxjs';
import { Chat } from '../../models/interfaces';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    // Mock ThemeService
    mockThemeService = jasmine.createSpyObj('ThemeService', ['currentTheme'], {
      currentTheme: of('dark'), // Mock den aktuellen Theme-Wert
    });

    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentTheme from ThemeService', () => {
    expect(component.currentTheme).toBe('dark');
  });

  it('should update currentTheme when ThemeService emits a new theme', () => {
    // Emit a new theme value
    mockThemeService.currentTheme = of('light');
    fixture.detectChanges();

    // Trigger subscription logic
    component.ngOnInit();
    expect(component.currentTheme).toBe('light');
  });

  it('should update selectedChat when onChatSelected is called', () => {
    const chat: Chat = { chatId: '123', chatName: 'Test Chat', users: [{name: 'User1', email: 'user1@gmail.com' }, { name: 'User2', email: 'user2@gmail.com' }] };

    component.onChatSelected(chat);

    expect(component.selectedChat).toEqual(chat);
  });
});
