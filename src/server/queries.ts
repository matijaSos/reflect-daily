import HttpError from '@wasp/core/HttpError.js';
import { Reflection } from "@wasp/entities"
import { GetReflections } from "@wasp/queries/types"

export const getReflections: GetReflections<void, Reflection[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const reflections = await context.entities.Reflection.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { user: { id: context.user.id } } 
  })

  return reflections
}