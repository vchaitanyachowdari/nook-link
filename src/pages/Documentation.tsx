import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, Zap, Shield, Smartphone, Code, Rocket, Database, Cloud } from "lucide-react";

export default function Documentation() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <Layout userEmail={user?.email}>
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <BookmarkPlus className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            Nook Link
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced Bookmarks Manager with AI capabilities, multi-platform access, and intelligent organization
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="h-3 w-3 mr-1" />
              Fast
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Smartphone className="h-3 w-3 mr-1" />
              Responsive
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Cloud className="h-3 w-3 mr-1" />
              Cloud-Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkPlus className="h-5 w-5 text-primary" />
                  About The Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Nook Link</strong> is a comprehensive, production-ready bookmarks manager that combines powerful organization tools with AI capabilities. 
                  It's designed to help you save, organize, and rediscover your favorite web content with ease.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Lightning Fast</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Optimized performance with instant search and filtering</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">Secure & Private</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Enterprise-grade security with encrypted data storage</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Multi-Platform</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Access via web, WhatsApp, Telegram, and browser extensions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">AI-Powered</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Smart tagging, summarization, and semantic search</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Core Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Advanced bookmark management with rich metadata</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Powerful search with filters and sorting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Smart collections and tagging system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Reading list with progress tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Bulk operations for efficiency</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Automatic content tagging and categorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">AI-powered summarization (coming soon)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Semantic search with embeddings (planned)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Smart recommendations (coming soon)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Conversational chat interface (planned)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">WhatsApp bot for mobile access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Telegram integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Browser extension (planned)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">REST API for developers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">Import from Chrome, Pocket, and more</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Personal dashboard with insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Reading statistics and goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Tag usage analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Activity heatmaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                      <span className="text-sm">Gamification with achievements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Technology Stack
                </CardTitle>
                <CardDescription>Built with modern, production-ready technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    Frontend
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Badge variant="outline">React 18</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                    <Badge variant="outline">Framer Motion</Badge>
                    <Badge variant="outline">Vite</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    Backend & Database
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Badge variant="outline">Supabase</Badge>
                    <Badge variant="outline">PostgreSQL</Badge>
                    <Badge variant="outline">Edge Functions</Badge>
                    <Badge variant="outline">Real-time Subscriptions</Badge>
                    <Badge variant="outline">Row Level Security</Badge>
                    <Badge variant="outline">Full-Text Search</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-primary" />
                    Services & APIs
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Badge variant="outline">OpenAI API</Badge>
                    <Badge variant="outline">WhatsApp (Whapi.cloud)</Badge>
                    <Badge variant="outline">Telegram Bot API</Badge>
                    <Badge variant="outline">Resend (Email)</Badge>
                    <Badge variant="outline">n8n (Automation)</Badge>
                    <Badge variant="outline">PostHog (Analytics)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>RESTful API for programmatic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">All API requests require authentication using your API key:</p>
                  <code className="block p-3 rounded bg-background text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>GET</Badge>
                      <code className="text-sm">/api/v1/bookmarks</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all bookmarks with optional filters</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">POST</Badge>
                      <code className="text-sm">/api/v1/bookmarks</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Create a new bookmark</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">PUT</Badge>
                      <code className="text-sm">/api/v1/bookmarks/:id</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update an existing bookmark</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">DELETE</Badge>
                      <code className="text-sm">/api/v1/bookmarks/:id</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Delete a bookmark</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>GET</Badge>
                      <code className="text-sm">/api/v1/search?q=react</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Search bookmarks by query</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Product Roadmap
                </CardTitle>
                <CardDescription>Our vision for the future</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-500">✅ Completed</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                      <span className="text-sm">Core bookmark management system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                      <span className="text-sm">User authentication and profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                      <span className="text-sm">Advanced search and filtering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                      <span className="text-sm">Reading list functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                      <span className="text-sm">Beautiful, responsive UI with animations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-blue-500">🚧 In Progress</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <span className="text-sm">AI auto-tagging and summarization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <span className="text-sm">WhatsApp and Telegram integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <span className="text-sm">Analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <span className="text-sm">Settings and preferences management</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-amber-500">📅 Planned</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Browser extension (Chrome, Firefox, Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Semantic search with vector embeddings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Team workspaces and collaboration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Public collections and social features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Import from Pocket, Instapaper, browser bookmarks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Mobile apps (iOS & Android)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Knowledge graph visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <span className="text-sm">Advanced automation workflows</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Questions, feedback, or contributions welcome</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://github.com/vchaitanyachowdari/nook-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">GitHub Repository</h3>
                <p className="text-sm text-muted-foreground">Star, fork, or contribute</p>
              </a>
              <a 
                href="mailto:vchaitanya@chowdari.in" 
                className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">vchaitanya@chowdari.in</p>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Made with ❤️ by <a href="https://chowdari.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">V Chaitanya Chowdari</a></p>
          <p className="mt-2">Licensed under MIT License</p>
        </div>
      </div>
    </Layout>
  );
}