const examples = [
  {
    prompt: 'Add modern minimalist furniture',
    category: 'Living Room',
  },
  {
    prompt: 'Make it brighter with natural light',
    category: 'Bedroom',
  },
  {
    prompt: 'Change to industrial style',
    category: 'Kitchen',
  },
  {
    prompt: 'Add indoor plants and greenery',
    category: 'Office',
  },
]

export function Examples() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Example Transformations
          </h2>
          <p className="text-muted-foreground">
            See what&apos;s possible with AI interior rendering.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => (
            <div
              key={example.prompt}
              className="group rounded-xl border bg-background overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-xs text-muted-foreground mb-1">{example.category}</p>
                  <p className="text-sm font-medium text-primary">&ldquo;{example.prompt}&rdquo;</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
