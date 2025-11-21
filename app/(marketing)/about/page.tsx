export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="container py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">About TaskFlow</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground mb-4">
            TaskFlow is a modern project management tool designed to help teams
            organize work, track progress, and collaborate seamlessly. Built with
            the latest technologies, TaskFlow offers a beautiful, intuitive
            interface that makes project management a breeze.
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is to help teams of all sizes work more efficiently and
            achieve their goals faster. Whether you're a small startup or a
            large enterprise, TaskFlow scales with your needs.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Simplicity - We believe in keeping things simple and intuitive</li>
            <li>Collaboration - We're built for teams that work together</li>
            <li>Innovation - We continuously improve based on user feedback</li>
            <li>Security - Your data is always safe and secure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

