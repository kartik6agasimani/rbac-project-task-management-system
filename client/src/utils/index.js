export const formatDate = (date) => {
  const inputDate = new Date(date);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const month = inputDate.toLocaleString("en-US", { month: "short" });
  const day = inputDate.getDate();
  const year = inputDate.getFullYear();

  return `${day}-${month}-${year}`;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getInitials(fullName = "User") {
  if (!fullName || typeof fullName !== "string") {
    return "U";
  }

  const names = fullName.trim().split(" ").filter(Boolean);

  if (names.length === 0) {
    return "U";
  }

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (
    names[0].charAt(0).toUpperCase() +
    names[1].charAt(0).toUpperCase()
  );
}

export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  normal: "text-green-600",
  low: "text-blue-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];