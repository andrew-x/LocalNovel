export type Story = {
  id: string
  title: string
  tags: string[]

  plot: string // for ai
  style: string // for ai

  createdAt: number
  updatedAt: number
}
