import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export default function FaceRecognitionIndex() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState();

    useEffect(() => {
        const path = location.pathname.split('/');
        const tab = path[2]
        setSelectedTab(tab);
    }, [location]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        navigate(`/face-recognition/${tab}`);
    }
  return (
    <div className="tw-shadow-custom main-wrapper main-wrapper-1 " style={{ fontFamily: 'Nunito, "Segoe UI", arial' }} >
            <div className="main-content tw-text-xs sm:tw-text-base ">
                <section className="section">
                    <div className="tw-w-full tw-p-0 tw-mx-auto">
                        <div className="tw-mb-2">
                            {/* <Breadcrumb
                                breadcrumbList={breadcrumbList}
                                className="custom-breadcrumb"
                                activeItemClassName="active-item"
                            /> */}
                        </div>
                        <div className='tw-flex tw-flex-wrap '>
                            <div className='tw-shadow-xl  tw-w-full !tw-border-none !tw-rounded-none'>
                                <div className="tw-mt-2 tw-w-full tw-mx-auto tw-px-0">
                                    <Tabs value={selectedTab} className='tw-border-none tw-w-full' onValueChange={handleTabChange}>
                                        <TabsList className='tw-flex tw-flex-wrap tw-w-full tw-h-auto tw-pt-2 tw-border-b tw-border-gray-300'>
                                            <TabsTrigger value='dashboard' variant='team' className='tw-text-green-500 tw-border-green-500 data-[state=active]:tw-bg-green-200 data-[state=active]:tw-text-green-700'>
                                                Dashboard
                                            </TabsTrigger>
                                            <TabsTrigger value='face-detection' variant='team' className='tw-text-red-500 tw-border-red-500 data-[state=active]:tw-bg-red-200 data-[state=active]:tw-text-red-700'>
                                                Face
                                            </TabsTrigger>
                                        </TabsList>
                                        <Outlet />
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
  )
}
