import Navbar from './components/Navbar';
import StickyCanvas from './components/StickyCanvas';
import KeyFacts from './components/KeyFacts';
import WorkCards from './components/WorkCards';
import Services from './components/Services';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <StickyCanvas />
      <KeyFacts />
      <WorkCards />
      <Services />
    </div>
  );
}

export default App;
