import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import { Prism } from '@/lib/prism-swarm';
import { cn } from '@/lib/utils';
import '@/styles/prism-swarm.css'; // We need to create this CSS file

interface PromptEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PromptEditor({ value, onValueChange, placeholder, className, id }: PromptEditorProps) {
  return (
    <div className={cn(
      "relative w-full rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
      className
    )}>
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) => highlight(code, Prism.languages.swarm, 'swarm')}
        padding={10}
        textareaId={id}
        placeholder={placeholder}
        className="font-mono text-sm min-h-[100px]"
        textareaClassName="focus:outline-none"
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          minHeight: '100px',
        }}
      />
    </div>
  );
}
