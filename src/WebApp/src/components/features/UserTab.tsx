import { useTheme } from '@/contexts/ThemeProvider';
import { useLayout, layouts } from '@/contexts/LayoutProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { useTranslation } from 'react-i18next';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox';

interface UserTabProps {
  activeSubTab?: string;
}

export const UserTab = ({ activeSubTab }: UserTabProps) => {
  const { t } = useTranslation();
  const { theme, themes, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const { i18n } = useTranslation();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'nl', label: 'Nederlands' },
    { value: 'pl', label: 'Polski' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'zh', label: '中文' },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'preferences':
        return (
          <div className="h-full space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{t('User Preferences')}</h1>
              <p className="text-muted-foreground">{t('Customize your SwarmUI experience')}</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <ParameterGroup title={t('Interface Settings')}>
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="layout-select">{t('Layout')}</Label>
                    <Select value={layout.id} onValueChange={setLayout}>
                      <SelectTrigger id="layout-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {layouts.map(layout => (
                          <SelectItem key={layout.id} value={layout.id}>
                            {layout.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>{t('Language')}</Label>
                    <Combobox data={languages} type="language" value={i18n.language} onValueChange={i18n.changeLanguage}>
                      <ComboboxTrigger />
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxList>
                          {languages.map(lang => <ComboboxItem key={lang.value} value={lang.value}>{lang.label}</ComboboxItem>)}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>
              </ParameterGroup>
            </div>
          </div>
        );
      case 'themes':
        return (
          <div className="h-full space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{t('Theme Selection')}</h1>
              <p className="text-muted-foreground">{t('Choose a theme that suits your style')}</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <ParameterGroup title={t('Available Themes')}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {themes.map(themeOption => (
                    <div
                      key={themeOption.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme.id === themeOption.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTheme(themeOption.id)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{themeOption.name}</h3>
                          {theme.id === themeOption.id && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: themeOption.colors.background }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: themeOption.colors.primary }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: themeOption.colors.accent }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: themeOption.colors.text }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ParameterGroup>
            </div>
          </div>
        );
      default: // 'profile'
        return (
          <div className="h-full space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{t('User Profile')}</h1>
              <p className="text-muted-foreground">{t('Manage your account and personal settings')}</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <ParameterGroup title={t('Account Information')}>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">U</span>
                    </div>
                    <h3 className="text-lg font-semibold">Local User</h3>
                    <p className="text-muted-foreground">SwarmUI Administrator</p>
                  </div>
                </div>
              </ParameterGroup>
              <ParameterGroup title={t('Quick Settings')}>
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="theme-select">{t('Theme')}</Label>
                    <Select value={theme.id} onValueChange={setTheme}>
                      <SelectTrigger id="theme-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ParameterGroup>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      {renderContent()}
    </div>
  );
};
