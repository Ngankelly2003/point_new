
export const FileTypeLabel: Record<number, string> = {
  0: "Point Cloud",
  1: "IFC",
};


export const StatusMap: Record<string, string> = {

0: "Success",

1: "Failure",

2: "Pending",

3: "Processing"
};

export const getStatusStyle = (statusCode: string | number) => {
  const statusText = StatusMap[statusCode];
  switch (statusText?.toLowerCase()) {
    case "success":
      return {
        text: statusText,
        color: "green",
        textColor: "green",
        bgColor: "#f6ffed",
      };
    case "failure":
      return {
        text: statusText,
        color: "red",
        textColor: "red",
        bgColor: "#fff1f0",
      };
    case "processing":
      return {
        text: statusText,
        color: "#1890ff",
        textColor: "#1890ff",
        bgColor: "#e6f7ff",
      };
    case "pending":
      return {
        text: statusText,
        color: "#faad14",
        textColor: "#faad14",
        bgColor: "#fffbe6",
      };
    default:
      return {
        text: statusText || "Unknown",
        color: "#d9d9d9",
        textColor: "#333",
        bgColor: "#fafafa",
      };
  }
};
