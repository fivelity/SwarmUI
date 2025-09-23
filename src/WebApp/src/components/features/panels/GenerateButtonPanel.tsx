import { Button } from '@/components/ui/button';

interface GenerateButtonPanelProps {
  handleGenerate: () => void;
  loading: boolean;
}

export const GenerateButtonPanel: React.FC<GenerateButtonPanelProps> = ({ handleGenerate, loading }) => (
  <div className="flex justify-center">
    <Button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Generating...' : 'Generate'}
    </Button>
  </div>
);
