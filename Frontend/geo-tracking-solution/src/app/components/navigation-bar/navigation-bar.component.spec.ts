import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBarComponent } from './navigation-bar.component';
import { Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/Theme/theme.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { CookieSettingsService } from '../../services/Cookies/cookie-settings.service';
import { of } from 'rxjs';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockCookieSettingsService: jasmine.SpyObj<CookieSettingsService>;

  beforeEach(async () => {
    // Mock Services
    mockThemeService = jasmine.createSpyObj('ThemeService', ['setTheme'], {
      currentTheme: of('light'),
    });
    mockCookieService = jasmine.createSpyObj('CookieService', ['get']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['use']);
    mockCookieSettingsService = jasmine.createSpyObj('CookieSettingsService', ['getLanguage'], {
      getLanguage: 'en',
    });

    await TestBed.configureTestingModule({
      declarations: [NavigationBarComponent],
      providers: [
        Renderer2,
        { provide: ThemeService, useValue: mockThemeService },
        { provide: CookieService, useValue: mockCookieService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: CookieSettingsService, useValue: mockCookieSettingsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default theme as "system"', () => {
    expect(component.currentTheme).toBe('system');
  });

  it('should call translateService.use with the language from cookieSettingsService', () => {
    expect(mockTranslateService.use).toHaveBeenCalledWith('en');
  });

  it('should set theme to "light" and update icons', () => {
    component.changeTheme('light');
    expect(mockThemeService.setTheme).toHaveBeenCalledWith('light');
    expect(component.themeIcon).toBe('../../../assets/icons/theme/sonne.png');
  });

  it('should update icons for dark theme', () => {
    component.updateIconsForDarkTheme();
    expect(component.dashboardIcon).toBe('../../../assets/icons/navigation-bar/white/dashboard_white.png');
    expect(component.evidenLogo).toBe('../../../assets/Logo/Eviden_White.png');
  });

  it('should toggle the navbarOpen state', () => {
    component.navbarOpen = false;
    component.toggleNavbar();
    expect(component.navbarOpen).toBeTrue();
    component.toggleNavbar();
    expect(component.navbarOpen).toBeFalse();
  });

  it('should apply the correct theme based on input', () => {
    // Test: Dark Theme
    component.applyTheme('dark');
    expect(component.currentTheme).toBe('dark');
    expect(component.themeIcon).toBe('../../../assets/icons/theme/dark.png');

    // Test: Light Theme
    component.applyTheme('light');
    expect(component.currentTheme).toBe('light');
    expect(component.themeIcon).toBe('../../../assets/icons/theme/sonne.png');

    // Test: System Theme (fallback to light)
    component.applyTheme('system');
    expect(component.currentTheme).toBe('system');
    expect(component.themeIcon).toBe('../../../assets/icons/theme/monitor.png');
  });

  it('should handle system theme correctly', () => {
    // Typkorrektur von matchMedia für dark mode
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true, // Simulating prefers-color-scheme: dark
      media: '',
      onchange: null,
      addListener: jasmine.createSpy(),
      removeListener: jasmine.createSpy(),
      addEventListener: jasmine.createSpy(),
      removeEventListener: jasmine.createSpy(),
      dispatchEvent: jasmine.createSpy(),
    } as unknown as MediaQueryList);

    component.applySystemTheme();
    expect(component.currentTheme).toBe('dark');

    // Typkorrektur von matchMedia für light mode
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false, // Simulating prefers-color-scheme: light
      media: '',
      onchange: null,
      addListener: jasmine.createSpy(),
      removeListener: jasmine.createSpy(),
      addEventListener: jasmine.createSpy(),
      removeEventListener: jasmine.createSpy(),
      dispatchEvent: jasmine.createSpy(),
    } as unknown as MediaQueryList);

    component.applySystemTheme();
    expect(component.currentTheme).toBe('light');
  });
});
