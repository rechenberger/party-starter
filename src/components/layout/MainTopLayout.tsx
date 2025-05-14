import { MainTopResponsive } from './MainTopResponsive'

export const MainTopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <MainTop /> */}
      <MainTopResponsive />
      <hr />
      <div className="container flex flex-col gap-8 py-8 flex-1">
        {children}
      </div>
    </>
  )
}
