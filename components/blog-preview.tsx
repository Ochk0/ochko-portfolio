import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface BlogPreviewProps {
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  slug: string
}

export default function BlogPreview({ title, excerpt, date, category, image, slug }: BlogPreviewProps) {
  return (
    <Card className="overflow-hidden group border-primary/10 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:cyberpunk-card">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={200}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary/80 hover:bg-primary text-primary-foreground dark:animate-border-glow">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors dark:group-hover:cyberpunk-glow">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <Link href={slug} className="text-sm font-medium text-primary hover:underline dark:cyberpunk-text">
          Read more
        </Link>
      </CardFooter>
    </Card>
  )
}
