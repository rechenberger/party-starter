import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { Switch } from '@/components/ui/switch'
import { db } from '@/db/db'
import {
  streamDialog,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ActionWrapper } from '@/super-action/button/ActionWrapper'
import { SuperInput } from './SuperInput'

export default function Page() {
  return (
    <>
      <ActionButton
        action={async () => {
          'use server'
          return openMyDialog({ active: false, name: '' })
        }}
      >
        Open My Dialog
      </ActionButton>
    </>
  )
}

type MyData = {
  active: boolean
  name: string
}

const openMyDialog = async (myData: MyData) => {
  'use server'
  return superAction(async () => {
    streamDialog({
      title: 'My Dialog',
      content: <MyDialog myData={myData} />,
    })
  })
}

const MyDialog = async ({ myData }: { myData: MyData }) => {
  let users = await db.query.users.findMany()
  users = users.filter(
    (user) => myData.name && user.email?.includes(myData.name),
  )
  return (
    <>
      <SimpleDataCard
        data={{ ...myData, users: users.map((user) => user.email) }}
      />
      <ActionWrapper
        action={async () => {
          'use server'
          return openMyDialog({ ...myData, active: !myData.active })
        }}
      >
        <Switch checked={myData.active} />
      </ActionWrapper>
      <SuperInput
        defaultValue={myData.name}
        action={async (value) => {
          'use server'
          return openMyDialog({ ...myData, name: value })
        }}
      />
      <ActionButton
        disabled={!myData.active}
        action={async () => {
          'use server'
          return superAction(async () => {
            streamDialog(null)
            streamToast({
              title: 'Saved',
              description: <SimpleDataCard data={myData} />,
            })
          })
        }}
      >
        Submit
      </ActionButton>
    </>
  )
}
