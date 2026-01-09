import { useEffect } from 'react';
import { useExtensionStore } from '@/stores/extensionStore';

export function ExtensionAssetLoader() {
  const extensions = useExtensionStore((state) => state.extensions);

  useEffect(() => {
    // In a real implementation, we would filter for installed extensions
    // and load their script/style files from the backend.
    // Since we are mocking, we will just log what would happen.
    
    extensions.forEach(ext => {
      if (ext.isInstalled) {
        if (ext.scriptFiles) {
          ext.scriptFiles.forEach(file => {
            // Check if script already exists
            if (!document.querySelector(`script[src="${file}"]`)) {
              console.log(`[AssetLoader] Injecting script: ${file}`);
              const script = document.createElement('script');
              script.src = file;
              script.async = true;
              document.head.appendChild(script);
            }
          });
        }
        
        if (ext.styleFiles) {
          ext.styleFiles.forEach(file => {
             if (!document.querySelector(`link[href="${file}"]`)) {
               console.log(`[AssetLoader] Injecting style: ${file}`);
               const link = document.createElement('link');
               link.rel = 'stylesheet';
               link.href = file;
               document.head.appendChild(link);
             }
          });
        }
      }
    });
  }, [extensions]);

  return null; // This component renders nothing
}
