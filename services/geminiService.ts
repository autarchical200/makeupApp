import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if key exists, but handle missing key in methods
const ai = new GoogleGenAI({ apiKey });

export const getAIAdvice = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "Hệ thống AI chưa được cấu hình (thiếu API Key). Vui lòng liên hệ quản trị viên.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `Bạn là một chuyên gia tư vấn trang điểm (Makeup Consultant) chuyên nghiệp, thân thiện và am hiểu xu hướng tại Việt Nam. 
        Nhiệm vụ của bạn là tư vấn phong cách trang điểm dựa trên sự kiện, trang phục hoặc khuôn mặt mà khách hàng mô tả.
        Hãy đưa ra lời khuyên ngắn gọn, cụ thể (dưới 100 từ). 
        Nếu khách hàng hỏi về giá cả, hãy nhắc họ xem bảng giá dịch vụ (Service List) của cửa hàng.
        Luôn xưng hô là "mình" hoặc "GlowAI" và gọi khách là "bạn".`,
      }
    });
    
    return response.text || "Xin lỗi, mình chưa nghĩ ra câu trả lời phù hợp. Bạn thử hỏi lại nhé?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hiện tại mình đang gặp chút sự cố kết nối. Bạn vui lòng thử lại sau giây lát nhé.";
  }
};
