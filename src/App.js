import logo from './logo.svg';
import './App.css';
import FlowBuilder from "./components/FlowBuilder/FlowBuilder";
import ReactFlow from "reactflow";
import TextNode from "./components/FlowBuilder/TextNode";

function App() {
 
  return (
    <div className="App">
      <FlowBuilder />
    </div>
  );
}

export default App;
