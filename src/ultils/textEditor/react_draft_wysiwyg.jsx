import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
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

  // Hàm xử lý initialContent khi nhận được nội dung ban đầu
  useEffect(() => {
    if (initialContent && typeof initialContent === "string") {
      const blocksFromHTML = convertFromHTML(initialContent.trim());
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialContent]);

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
  
      // Tạo mentionMap từ danh sách suggestions
      const mentionMap = dataFriends?.reduce((acc, item) => {
        acc[`@${item.user_nickname}`] = `/profile/${item.friend_id}`;
        return acc;
      }, {}) || {};
  
      // Lưu mentions vào một biến để sử dụng sau này
      const mentionList = dataFriends?.map((item) => ({
        value: `@${item.user_nickname}`,
        url: `/profile/${item.friend_id}`,
        nickname: item.user_name,
      })) || [];
  
      // Chuyển đổi nội dung thành HTML với thẻ <a> cho mentions
      let html = convertToHTML({
        blockToHTML: (block) => {
          let formattedText = block.text;
  
          // Thay thế các mention trong text thành <a> tags
          const mentionRegex = /(@[a-zA-Z0-9_]+)/g;
          formattedText = formattedText.replace(mentionRegex, (match) => {
            const userUrl = mentionMap[match]; // Lấy URL từ mentionMap
            return userUrl ? `<a href="${userUrl}">${match}</a>` : match;
          });
  
          // Thêm hashtag vào HTML nếu cần
          const hashtagRegex = /(#\w+)/g;
          formattedText = formattedText.replace(hashtagRegex, (match) => {
            const hashtag = match.substring(1); // Lấy hashtag bỏ ký tự #
            return `<a href="/search/${hashtag}">${match}</a>`;
          });
  
          return {
            start: `<span>`,
            end: `</span>`,
            html: formattedText,
          };
        },
      })(editorState.getCurrentContent());
  
      // Trước khi gọi getText, thay thế những mention trong html
      mentionList.forEach((mention) => {
        const regex = new RegExp(`(${mention.value})`, "g");
        html = html.replace(regex, `<a href="${mention.url}">${mention.nickname}</a>`);
      });
  
      const result = {
        text: textArray.join(" "),
        html: html,  // HTML với các thẻ <a> đã được thay thế
        mentions: mentions,
        hashtags: hashtags,
      };

      console.log(result);
  
      // Kiểm tra xem HTML có thay đổi so với lần trước không
      if (html !== prevHtmlContent.current) {
        getText(result);  // Truyền cả text và html
        prevHtmlContent.current = html; // Cập nhật nội dung trước đó
      }
    }, 500),
    [editorState, dataFriends]  // Thêm dataFriends vào dependency list
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
            "fontSize", 
            "colorPicker", 
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
              "rgb(0, 0, 0)", 
              "rgb(255, 0, 0)", 
              "rgb(0, 255, 0)", 
              "rgb(0, 0, 255)", 
              "rgb(255, 255, 0)", 
              "rgb(255, 165, 0)", 
              "rgb(255, 192, 203)", 
              "rgb(128, 128, 128)", 
              "rgb(255, 255, 255)", 
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
