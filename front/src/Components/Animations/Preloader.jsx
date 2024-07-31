const Preloader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid black",
          borderTop: "5px solid blue",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}></div>
    </div>
  );
};

export default Preloader;
