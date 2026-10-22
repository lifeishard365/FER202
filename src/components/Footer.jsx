import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#dfe1e3",
        color: "#3f4549",
        padding: "18px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        fontSize: "20px",
        lineHeight: 1.5,
        marginTop: "24px",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "left", flex: 1 }}>
        Bản quyền © 2026 FAP - Trường đại học FPT.
      </div>
      <div style={{ textAlign: "right", flex: 1 }}>Phiên bản: 2.0.0.0</div>
    </footer>
  );
}

export default Footer;
