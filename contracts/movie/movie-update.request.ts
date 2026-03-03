import { MovieRating } from './movie-rating.enum'

export interface MovieUpdateRequest {
  title?: string
  durationMinutes?: number
  rating?: MovieRating
  active?: boolean
}
