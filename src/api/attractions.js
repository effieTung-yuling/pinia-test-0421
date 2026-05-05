import req from "./index"; // 引用你設定好位址的實例
export const fetchAttractions = () => req.get("/api/Attractions");
export const fetchAttractionById = (id) => req.get(`/api/Attractions/${id}`);
