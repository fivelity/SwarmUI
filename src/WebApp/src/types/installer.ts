export interface InstallSelections {
    theme: string;
    installed_for: string;
    backend: string;
    models: string[];
    install_amd: boolean;
    make_shortcut: boolean;
    language: string;
}

export interface InstallStepProps {
    selections: InstallSelections;
    setSelections: React.Dispatch<React.SetStateAction<InstallSelections>>;
}
