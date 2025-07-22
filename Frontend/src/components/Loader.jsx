import { ThreeDot } from "react-loading-indicators";

const Loader = () => {
  return (
    <div>
        <div className="full-screen-loader absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-80 text-white text-3xl flex flex-col justify-center items-center gap-3 z-100">
            {<ThreeDot variant="bounce" color="#3b82f6" size="large" />}
            <p>Running Code</p>
        </div>
    </div>
  )
}

export default Loader;