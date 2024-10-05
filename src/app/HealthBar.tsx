interface Props {
  value: number;
  type: string;
}

export default function HealthBar({ value, type }: Props) {
  var color = "white";
  var fontColor = "black";
  if (value > 50) {
    fontColor = "white";
  }
  console.log(type);
  switch (type) {
    case "Health":
      color = "#DC143C";
      break;
    case "Energy":
      color = "#3CB371";
      break;
    case "Mental":
      color = "#6A5ACD";
      break;
    case "Spirit":
      color = "#FFA500";
      break;
    case "Skills":
      color = "#008080";
      break;
    case "Wisdom":
      color = "#4B0082";
      break;
  }
  return (
    <div className="container">
      <div className="label">{type}:</div>
      <div
        className="bar"
        style={{
          width: "50%",
          height: "40px",
          backgroundColor: "white",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            color: `${fontColor}`,
            zIndex: 2,
            
          }}
        >
          {value}
        </span>
        <div
          className="bar-inner"
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: `${color}`,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        ></div>
      </div>
    </div>
  );
}
