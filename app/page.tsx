import Link from "next/link"
import Image from "next/image"
import { MoveRight, Download, Github, Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import ExperienceTimeline from "@/components/experience-timeline"
import CompetitionCard from "@/components/competition-card"
import BlogPreview from "@/components/blog-preview"
import ContactForm from "@/components/contact-form"
import SkillsSection from "@/components/skills-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">EO</div>
            </div>
            <span className="font-bold tracking-wider">
              ERDENE<span className="text-primary">OCH</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#skills" className="text-sm font-medium hover:text-primary transition-colors">
              Skills
            </Link>
            <Link href="#experience" className="text-sm font-medium hover:text-primary transition-colors">
              Experience
            </Link>
            <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="#competitions" className="text-sm font-medium hover:text-primary transition-colors">
              Awards
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild size="sm" className="hidden md:flex">
              <Link href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/20),transparent_50%)]"></div>
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm animate-pulse dark:bg-primary/20 dark:border dark:border-primary/30">
                Available for hire
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight dark:cyberpunk-text">
                Fullstack <span className="text-primary dark:animate-neon-flicker">Engineer</span> & Security Specialist
              </h1>
              <p className="text-xl text-muted-foreground">
                Experienced developer specializing in full-stack development and cybersecurity with a proven track
                record in competitive hacking.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <Link href="mailto:ochkoﬃcial@gmail.com" className="text-sm hover:text-primary transition-colors">
                    ochkoﬃcial@gmail.com
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <Link href="tel:+97680500021" className="text-sm hover:text-primary transition-colors">
                    +976 80500021
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="dark:animate-border-glow">
                  <Link href="#contact">
                    Get in touch
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="dark:border-primary/40 dark:text-primary">
                  <Link href="#projects">View my work</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[350px] w-full rounded-lg bg-muted overflow-hidden border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:animate-border-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="main.jpg"
                  alt="Profile"
                  width={500}
                  height={350}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-md border border-primary/20 dark:border-primary/40">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <div className="text-sm font-mono">
                      Status: <span className="text-primary dark:cyberpunk-text">Available for hire</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">Skills</h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              Technical expertise and professional capabilities
            </p>
          </div>

          <SkillsSection />
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">
              Work Experience
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              My professional journey and career highlights
            </p>
          </div>

          <ExperienceTimeline />
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">
              Projects
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              A showcase of my technical projects and creative solutions
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            {/* <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
            </div> */}

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="BULLP Trading Platform"
                  description="Rebuilt and optimized a binary trading platform generating $500+ in daily revenue using PHP, Node.js, MySQL, and Bootstrap."
                  image="/project/bullp.png"
                  tags={["PHP", "Node.js", "MySQL", "Bootstrap", "Trading"]}
                  link="#"
                />
                <ProjectCard
                  title="Documentation Platform"
                  description="Independently developed a documentation platform for TEQSTREAM LLC, leading to a 20% increase in company revenue."
                  image="/project/timely.png"
                  tags={["Node.js", "React", "Documentation", "API"]}
                  link="https://developer.timely.mn"
                />
                <ProjectCard
                  title="News Platform for Young Readers"
                  description="Developed a visually engaging news platform for young readers at UNREAD LLC using Next.js & Tailwind CSS."
                  image="/project/techworm.jpg"
                  tags={["Next.js", "Tailwind CSS", "Strapi CMS", "Content"]}
                  link="https://techworm.mn"
                />
                <ProjectCard
                  title="Unread 100: Changemakers"
                  description="Unread Media proudly presents 'Unread 100: Changemakers' — a platform to spotlight the new generation of politicians and top changemakers who are shaping the decade and leading progress."
                  image="/project/100.jpg"
                  tags={["Next.js", "Firebase", "Tailwind CSS", "Animation"]}
                  link="https://100.unread.today"
                />
                {/* <ProjectCard
                  title="Mobile News Reader"
                  description="Developed a Flutter-based mobile application for news consumption with offline reading capabilities."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Flutter", "Dart", "Mobile", "Firebase"]}
                  link="#"
                />
                <ProjectCard
                  title="Data Processing Optimizer"
                  description="Optimized big data processing pipeline, reducing execution time from 30 minutes to 5 minutes (83% improvement)."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Node.js", "Data Processing", "Performance", "Optimization"]}
                  link="#"
                />
                <ProjectCard
                  title="Legacy System Migration"
                  description="Migrated a legacy MySQL procedure to Node.js, improving code readability by 70% and simplifying debugging."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["MySQL", "Node.js", "Migration", "Legacy Systems"]}
                  link="#"
                /> */}
              </div>
            </TabsContent>

            <TabsContent value="web" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="BULLP Trading Platform"
                  description="Rebuilt and optimized a binary trading platform generating $500+ in daily revenue using PHP, Node.js, MySQL, and Bootstrap."
                  image="/project/bullp.png"
                  tags={["PHP", "Node.js", "MySQL", "Bootstrap", "Trading"]}
                  link="#"
                />
                <ProjectCard
                  title="News Platform for Young Readers"
                  description="Developed a visually engaging news platform for young readers at UNREAD LLC using Next.js & Tailwind CSS."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Next.js", "Tailwind CSS", "Strapi CMS", "Content"]}
                  link="#"
                />
                <ProjectCard
                  title="Documentation Platform"
                  description="Independently developed a documentation platform for TEQSTREAM LLC, leading to a 20% increase in company revenue."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Node.js", "React", "Documentation", "API"]}
                  link="#"
                />
                <ProjectCard
                  title="Serverless News App"
                  description="Built and deployed a serverless application using Next.js and Firebase, ensuring high scalability and seamless performance."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Next.js", "Firebase", "Serverless", "Cloud Functions"]}
                  link="#"
                />
                <ProjectCard
                  title="Interactive Dashboard"
                  description="Created a real-time analytics dashboard for monitoring system performance and user engagement metrics."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["React", "D3.js", "WebSockets", "Real-time Data"]}
                  link="#"
                />
                <ProjectCard
                  title="E-commerce Platform"
                  description="Developed a full-featured e-commerce solution with payment processing, inventory management, and order tracking."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Next.js", "Stripe", "MongoDB", "Redux"]}
                  link="#"
                />
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="Mobile News Reader"
                  description="Developed a Flutter-based mobile application for news consumption with offline reading capabilities."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Flutter", "Dart", "Mobile", "Firebase"]}
                  link="#"
                />
                <ProjectCard
                  title="Fitness Tracking App"
                  description="Created a mobile application for tracking workouts, nutrition, and progress with social sharing features."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["React Native", "Firebase", "Health APIs", "Mobile"]}
                  link="#"
                />
                <ProjectCard
                  title="Secure Messaging App"
                  description="Built an end-to-end encrypted messaging application with ephemeral messaging and secure file sharing."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Flutter", "Encryption", "WebRTC", "Firebase"]}
                  link="#"
                />
                <ProjectCard
                  title="AR Navigation System"
                  description="Developed an augmented reality navigation system for urban environments with offline map support."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Unity", "AR", "Geolocation", "Mobile"]}
                  link="#"
                />
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="Security Vulnerability Scanner"
                  description="Created an automated tool to identify XSS and SQL Injection vulnerabilities in web applications."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Python", "Security", "OWASP", "Automation"]}
                  link="#"
                />
                <ProjectCard
                  title="Penetration Testing Framework"
                  description="Developed a custom penetration testing framework for internal security assessments and vulnerability reporting."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Python", "Penetration Testing", "Security", "Reporting"]}
                  link="#"
                />
                <ProjectCard
                  title="Secure Authentication System"
                  description="Implemented a multi-factor authentication system with biometric verification and anti-phishing protections."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Node.js", "Authentication", "Biometrics", "Security"]}
                  link="#"
                />
                <ProjectCard
                  title="Network Traffic Analyzer"
                  description="Built a tool for analyzing network traffic patterns to detect anomalies and potential security breaches."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Python", "Network Security", "Data Analysis", "Visualization"]}
                  link="#"
                />
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="Data Processing Optimizer"
                  description="Optimized big data processing pipeline, reducing execution time from 30 minutes to 5 minutes (83% improvement)."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Node.js", "Data Processing", "Performance", "Optimization"]}
                  link="#"
                />
                <ProjectCard
                  title="Web Scraping Pipeline"
                  description="Developed a sophisticated web scraping system using Python & Selenium to extract and process large-scale data efficiently."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Python", "Selenium", "Data Processing", "Automation"]}
                  link="#"
                />
                <ProjectCard
                  title="Analytics Dashboard"
                  description="Created a comprehensive analytics platform for visualizing business metrics and user behavior patterns."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["React", "D3.js", "Data Visualization", "Analytics"]}
                  link="#"
                />
                <ProjectCard
                  title="Recommendation Engine"
                  description="Built a content recommendation system using machine learning algorithms to personalize user experiences."
                  image="/placeholder.svg?height=200&width=400"
                  tags={["Python", "Machine Learning", "Recommendation Systems", "Data Science"]}
                  link="#"
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Competitions Section */}
        <section id="competitions" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">
              Awards & Competitions
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              Achievements in cybersecurity competitions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CompetitionCard
              title="HARUULZANGI 2022"
              description="Mongolian biggest cybersecurity competition"
              position="2ND PLACE"
              date="2022"
              skills={["Cybersecurity", "Hacking", "Problem Solving"]}
            />
            <CompetitionCard
              title="VOLGACTF 2023"
              description="International cybersecurity competition held in Russia"
              position="FINALIST"
              date="2023"
              skills={["International Competition", "CTF", "Security"]}
            />
            <CompetitionCard
              title="HackTheon Sejong 2024"
              description="International cybersecurity competition held in South Korea"
              position="FINALIST"
              date="2024"
              skills={["International Competition", "Hacking", "Security"]}
            />
            <CompetitionCard
              title="BLACKHAT MEA 2024"
              description="Biggest CTF competition with 250 teams held in SAUDI ARABIA"
              position="37TH PLACE"
              date="2024"
              skills={["CTF", "International Competition", "Team Collaboration"]}
            />
            <CompetitionCard
              title="Hackday 2025"
              description="International cybersecurity competition held in Paris"
              position="FINALIST"
              date="2025"
              skills={["International Competition", "Hacking", "Problem Solving"]}
            />
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">Blog</h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              Thoughts, insights, and technical deep dives
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BlogPreview
              title="Bypassing PIE: Advanced Binary Exploitation Techniques"
              excerpt="Learn how to exploit Position Independent Executables using pwntools, with practical examples for modern exploit development."
              date="May 01, 2025"
              category="Security"
              image="/blog/blog-1.png"
              slug="https://alpine-way-b6e.notion.site/pwn-college-pwn_PIEs-1e65c6ffc54080349e05e11f63538e28"
            />
            <BlogPreview
              title="Mastering Buffer Overflow Attacks: From Basics to Control Hijacking"
              excerpt="Comprehensive guide to stack-based buffer overflow exploitation, including ROP chains and modern mitigation bypass techniques."
              date="April 30, 2025"
              category="Security"
              image="/blog/blog-2.png"
              slug="https://alpine-way-b6e.notion.site/pwn-college-pwn_control-hijack-1e55c6ffc540808fb291e1451ddb457d"
            />
            <BlogPreview
              title="x86-64 Shellcode Injection: Writing Position-Independent Payloads"
              excerpt="Deep dive into crafting effective shellcode for modern x86-64 systems, with hands-on examples using NASM and pwntools."
              date="May 03, 2025"
              category="Security"
              image="/blog/blog-3.png"
              slug="https://alpine-way-b6e.notion.site/pwn-college-pwn_basic-shellcode-1e85c6ffc540803e81dfc78d27bf9615"
            />
          </div>

          <div className="flex justify-center mt-10">
            <Button asChild variant="outline">
              {/* <Link href="/blog">
                View all posts
                <MoveRight className="ml-2 h-4 w-4" />
              </Link> */}
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 scroll-mt-20">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:cyberpunk-text">
              Get in Touch
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
              Have a project in mind or want to collaborate? Let's talk.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-1">
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-muted">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/30),transparent_70%)]"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-bold mb-4">Connect With Me</h3>
                    <div className="flex gap-4 mb-6">
                      <Button variant="outline" size="icon" asChild>
                        <Link href="https://github.com/Ochk0" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href="https://www.linkedin.com/in/ochk0/" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href="mailto:ochkoﬃcial@gmail.com">
                          <Mail className="h-5 w-5" />
                          <span className="sr-only">Email</span>
                        </Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Email:{" "}
                        <Link href="mailto:ochkoﬃcial@gmail.com" className="text-white hover:underline">
                          ochkoﬃcial@gmail.com
                        </Link>
                      </p>
                      <p className="text-muted-foreground">
                        Phone:{" "}
                        <Link href="tel:+97680500021" className="text-white hover:underline">
                          +976 80500021
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <ContactForm /> */}
          </div>
        </section>
      </main>

      <footer className="border-t py-10 md:py-16">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">EO</div>
            </div>
            <span className="font-bold tracking-wider">
              ERDENE<span className="text-primary">OCH</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} | All rights reserved</p>

          {/* <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div> */}
        </div>
      </footer>
    </div>
  )
}
