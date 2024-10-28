import logo from '/logo_q.svg'

export const Loading = () => {
    return <div className="flex justify-center items-center w-full h-screen"><img className="animate-spin" src={logo} width={20} /></div>
}