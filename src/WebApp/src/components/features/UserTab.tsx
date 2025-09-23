import { useTheme } from '@/contexts/ThemeProvider';
import { useLayout, layouts } from '@/contexts/LayoutProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { useTranslation } from 'react-i18next';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox';

export const UserTab = () => {
  const { t } = useTranslation();
  const { theme, themes, setTheme } = useTheme();
  const { setLayout } = useLayout();
  const { i18n } = useTranslation();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'it', label: 'Italiano' },
    { value: 'ja', label: '日本語' },
    { value: 'nl', label: 'Nederlands' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'sv', label: 'Svenska' },
    { value: 'tr', label: 'Türkçe' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'zh', label: '中文' },
  ];

  return (
    <div className="max-w-md">
      <ParameterGroup title={t('Appearance Settings')}>
        <div className="grid gap-1.5">
            <Label htmlFor="theme-select">{t('Theme')}</Label>
            <Select value={theme.id} onValueChange={setTheme}>
                <SelectTrigger id="theme-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-1.5">
            <Label htmlFor="layout-select">{t('Layout')}</Label>
            <Select defaultValue="default" onValueChange={e => setLayout(e as keyof typeof layouts)}>
                <SelectTrigger id="layout-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {Object.keys(layouts).map(layoutName => (
                        <SelectItem key={layoutName} value={layoutName}>
                            {layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}
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
      </ParameterGroup>
    </div>
  );
};
