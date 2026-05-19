import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "480px",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--color-background-paper)",
          border: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 28, color: "text.secondary" }} />
      </div>

      <h1
        style={{
          fontSize: 96,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: -4,
          margin: "0 0 8px",
          color: "#1a1a1a",
        }}
      >
        4<span style={{ color: "#bbb" }}>0</span>4
      </h1>

      <div
        style={{
          width: 40,
          height: 2,
          background: "#e0e0e0",
          borderRadius: 2,
          margin: "1.5rem auto",
        }}
      />

      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 10px" }}>
        Page not found
      </h2>
      <p
        style={{
          fontSize: 15,
          color: "#666",
          maxWidth: 360,
          lineHeight: 1.7,
          margin: "0 0 2rem",
        }}
      >
        This page doesn't exist or you don't have permission to view it. Contact
        your admin if you think this is a mistake.
      </p>
    </div>
  );
};

export default NotFound;
