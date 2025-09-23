import { Button } from '../core/Button';

export const GenerateButtonPanel = ({ handleGenerate, loading }) => (
  <div className="flex justify-center">
    <Button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Generating...' : 'Generate'}
    </Button>
  </div>
);
