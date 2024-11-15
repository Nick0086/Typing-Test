import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TabsContent } from '@/components/ui/tabs'
import FaceRecognitionIndex from '@/components/FaceRecognition/FaceRecognitionIndex'
import FaceRecognitionModal from '@/components/FaceRecognition/FaceRecognitionModal'
import FaceRecognitionDashBoard from '@/components/FaceRecognition/FaceRecognitionDashBoard'

export default function FaceRecognitionRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FaceRecognitionIndex />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TabsContent value="dashboard"><FaceRecognitionDashBoard/></TabsContent>} />
        <Route path="face-detection" element={<TabsContent value="face-detection"><FaceRecognitionModal/></TabsContent>} />
      </Route>
    </Routes>
  )
}