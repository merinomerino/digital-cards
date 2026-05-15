import { describe, it, expect } from 'vitest'
import { DatabaseError } from './firestore'

describe('DatabaseError', () => {
  it('creates error with correct name', () => {
    const error = new DatabaseError('Custom message')
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('DatabaseError')
    expect(error.message).toBe('Custom message')
  })
})
