import { useTheme } from '@/contexts/ThemeProvider';
import { useLayout, layouts } from '@/contexts/LayoutProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { useTranslation } from 'react-i18next';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';

interface UserTabProps {
  activeSubTab?: string;
}

export const UserTab = ({ activeSubTab }: UserTabProps) => {
  const { t } = useTranslation();
  const { theme, themes, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const { i18n } = useTranslation();
  const [performancePreset, setPerformancePreset] = useState<'quality' | 'balanced' | 'speed'>('balanced');
  const [customSettings, setCustomSettings] = useState({
    persistentSession: true,
    showTooltips: true,
    soundEffects: false,
    autoApplyPresets: false,
    highPrecision: false,
    autoDownloadModels: false,
    clipboardIntegration: true,
    safeMode: true
  });
  const [generationDefaults, setGenerationDefaults] = useState({
    steps: 20,
    cfgScale: 7,
    width: 512,
    height: 512
  });
  const [modelPreferences, setModelPreferences] = useState({
    preferredBase: 'Stable-Diffusion-1.5',
    autoLoadLastModel: true,
    autoEnableLastLoras: false,
    allowRemote: true,
    downloadThumbnails: true
  });

  type GenerationNumericKey = keyof typeof generationDefaults;
  type ModelPreferenceBooleanKey = 'autoLoadLastModel' | 'autoEnableLastLoras' | 'allowRemote' | 'downloadThumbnails';

  const performancePresets = useMemo(() => ({
    quality: {
      description: t('Prioritize quality with higher step counts and slower batch sizes'),
      settings: { steps: 35, cfgScale: 9, batchSize: 1, guidance: 'high' }
    },
    balanced: {
      description: t('Balanced defaults for daily use with moderate performance'),
      settings: { steps: 25, cfgScale: 7, batchSize: 1, guidance: 'medium' }
    },
    speed: {
      description: t('Optimize for speed with fewer steps and aggressive batching'),
      settings: { steps: 15, cfgScale: 6, batchSize: 2, guidance: 'low' }
    }
  }), [t]);

  const renderToggle = (label: string, description: string, key: keyof typeof customSettings) => (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle
        pressed={customSettings[key]}
        onPressedChange={(pressed) => setCustomSettings(prev => ({ ...prev, [key]: pressed }))}
        variant="outline"
        size="sm"
      >
        {customSettings[key] ? t('On') : t('Off')}
      </Toggle>
    </div>
  );

  const renderSlider = (
    label: string,
    description: string,
    key: GenerationNumericKey,
    min: number,
    max: number,
    step: number
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline">{generationDefaults[key]}</Badge>
      </div>
      <Slider
        value={[generationDefaults[key]]}
        onValueChange={(value) => setGenerationDefaults(prev => ({ ...prev, [key]: value[0] }))}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );

  const renderCheckbox = (label: string, description: string, key: ModelPreferenceBooleanKey) => (
    <label className="flex items-start gap-3 text-sm">
      <Checkbox
        checked={modelPreferences[key] as boolean}
        onCheckedChange={(checked) => setModelPreferences(prev => ({ ...prev, [key]: !!checked }))}
      />
      <span>
        <span className="font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  );

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
            <div className="max-w-3xl mx-auto space-y-6">
              <ParameterGroup title={t('Interface Settings')}>
                <div className="grid gap-6">
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
                  <div className="grid gap-2">
                    <Label>{t('Feature Toggles')}</Label>
                    <div className="grid gap-3">
                      {renderToggle(t('Persistent session login'), t('Keep you signed in across browser tabs and restarts'), 'persistentSession')}
                      {renderToggle(t('Show contextual tooltips'), t('Display guidance bubbles when hovering over controls'), 'showTooltips')}
                      {renderToggle(t('Safe mode prompts'), t('Automatically sanitize prompts to avoid unwanted content'), 'safeMode')}
                      {renderToggle(t('Enable sound feedback'), t('Play subtle sound cues on major actions'), 'soundEffects')}
                    </div>
                  </div>
                </div>
              </ParameterGroup>
              <ParameterGroup title={t('Generation Defaults')}>
                <div className="grid gap-5">
                  <Tabs value={performancePreset} onValueChange={(value) => setPerformancePreset(value as 'quality' | 'balanced' | 'speed')}>
                    <TabsList className="grid grid-cols-3 gap-2 bg-muted/50 p-1 rounded-lg">
                      <TabsTrigger value="quality" className="text-xs">{t('Quality')}</TabsTrigger>
                      <TabsTrigger value="balanced" className="text-xs">{t('Balanced')}</TabsTrigger>
                      <TabsTrigger value="speed" className="text-xs">{t('Speed')}</TabsTrigger>
                    </TabsList>
                    {(['quality', 'balanced', 'speed'] as const).map(preset => (
                      <TabsContent key={preset} value={preset} className="space-y-3 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground">{t('Preset Summary')}</p>
                            <p>{performancePresets[preset].description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Card className="p-3 bg-muted/40">
                            <p className="font-semibold">{t('Steps')}</p>
                            <p>{performancePresets[preset].settings.steps}</p>
                          </Card>
                          <Card className="p-3 bg-muted/40">
                            <p className="font-semibold">{t('CFG')}</p>
                            <p>{performancePresets[preset].settings.cfgScale}</p>
                          </Card>
                          <Card className="p-3 bg-muted/40">
                            <p className="font-semibold">{t('Batch Size')}</p>
                            <p>{performancePresets[preset].settings.batchSize}</p>
                          </Card>
                          <Card className="p-3 bg-muted/40">
                            <p className="font-semibold">{t('Guidance')}</p>
                            <p>{performancePresets[preset].settings.guidance}</p>
                          </Card>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  <div className="grid gap-4">
                    {renderSlider(t('Default steps'), t('Number of inference steps for new generations'), 'steps', 5, 60, 1)}
                    {renderSlider(t('CFG scale'), t('Strength of prompt adherence'), 'cfgScale', 1, 20, 0.5)}
                    {renderSlider(t('Output width'), t('Default image width in pixels'), 'width', 256, 1024, 64)}
                    {renderSlider(t('Output height'), t('Default image height in pixels'), 'height', 256, 1024, 64)}
                  </div>
                </div>
              </ParameterGroup>
              <ParameterGroup title={t('Model Preferences')}>
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label>{t('Preferred base model')}</Label>
                    <Select value={modelPreferences.preferredBase} onValueChange={(value) => setModelPreferences(prev => ({ ...prev, preferredBase: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stable-Diffusion-1.5">Stable Diffusion 1.5</SelectItem>
                        <SelectItem value="Stable-Diffusion-XL">Stable Diffusion XL</SelectItem>
                        <SelectItem value="Custom">{t('Custom / last used')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    {renderCheckbox(t('Automatically load last used model'), t('Restore your previous base model on app launch'), 'autoLoadLastModel')}
                    {renderCheckbox(t('Restore last LoRA selections'), t('Re-enable the LoRAs you used in your last session'), 'autoEnableLastLoras')}
                    {renderCheckbox(t('Allow remote models'), t('Show remote gateway results when browsing models'), 'allowRemote')}
                    {renderCheckbox(t('Download thumbnails'), t('Automatically download missing model preview thumbnails'), 'downloadThumbnails')}
                  </div>
                </div>
              </ParameterGroup>
              <ParameterGroup title={t('Workflow Automation')}>
                <div className="grid gap-4">
                  {renderToggle(t('Auto apply presets'), t('Apply the last preset you used when opening Generate tab'), 'autoApplyPresets')}
                  {renderToggle(t('Clipboard integration'), t('Monitor clipboard for prompt snippets to insert automatically'), 'clipboardIntegration')}
                  {renderToggle(t('High precision mode'), t('Use extra VRAM for improved detail on compatible GPUs'), 'highPrecision')}
                  {renderToggle(t('Auto download missing models'), t('Download referenced models when opening shared workflows'), 'autoDownloadModels')}
                  <Button variant="outline" size="sm" className="justify-self-start">
                    {t('Configure automation rules')}
                  </Button>
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
            <div className="max-w-3xl mx-auto space-y-6">
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
                <div className="grid gap-6">
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
                    <Label>{t('Layout')}</Label>
                    <Select value={layout.id} onValueChange={setLayout}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {layouts.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('Session controls')}</Label>
                    <div className="grid gap-2 text-sm">
                      <Button variant="outline" size="sm">{t('Refresh authentication')}</Button>
                      <Button variant="outline" size="sm">{t('Generate new API token')}</Button>
                      <Button variant="ghost" size="sm" className="justify-self-start text-destructive">{t('Sign out of all devices')}</Button>
                    </div>
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
