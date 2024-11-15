import './App.css'
import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SideBar from './components/ui/sidebar';
import Header from './components/ui/Header';
import TypingTestRoutes from './routes/TypingTestRoutes';
import FaceRecognitionRoutes from './routes/FaceRecognitionRoutes';

function App() {

  const [asidebar, setasidebar] = useState(false);

  const currentPath = useLocation();

  const collepsHandler = () => {
    setasidebar(!asidebar)
  }

  return (
    <div className="tw-flex tw-justify-between tw-w-full tw-font-nunito-sans">
      {
        <SideBar
          navColleps={asidebar}
          collepsHandler={collepsHandler}
        />
      }
      <div className={`tw-duration-300 tw-ease-in-out  tw-w-full ${asidebar ? "lg:tw-max-w-[calc(100%-60px)] lg:tw-min-w-[calc(100%-60px)]" : "lg:tw-max-w-[calc(100%-250px)] lg:tw-min-w-[calc(100%-250px)]"}`} >
        <Header collepsHandler={collepsHandler} />
        <div className={`tw-bg-transparent tw-m-5`}>
          <Routes>
            {/* added your routes here */}
            <Route path='/' element={<div>{"Hey 🙋‍♂️"}</div>} />
            <Route path='/typing-test/*' element={<TypingTestRoutes />} />
            <Route path='/face-recognition/*' element={<FaceRecognitionRoutes />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App;