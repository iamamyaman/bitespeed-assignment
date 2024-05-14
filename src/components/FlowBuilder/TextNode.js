import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { Handle, Position } from "reactflow";

const TextNode = ({ data, active }) => {
  return (
    <div
      className={`text-node ${
        data?.active ? "border-solid border-[1px] border-blue-300" : ""
      } w-[150px] '
      h-auto rounded-md overflow-hidden shadow-lg opacity-100 z-50
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />

      <div className="topbar text-[10px] text-black bg-green-100  px-1 py-[2px] flex gap-1 items-center">
        <BiMessageRoundedDetail size={10} />
        <p className="font-semibold">Send Message</p>
      </div>

      <div className="message text-[10px] text-black bg-white  px-2 py-1">
        {data?.label}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default TextNode;
