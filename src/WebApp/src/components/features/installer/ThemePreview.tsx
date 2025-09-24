import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ThemePreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Preview Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This is how text, borders and surfaces look with the selected theme.
          </p>
          <div className="flex gap-2">
            <Button className="bg-primary text-primary-foreground hover:opacity-90 transition">Primary</Button>
            <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:opacity-90 transition">Secondary</Button>
            <Button variant="outline" className="border-border">Outline</Button>
          </div>
        </CardContent>
      </Card>
      <div className="rounded-lg border p-4 border-border">
        <div className="text-sm font-medium mb-2 text-foreground">Color Swatches</div>
        <div className="grid grid-cols-5 gap-3">
          {[
            ['background','Background'],
            ['foreground','Foreground'],
            ['primary','Primary'],
            ['secondary','Secondary'],
            ['accent','Accent'],
            ['muted','Muted'],
            ['border','Border'],
            ['input','Input'],
          ].map(([name,label]) => (
            <div key={name} className="space-y-1">
              <div className="h-8 w-full rounded border border-border" style={{ background: `var(--${name})` }} />
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
