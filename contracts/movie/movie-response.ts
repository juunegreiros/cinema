import { MovieRating } from './movie-rating.enum'

export interface MovieResponse {
  id: string
  title: string
  durationMinutes: number
  rating: MovieRating
  active: boolean
  createdAt: string
  updatedAt: string
}
