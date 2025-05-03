import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Chakra UI",
        "Tailwind CSS",
        "Material-UI",
        "Redux",
        "Flutter",
      ],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "PHP", "Python", "REST API", "GraphQL", "WebSockets", "Serverless"],
    },
    {
      title: "Database",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Firestore", "Redis"],
    },
    {
      title: "DevOps & Infrastructure",
      skills: ["Docker", "Linux", "AWS", "GCP", "Git", "CI/CD", "Agile"],
    },
    {
      title: "Security",
      skills: ["Cybersecurity", "OWASP", "Penetration Testing", "Selenium"],
    },
    {
      title: "Other",
      skills: [
        "Performance Optimization",
        "Technical Writing",
        "Project Management",
        "SEO",
        "Data Analysis"
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skillCategories.map((category, index) => (
        <Card key={index} className="dark:cyberpunk-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl dark:cyberpunk-text">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <Badge
                  key={skillIndex}
                  className="bg-muted hover:bg-muted/80 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
