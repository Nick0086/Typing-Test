import TypingTestDashboard from '@/components/typinyTest/typingTestDashboard'
import TypingTestIndex from '@/components/typinyTest/TypingTestIndex'
import TypingTest from '@/components/typinyTest/TypingTest'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TabsContent } from '@/components/ui/tabs'

export default function TypingTestRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TypingTestIndex />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<TabsContent value="dashboard"><TypingTestDashboard/></TabsContent>} />
                <Route path="typing" element={<TabsContent value="typing"><TypingTest/></TabsContent>} />
            </Route>
        </Routes>
    )
}
