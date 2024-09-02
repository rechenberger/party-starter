import { ClientComp } from '@/components/demo/ClientComp'

export default async function Page() {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8">
        <h1 className="text-2xl lg:text-6xl">🎉 Welcome to the Party 🥳</h1>
        <ClientComp />
      </div>
    </>
  )
}
