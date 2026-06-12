import Home from './pages/Home.jsx';
import { ContentProvider } from './content/ContentContext.jsx';

export default function App() {
  return (
    <ContentProvider>
      <Home />
    </ContentProvider>
  );
}
