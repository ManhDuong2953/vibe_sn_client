import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from "draft-js";
import { convertToHTML } from "draft-convert";
import debounce from "lodash/debounce";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./react_draft_wysiwyg.scss";
import { getData } from "../fetchAPI/fetch_API";
import { API_FRIEND_LIST } from "../../API/api_server";
import { OwnDataContext } from "../../provider/own_data";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({ initialContent, getText }) => {
  const [editorState, setEditorState] = useState(
    initialContent ? EditorState.createEmpty() : EditorState.createEmpty()
  );
  const prevHtmlContent = useRef(""); // Sử dụng useRef để lưu trữ nội dung trước đó
  const editorRef = useRef(null); // Khai báo editorRef để sử dụng trong editor
  const [dataFriends, setDataFriends] = useState([]);
  const dataOwner = useContext(OwnDataContext);
  useEffect(() => {
    try {
      if (!dataOwner) return;
      const fetchFriends = async () => {
        const result = await getData(
          API_FRIEND_LIST(dataOwner && dataOwner.user_id)
        );
        if (result.status) {
          setDataFriends(result?.data);
        }
      };
      fetchFriends();
    } catch (error) {
      console.error(error);
    }
  }, [dataOwner]);
  // Set editorState từ initialContent nếu có
  useEffect(() => {
    if (
      initialContent &&
      typeof initialContent === "string" &&
      editorState.getCurrentContent().hasText() === false
    ) {
      const blocksFromHTML = convertFromHTML(initialContent.trim());
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialContent, editorState]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focusEditor();
    }
  }, []);

  // Hàm debounce để log content khi nội dung thay đổi
  const logContent = useCallback(
    debounce(() => {
      const content = convertToRaw(editorState.getCurrentContent());
      const textArray = [];
      const mentions = [];
      const hashtags = [];

      content.blocks.forEach((block) => {
        const text = block.text;
        textArray.push(text);

        const words = text.split(" ");
        words.forEach((word) => {
          if (word.startsWith("@")) {
            mentions.push(word);
          } else if (word.startsWith("#")) {
            hashtags.push(word);
          }
        });
      });

      const html = convertToHTML(editorState.getCurrentContent());

      const result = {
        text: textArray.join(" "),
        html: html,
        mentions: mentions,
        hashtags: hashtags,
      };

      // Kiểm tra xem html có thay đổi so với lần trước không
      if (html !== prevHtmlContent.current) {
        getText(result);
        prevHtmlContent.current = html; // Cập nhật nội dung trước đó
      }
    }, 500),
    [editorState]
  );

  useEffect(() => {
    logContent(); // Gọi lại hàm logContent mỗi khi editorState thay đổi
  }, [editorState, logContent]);

  return (
    <div className="editor-container">
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        ref={editorRef}
        toolbar={{
          options: [
            "inline",
            "list",
            "textAlign",
            "history",
            "fontSize", // Ensure fontSize is added to options
            "colorPicker", // Ensure colorPicker is added to options
          ],
          inline: {
            inDropdown: false,
          },
          list: {
            inDropdown: false,
          },
          textAlign: {
            inDropdown: false,
          },
          history: {
            inDropdown: false,
          },
          fontSize: {
            options: ["8", "10", "12", "14", "16", "18", "24", "30", "36"], // Font sizes
          },
          colorPicker: {
            colors: [
              "rgb(0, 0, 0)", // Black
              "rgb(255, 0, 0)", // Red
              "rgb(0, 255, 0)", // Green
              "rgb(0, 0, 255)", // Blue
              "rgb(255, 255, 0)", // Yellow
              "rgb(255, 165, 0)", // Orange
              "rgb(255, 192, 203)", // Pink
              "rgb(128, 128, 128)", // Gray
              "rgb(255, 255, 255)", // White
            ],
          },
        }}
        mention={{
          separator: " ",
          trigger: "@",
          suggestions:
            dataFriends?.map((item) => ({
              text: item?.user_name,
              value: item?.user_nickname,
              url: "/profile/" + item?.friend_id,
            })) || [],
        }}
        hashtag={{
          separator: " ",
          trigger: "#",
        }}
      />
    </div>
  );
};

export default TextEditor;
