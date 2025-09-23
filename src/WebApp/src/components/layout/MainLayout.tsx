import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable';

import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode[] }) => {
    return (
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            <ResizablePanel defaultSize={25}>
                <div className="h-full p-4">{children[0]}</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <div className="h-full p-4">{children[1]}</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
                <div className="h-full p-4">{children[2]}</div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default MainLayout;
