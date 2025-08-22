import { useContext, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { OwnDataContext } from "../../provider/own_data";
import { postData } from "../../ultils/fetchAPI/fetch_API";
import { API_CREATE_STORY } from "../../API/api_server";
import { useNavigate } from "react-router-dom";
import { base64ToBlob } from "../../ultils/dataURLtoBLOB/dataURL_to_BLOB";
import { LoadingButton } from "@mui/lab";
import { generateRandomString } from "../../ultils/randomString/random_string";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 580,
  bgcolor: "var(--bg-color)",
  color: "var(--text-color)",
  boxShadow: "0px 0px 15px var(--shadow-1)",
  borderRadius: 5,
  border: "1px solid var(--border-color)",
  p: 3,
  display: "flex",
  flexDirection: "row",
  fontFamily: "'Roboto', sans-serif",
};

const imageStyle = {
  width: "300px",
  height: "auto",
  aspectRatio: "3 / 5",
  borderRadius: 5,
  boxShadow: "0px 0px 10px var(--shadow-1)",
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  marginLeft: 3,
  justifyContent: "space-between",
};

const PrivacyModal = ({ image, audio, open, handleClose }) => {
  const dataOwner = useContext(OwnDataContext);
  const [privacy, setPrivacy] = useState(dataOwner?.story_privacy || 1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (dataOwner) {
      setPrivacy(dataOwner.story_privacy);
    }
  }, [dataOwner]);

  useEffect(() => {
    if (audio) {
      const url = URL.createObjectURL(audio);
      setAudioUrl(url);

      // Clean up the URL when component unmounts or audio changes
      return () => {
        URL.revokeObjectURL(url);
        setAudioUrl(null);
      };
    }
  }, [audio]);

  const handleUploadStory = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("image", base64ToBlob(image), generateRandomString(4));
      if (audio) {
        payload.append("audio", audio, audio?.name);
      }
      payload.append("story_privacy", privacy);
      const response = await postData(API_CREATE_STORY, payload);
      if (response?.status) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {audioUrl && (
          <>
            <audio src={audioUrl} hidden autoPlay loop />
            <marquee
              style={{
                position: "absolute",
                fontSize: "13px",
                bottom: "31px",
                width: "300px",
                color: "white",
                background: "black",
                padding: "5px 0",
                textTransform: "uppercase",
              }}
            >
              {"Âm thanh: " + audio?.name}
            </marquee>
          </>
        )}
        <Box component="img" src={image} alt="Mô tả ảnh" sx={imageStyle} />
        <Box sx={contentStyle}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              sx={{ mb: 2 }}
            >
              Chọn quyền riêng tư
            </Typography>
            <RadioGroup
              value={privacy}
              onChange={(e) => setPrivacy(Number(e.target.value))}
              name="privacy-options"
            >
              <FormControlLabel
                value={1}
                control={<Radio sx={{ color: "var(--primary-color)" }} />}
                label="Mọi người"
                sx={{ color: "var(--text-color)" }}
              />
              <FormControlLabel
                value={0}
                control={<Radio sx={{ color: "var(--primary-color)" }} />}
                label="Chỉ mình tôi"
                sx={{ color: "var(--text-color)" }}
              />
            </RadioGroup>
          </Box>
          {!loading ? (
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                bgcolor: "var(--active-color)",
                color: "white",
                "&:hover": { bgcolor: "var(--blue-link)" },
              }}
              onClick={handleUploadStory}
            >
              Đăng tin
            </Button>
          ) : (
            <LoadingButton
              color="info"
              loading={loading}
              loadingPosition="start"
              variant="contained"
            >
              Đang tải...
            </LoadingButton>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PrivacyModal;
