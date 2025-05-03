import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExperienceTimeline() {
  const experiences = [
    {
      title: "Fullstack Engineer",
      company: "UNREAD LLC",
      period: "August 2023 - Present",
      description:
        "Developed a visually engaging news platform for young readers using Next.js & Tailwind CSS. Implemented Strapi as a CMS, creating custom APIs that accelerated development by 50%. Containerized legacy CakePHP code and resolved long-standing critical bugs (e.g., commenting, Google Analytics) despite the absence of GitHub access.",
      skills: ["Next.js", "Tailwind CSS", "Strapi CMS", "Docker", "CakePHP", "Bug Fixing"],
    },
    {
      title: "Fullstack Engineer",
      company: "Pentra Cyber Securities",
      period: "April 2023 - December 2023",
      description:
        "Developed a web scraping pipeline using Python & Selenium, extracting large-scale data efficiently. Built and deployed a serverless application using Next.js and Firebase, ensuring high scalability and seamless performance. Integrated scraped data into the platform, enhancing insights and usability.",
      skills: ["Python", "Selenium", "Next.js", "Firebase", "Serverless", "Web Scraping"],
    },
    {
      title: "Back-end Engineer",
      company: "TEQSTREAM LLC",
      period: "August 2022 - April 2023",
      description:
        "Optimized big data processing, reducing execution time from 30 minutes to 5 minutes (83% improvement). Migrated a legacy MySQL procedure to Node.js, improving code readability by 70% and simplifying debugging. Independently developed a documentation platform, leading to a 20% increase in company revenue. Identified and fixed security vulnerabilities (XSS, SQL Injection), strengthening system security. Mentored interns and new hires, reviewed their code, and managed pull request approvals, ensuring high-quality contributions and faster onboarding.",
      skills: ["Node.js", "MySQL", "Performance Optimization", "Security", "Mentoring", "Documentation"],
    },
    {
      title: "Project: BULLP",
      company: "Trading Platform",
      period: "January 2022 - August 2022",
      description:
        "Rebuilt and optimized a binary trading platform (PHP, Node.js, MySQL, Bootstrap), generating $500+ in daily revenue.",
      skills: ["PHP", "Node.js", "MySQL", "Bootstrap", "Trading Platform"],
    },
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 md:translate-x-0"></div>

      <div className="space-y-12 relative">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 ${index % 2 === 0 ? "md:rtl" : ""}`}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-1/2 top-6 w-3 h-3 rounded-full bg-primary -translate-x-1/2 md:translate-x-0 z-10 dark:shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>

            {/* Date marker - visible only on mobile */}
            <div className="md:hidden absolute left-6 top-6 bg-muted px-2 py-1 rounded text-xs font-mono">
              {exp.period}
            </div>

            {/* Content */}
            <Card
              className={`md:w-[calc(100%-20px)] ${
                index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
              } border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300 dark:cyberpunk-card`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg dark:cyberpunk-text">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="hidden md:block bg-muted px-2 py-1 rounded text-xs font-mono dark:bg-primary/10 dark:text-primary">
                    {exp.period}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs dark:border-primary/30 dark:bg-primary/5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Empty column for layout */}
            <div className="hidden md:block"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
