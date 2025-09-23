import { Tabs, Tab } from '../core/Tabs';
import { BackendsPanel } from './panels/BackendsPanel';

import { ExtensionsPanel } from './panels/ExtensionsPanel';

import { ServerInfoPanel } from './panels/ServerInfoPanel';

const PlaceholderTab = ({ name }) => <div>{name} not implemented.</div>;

export const ServerTab = () => {
    return (
        <Tabs>
            <Tab label="Server Info">
                <PlaceholderTab name="Server Info" />
            </Tab>
            <Tab label="Backends">
                <BackendsPanel />
            </Tab>
            <Tab label="Server Configuration">
                <ServerConfigurationPanel />
            </Tab>
            <Tab label="Users">
                <UserManagementPanel />
            </Tab>
            <Tab label="Extensions">
                <PlaceholderTab name="Extensions" />
            </Tab>
            <Tab label="Logs">
                <LogsPanel />
            </Tab>
        </Tabs>
    );
};ogs">
                <PlaceholderTab name="Logs" />
            </Tab>
        </Tabs>
    );
};derTab name="Logs" />
            </Tab>
        </Tabs>
    );
};>
    );
};derTab name="Logs" />
            </Tab>
        </Tabs>
    );
};