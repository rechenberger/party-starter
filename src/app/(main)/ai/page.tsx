// const Text = createAiComponent()

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { z } from 'zod'
import { AiComponent } from './AiComponent'

export default async function Page() {
  return (
    <>
      <h1 className="text-2xl">AI</h1>
      {/* <AiList prompt="top 3 programming languages" /> */}

      <AiComponent
        prompt="3 Presidents of the United States"
        schema={z.object({
          list: z.array(
            z.object({
              firstName: z.string(),
              lastName: z.string(),
              dateOfBirth: z.string(),
              shortDescription: z.string(),
              // achievements: z.array(z.string()),
            }),
          ),
        })}
        render={async ({ data, done }) => {
          return (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {data?.list?.map((p, idx) => (
                  <Fragment key={idx}>
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle>
                          <span>{p?.firstName}</span>{' '}
                          <strong className="text-primary">
                            {p?.lastName}
                          </strong>
                        </CardTitle>
                        <div className="font-mono">{p?.dateOfBirth}</div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          <div>{p?.shortDescription}</div>
                          {done && (
                            <AiComponent
                              prompt={`The 3 greatest achievements of the President ${p?.firstName} ${p?.lastName}. 1 word each`}
                              schema={z.object({ list: z.array(z.string()) })}
                              render={async ({ data, done }) => {
                                return (
                                  <>
                                    <hr className="my-4" />
                                    <ul
                                      className={cn(
                                        'list-disc list-inside',
                                        !done && 'animate-pulse',
                                      )}
                                    >
                                      {data?.list?.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ul>
                                  </>
                                )
                              }}
                            />
                          )}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Fragment>
                ))}
              </div>
            </>
          )
        }}
      />
    </>
  )
}
