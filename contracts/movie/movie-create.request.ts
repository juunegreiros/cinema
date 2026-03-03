import { MovieRating } from './movie-rating.enum'

export interface MovieCreateRequest {
  title: string
  durationMinutes: number
  rating: MovieRating
  active: boolean
}
