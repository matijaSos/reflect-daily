import HttpError from '@wasp/core/HttpError.js';

import { Reflection } from '@wasp/entities'
import { CreateReflection } from '@wasp/actions/types'

type CreateReflectionPayload = Pick<Reflection, "dayRating" | "biggestWin" | "badMoment">

export const createReflection: CreateReflection<CreateReflectionPayload, Reflection> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Reflection.create({
    data: {
      dayRating: args.dayRating,
      biggestWin: args.biggestWin,
      badMoment: args.badMoment,
      user: { connect: { id: context.user.id} }
    },
  })

}