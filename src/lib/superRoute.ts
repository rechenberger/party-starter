export const superRoute = <
  Params extends Record<string, string> = Record<string, string>,
>(
  func: (options: {
    request: Request
    params: Promise<Params>
  }) => Promise<unknown>,
) => {
  return async (request: Request, { params }: { params: Promise<Params> }) => {
    try {
      const data = await func({ request, params })
      if (data instanceof Response) {
        return data
      }
      return Response.json(data)
    } catch (error) {
      if (error instanceof SuperRouteError) {
        return Response.json({ error: error.message }, { status: error.status })
      }
      return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

export class SuperRouteError extends Error {
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.status = status
  }
}
