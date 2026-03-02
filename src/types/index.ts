export interface Website {
  id: string
  title: string
  description?: string
  url: string
  category: string
  technologies?: string[]
  images?: string[]
  badges?: string[]
  featured?: boolean
  tags?: string[]
  status?: string
  client?: string
  hidden?: boolean
  displayOrder?: number
}