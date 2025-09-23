import { Tabs, Tab } from './components/core/Tabs';
import { GenerateTab } from './components/features/GenerateTab';
import { SimpleTab } from './components/features/SimpleTab';
import { UtilitiesTab } from './components/features/UtilitiesTab';
import { UserTab } from './components/features/UserTab';
import { ServerTab } from './components/features/ServerTab';

function App() {
  return (
    <div className="bg-background text-text min-h-screen">
      <Tabs>
        <Tab label="Generate">
          <GenerateTab />
        </Tab>
        <Tab label="Simple">
          <SimpleTab />
        </Tab>
        <Tab label="Utilities">
          <UtilitiesTab />
        </Tab>
        <Tab label="User">
          <UserTab />
        </Tab>
        <Tab label="Server">
          <ServerTab />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;