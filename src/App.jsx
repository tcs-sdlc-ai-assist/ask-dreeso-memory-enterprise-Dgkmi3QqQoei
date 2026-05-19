import { BrowserRouter } from 'react-router-dom';

import { PersonaProvider } from './context/PersonaContext';
import { SessionProvider } from './context/SessionContext';
import { DemoProvider } from './context/DemoContext';
import { DemoFlowManager } from './components/DemoFlow/DemoFlowManager';

/**
 * Root application component.
 * Wraps the entire app in context providers (PersonaProvider, SessionProvider,
 * DemoProvider) and renders the DemoFlowManager as the main content.
 * @module App
 */
function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <DemoFlowManager />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;