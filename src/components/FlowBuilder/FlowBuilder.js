import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import TextNode from "./TextNode";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";

const snapGrid = [20, 20];
const connectionLineStyle = { stroke: "#000" };

const initialNodes = [
  {
    id: "a1",
    type: "text",
    data: { label: " Node 1", active: false },
    position: { x: 100, y: 0 },
  },

  {
    id: "a2",
    // you can also pass a React component as a label
    data: { label: "Node 2", active: false },
    position: { x: 350, y: 0 },
    type: "text",
  },
];

let id = initialNodes?.length + 1;
const getId = () => `a${id++}`;

const nodeTypes = {
  text: TextNode,
};

const initialEdges = [
  {
    id: "e1-2",
    source: "a1",
    target: "a2",

    style: {
      zIndex: 100,
    },
  },
];

const FlowBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedEditableNode, setSelectedEditableNode] = useState(null);
  const [error, setError] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const sourceHasOutgoingEdge = eds.some(
        (edge) => edge.source === params.source
      );

      if (sourceHasOutgoingEdge) {
        return eds;
      }

      return [...eds, params];
    });
  }, []);

  const handleNodeClick = (node) => {
    setSelectedEditableNode({ ...node });
    // Update nodes to set active status
    const updatedNodes = nodes?.map((n) => {
      if (n?.id === node?.id) {
        return { ...n, data: { ...n?.data, active: true } };
      } else {
        return { ...n, data: { ...n?.data, active: false } };
      }
    });

    setNodes(updatedNodes);
  };

  const onChangeNodeContent = (text) => {
    console.log(text);
    setSelectedEditableNode({
      ...selectedEditableNode,
      data: { ...selectedEditableNode.data, label: text },
    });

    const updatedNodes = nodes.map((n, id) => {
      if (selectedEditableNode?.id === n?.id)
        return { ...n, data: { ...n.data, label: text } };
      else return n;
    });

    setNodes(updatedNodes);
  };

  const validateNodes = () => {
    const nodesWithNoIncomingEdges = nodes.filter((node) => {
      return !edges.some((edge) => edge.target === node.id);
    });

    if (nodesWithNoIncomingEdges.length > 1) {
      setError("Cannot save flow");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="w-full h-[100vh] overflow-hidden">
      <header className="h-[50px] border-[1px] border-gray-200 bg-gray-100 flex justify-end items-center pr-[80px] relative">
        {error && (
          <div className="justify-start absolute left-[20%] top-1 rounded-md py-2 px-4 bg-red-200 font-semibold">
            {error}
          </div>
        )}
        <button
          className="text-[13px] font-semibold text-blue-800 border-2 border-blue-800 rounded-md py-2 px-4"
          onClick={validateNodes}
        >
          Save changes
        </button>
      </header>
      <div className="flex h-full">
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper w-full w-[calc(100% - 350px]"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(event, node) => handleNodeClick(node)}
              nodeTypes={nodeTypes}
              snapGrid={snapGrid}
              connectionLineStyle={connectionLineStyle}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Background variant="dots" gap={10} size={1} />
              <Controls position="top-right" />
            </ReactFlow>
          </div>
        </ReactFlowProvider>

        <Sidebar
          selectedEditableNode={selectedEditableNode}
          setSelectedEditableNode={setSelectedEditableNode}
          onChangeNodeContent={onChangeNodeContent}
        />
      </div>
    </div>
  );
};

export default FlowBuilder;
