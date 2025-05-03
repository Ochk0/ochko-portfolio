import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface CompetitionCardProps {
  title: string
  description: string
  position: string
  date: string
  skills: string[]
}

export default function CompetitionCard({ title, description, position, date, skills }: CompetitionCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 dark:cyberpunk-card">
      <CardHeader className="bg-muted/50 pb-3 dark:bg-muted/10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-lg dark:cyberpunk-text">{title}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/20 dark:animate-border-glow">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{position}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-sm">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-muted text-xs dark:bg-secondary/20 dark:text-secondary-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
