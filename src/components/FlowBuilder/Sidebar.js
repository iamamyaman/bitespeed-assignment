import React from "react";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";

const Sidebar = ({
  selectedEditableNode,
  setSelectedEditableNode,
  onChangeNodeContent,
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-[350px] border-solid border-l-2 ">
      {!selectedEditableNode ? (
        <div
          className="dndnode w-1/2 p-2 m-2 border-solid border-[1px] border-blue-700  flex flex-col justify-center items-center text-blue-700 text-[10px] rounded-[5px] cursor-pointer"
          onDragStart={(event) => onDragStart(event, "text")}
          draggable
        >
          <BiMessageRoundedDetail size={15} />
          Message
        </div>
      ) : (
        <div className="w-full">
          <div className="top relative w-full flex justify-center items-center border-b-[1px] border-gray-200 py-2 text-[12px] font-semibold">
            <IoMdArrowRoundBack
              size={15}
              className="absolute left-2 cursor-pointer"
              onClick={() => setSelectedEditableNode(null)}
            />
            <p className="self-center"> Message</p>
          </div>
          <div className="p-3 text-[12px] text-gray-500">
            <p>Text</p>
            <textarea
              className="w-full h-24 border-[1px] border-gray-200 rounded-md mt-2 p-2"
              value={selectedEditableNode?.data?.label}
              onChange={(e) => onChangeNodeContent(e.target.value)}
            ></textarea>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
