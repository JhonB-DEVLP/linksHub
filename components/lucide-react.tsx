// Este arquivo é apenas para definir o componente DragDropIcon que não existe no pacote lucide-react
import type { LightbulbIcon as LucideProps } from "lucide-react"

export function DragDropIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 5h10"></path>
      <path d="M11 9h10"></path>
      <path d="M11 13h10"></path>
      <path d="M11 17h10"></path>
      <path d="M3 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
      <path d="M3 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
      <path d="M3 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
      <path d="M3 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
    </svg>
  )
}
