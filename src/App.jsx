import Navbar from './components/Navbar';
import StickyCanvas from './components/StickyCanvas';
import WorkCards from './components/WorkCards';
import KeyFacts from './components/KeyFacts';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <StickyCanvas />
      <KeyFacts />
      <WorkCards />
    </div>
  );
}

export default App;
