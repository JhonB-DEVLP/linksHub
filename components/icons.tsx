import type { LightbulbIcon as LucideProps } from "lucide-react"
import {
  Link,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Globe,
  Music,
  Video,
  ImageIcon,
  FileText,
  Code,
  BookOpen,
  Calendar,
} from "lucide-react"

interface IconsProps extends LucideProps {
  name: string
}

export function Icons({ name, ...props }: IconsProps) {
  const Icon = getIcon(name)
  return <Icon {...props} />
}

function getIcon(name: string) {
  switch (name) {
    case "Link":
      return Link
    case "Github":
      return Github
    case "Twitter":
      return Twitter
    case "Instagram":
      return Instagram
    case "Facebook":
      return Facebook
    case "Youtube":
      return Youtube
    case "Linkedin":
      return Linkedin
    case "Mail":
      return Mail
    case "Globe":
      return Globe
    case "Music":
      return Music
    case "Video":
      return Video
    case "Image":
      return ImageIcon
    case "File":
      return FileText
    case "Code":
      return Code
    case "Book":
      return BookOpen
    case "Calendar":
      return Calendar
    default:
      return Link
  }
}
