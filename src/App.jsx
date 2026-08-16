import Navbar from './components/Navbar';
import StickyCanvas from './components/StickyCanvas';
import KeyFacts from './components/KeyFacts';
import WorkCards from './components/WorkCards';
import ClientStories from './components/ClientStories';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <StickyCanvas />
      <KeyFacts />
      <WorkCards />
      <ClientStories />
    </div>
  );
}

export default App;
