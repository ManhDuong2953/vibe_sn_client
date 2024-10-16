import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import "./tool_tip.scss";
import { v4 as uuidv4 } from "uuid";
function ToolTipCustom({ children, content, place = "bottom" }) {
  const id = uuidv4(); // Tạo id duy nhất cho mỗi tooltip
  return (
    <div>
      <div data-tooltip-id={id}>{children}</div>

      {/* Tooltip */}
      <Tooltip
        id={id}
        className="tooltip-custom"
        place={place}
        effect="solid"
        delayShow={100}
        delayHide={100}
        border={"0.1px solid red"}
      >
        {content}
      </Tooltip>
    </div>
  );
}

export default ToolTipCustom;
