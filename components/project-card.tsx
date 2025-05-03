import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  github?: string
}

export default function ProjectCard({ title, description, image, tags, link, github }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden group border-primary/10 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:cyberpunk-card">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary dark:group-hover:cyberpunk-glow">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-muted text-xs dark:bg-secondary/20 dark:text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <Link
          href={link}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 dark:cyberpunk-text"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project <ExternalLink className="h-3 w-3" />
        </Link>
        {github && (
          <Link
            href={github}
            className="text-sm font-medium hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
