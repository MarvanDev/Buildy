// src/App.tsx
import { WizardLayout } from './components/wizard/WizardLayout'
import { ProtectedRoute } from './auth/components/ProtectedRoute'

function App() {
  return (
    <ProtectedRoute>
      <WizardLayout />
    </ProtectedRoute>
  )
}

export default App