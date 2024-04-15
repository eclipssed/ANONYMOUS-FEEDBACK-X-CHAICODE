import {z } from 'zod'

export const isaAcceptingMessagesSchema = z.object({
    isAcceptingMessages: z.boolean(),
})