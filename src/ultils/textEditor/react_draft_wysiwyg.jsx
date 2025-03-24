import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ initialContent, getText }) => {
  const editorRef = useRef(null);
  const handleEditorChange = (content) => {
    const mentions = content.match(/@\w+/g) || [];
    const hashtags = content.match(/#\w+/g) || [];

    getText({
      text: content.replace(/<[^>]*>?/gm, ""), // Lọc bỏ thẻ HTML để lấy text thuần
      html: content,
      mentions,
      hashtags,
    });
  };

  return (
    <Editor
      apiKey="on891pw4e6e919vmtxxs8u19wg917thpgssk32sw0mty1qe0" // Thay thế bằng API key của bạn nếu cần
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialContent || ""}
      init={{
        height: 600,
        menubar: false,
        plugins: [
          "link", "lists", "autoresize", "code", "textcolor", "colorpicker", "fontfamily", "fontsize"
        ],
        toolbar:
          "undo redo | bold italic underline | forecolor backcolor | fontsizeselect fontselect | bullist numlist | link code",
        font_family_formats:
          "Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace;",
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt",
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;
